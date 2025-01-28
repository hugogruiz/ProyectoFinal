<template>
  <div class="container">
    <header class="header">
      <h1 class="title">Cursos</h1>
    </header>

    <div class="content">
      <!-- Formulario para agregar curso -->
      <section class="form-section">
        <h2 class="section-title">Registro de Curso</h2>
        <form @submit.prevent="agregarCurso" class="form">
          <div class="form-group">
            <input 
              v-model="nuevoCurso.nombre" 
              placeholder="Nombre del curso" 
              required 
              class="input" 
            />
          </div>
          <div class="form-group">
            <input 
              v-model="nuevoCurso.creditos" 
              type="number" 
              placeholder="Créditos" 
              required 
              class="input" 
            />
          </div>
          <button type="submit" class="btn btn-primary">Registrar</button>
        </form>
      </section>

      <!-- Tabla de cursos -->
      <section class="table-section">
        <h2 class="section-title">Lista de Cursos</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Créditos</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="curso in cursos" :key="curso.id">
              <td>{{ curso.nombre }}</td>
              <td>{{ curso.creditos }}</td>
              <td class="actions">
                <button @click="mostrarRelaciones(curso)" class="btn btn-info">
                  Acerca de
                </button>
                <button @click="eliminarCurso(curso.id)" class="btn btn-danger">
                  Eliminar curso
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <!-- Sección de relaciones del curso -->
    <section v-if="cursoSeleccionado" class="courses-section">
      <h2 class="section-title">Información del curso</h2>
      
      <!-- Profesor asignado -->
      <div class="relation-subsection">
        <h3 class="subtitle">Profesor Asignado</h3>
        <div class="assignment-container">
          <p v-if="profesorDelCurso" class="current-assignment">
            {{ profesorDelCurso.nombre }}
            <button @click="eliminarProfesor(profesorDelCurso.id)" class="btn btn-danger">
              Eliminar profesor
            </button>
          </p>
          <p v-else class="no-assignment">No hay profesor asignado</p>
          
          <form @submit.prevent="asignarProfesor" class="assignment-form">
            <select v-model="profesorSeleccionado" class="input">
              <option value="">Seleccionar profesor</option>
              <option v-for="profesor in profesores" :key="profesor.id" :value="profesor.id">
                {{ profesor.nombre }}
              </option>
            </select>
            <button type="submit" class="btn btn-primary">Asignar Profesor</button>
          </form>
        </div>
      </div>

      <!-- Estudiantes inscritos -->
      <div class="relation-subsection">
        <h3 class="subtitle">Estudiantes Inscritos</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Matrícula</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alumno in estudiantesDelCurso" :key="alumno.id">
              <td>{{ alumno.nombre }}</td>
              <td>{{ alumno.matricula }}</td>
              <td class="actions">
                <button @click="eliminarAlumno(alumno.id)" class="btn btn-danger">
                  Eliminar estudiante
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <form @submit.prevent="inscribirAlumno" class="assignment-form">
          <select v-model="alumnoSeleccionado" class="input">
            <option value="">Seleccionar estudiante</option>
            <option v-for="alumno in alumnos" :key="alumno.id" :value="alumno.id">
              {{ alumno.nombre }}
            </option>
          </select>
          <button type="submit" class="btn btn-primary">Inscribir Estudiante</button>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import apiService from "@/services/apiService";

export default {
  data() {
    return {
      cursos: [],
      profesores: [],
      alumnos: [],
      estudiantesDelCurso: [],
      nuevoCurso: { nombre: "", creditos: "" },
      cursoSeleccionado: null,
      profesorDelCurso: null,
      profesorSeleccionado: null,
      alumnoSeleccionado: null,
    };
  },
  methods: {
    async cargarDatos() {
      try {
        const [cursosResponse, profesoresResponse, alumnosResponse] = await Promise.all([
          apiService.getAllCursos(),
          apiService.getAllMaestros(),
          apiService.getAllAlumnos(),
        ]);
        this.cursos = cursosResponse.data;
        this.profesores = profesoresResponse.data;
        this.alumnos = alumnosResponse.data;
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    },
    async agregarCurso() {
      try {
        await apiService.addCurso(this.nuevoCurso);
        this.nuevoCurso = { nombre: "", creditos: "" };
        this.cargarDatos();
      } catch (error) {
        console.error("Error al agregar curso:", error);
      }
    },
    async eliminarCurso(id) {
      try {
        await apiService.deleteCurso(id);
        this.cargarDatos();
      } catch (error) {
        console.error("Error al eliminar curso:", error);
      }
    },
    async mostrarRelaciones(curso) {
      try {
        const cursoResponse = await apiService.getCursoById(curso.id);
        const profesoresResponse = await apiService.getProfesoresDelCurso(curso.id);
        const estudiantesResponse = await apiService.getEstudiantesDeCurso(curso.id);

        this.cursoSeleccionado = cursoResponse.data;
        this.profesorDelCurso = profesoresResponse.data.length ? profesoresResponse.data[0] : null;
        this.estudiantesDelCurso = estudiantesResponse.data;
      } catch (error) {
        console.error("Error al cargar relaciones del curso:", error);
      }
    },
    async asignarProfesor() {
      if (!this.profesorSeleccionado) {
        alert("Por favor selecciona un profesor.");
        return;
      }
      try {
        await apiService.asignarProfesorACurso({
          profesorId: this.profesorSeleccionado,
          cursoId: this.cursoSeleccionado.id,
        });
        this.mostrarRelaciones(this.cursoSeleccionado);
      } catch (error) {
        console.error("Error al asignar profesor:", error);
      }
    },
    async inscribirAlumno() {
      if (!this.alumnoSeleccionado) {
        alert("Por favor selecciona un alumno.");
        return;
      }
      try {
        await apiService.inscribirAlumnoACurso({
          estudianteId: this.alumnoSeleccionado,
          cursoId: this.cursoSeleccionado.id,
        });
        this.mostrarRelaciones(this.cursoSeleccionado);
      } catch (error) {
        console.error("Error al inscribir alumno:", error);
      }
    },
    async eliminarProfesor(profesorId) {
      try {
        await apiService.eliminarProfesorDeCurso({
          profesorId,
          cursoId: this.cursoSeleccionado.id,
        });
        this.mostrarRelaciones(this.cursoSeleccionado);
      } catch (error) {
        console.error("Error al eliminar profesor:", error);
      }
    },
    async eliminarAlumno(alumnoId) {
      try {
        await apiService.eliminarAlumnoDeCurso({
          estudianteId: alumnoId,
          cursoId: this.cursoSeleccionado.id,
        });
        this.mostrarRelaciones(this.cursoSeleccionado);
      } catch (error) {
        console.error("Error al eliminar alumno:", error);
      }
    },
  },
  mounted() {
    this.cargarDatos();
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  color: #333;
  background-color: #28a745;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
  background-color: #28a745;
  padding: 1rem 0;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
}

.content {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.form-section {
  flex: 1;
  min-width: 300px;
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-section {
  flex: 3;
  min-width: 500px;
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.5rem;
  color: #067928;
  margin-bottom: 1rem;
}

.form {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  min-width: 250px;
}

.input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #28a745;
  color: white;
}

.btn-primary:hover {
  background-color: #218838;
}

.btn-info {
  background-color: #20c997;
  color: white;
}

.btn-info:hover {
  background-color: #198754;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #a71d2a;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

.table th {
  background-color: #e9f7ef;
  color: #28a745;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.courses-section {
  margin-top: 2rem;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.relation-subsection {
  margin-top: 2rem;
}

.subtitle {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #067928;
}

.assignment-container {
  background-color: #fff;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
}

.current-assignment {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.no-assignment {
  color: #666;
  font-style: italic;
  margin-bottom: 1rem;
}

.assignment-form {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
</style>