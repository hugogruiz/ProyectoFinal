<template>
  <div class="container">
    <header class="header">
      <h1 class="title">Estudiantes</h1>
    </header>

    <div class="content">
      <!-- Formulario para registrar estudiante -->
      <section class="form-section">
        <h2 class="section-title">Registro de Estudiante</h2>
        <form @submit.prevent="agregarAlumno" class="form">
          <div class="form-group">
            <input 
              v-model="nuevoAlumno.nombre" 
              placeholder="Nombre" 
              required 
              class="input" 
            />
          </div>
          <div class="form-group">
            <input 
              v-model="nuevoAlumno.matricula" 
              placeholder="Matrícula" 
              required 
              class="input" 
            />
          </div>
          <div class="form-group">
            <input 
              v-model="nuevoAlumno.semestre" 
              placeholder="Semestre" 
              required 
              class="input" 
            />
          </div>
          <button type="submit" class="btn btn-primary">Registrar</button>
        </form>
      </section>

      <!-- Tabla de estudiantes -->
      <section class="table-section">
        <h2 class="section-title">Lista de Estudiantes</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Matrícula</th>
              <th>Semestre</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alumno in alumnos" :key="alumno.matricula">
              <td>{{ alumno.nombre }}</td>
              <td>{{ alumno.matricula }}</td>
              <td>{{ alumno.semestre }}</td>
              <td class="actions">
                <button 
                  @click="getCursosDeAlumno(alumno.id)" 
                  class="btn btn-info"
                >
                  Acerca de
                </button>
                <button 
                  @click="eliminarAlumno(alumno.id)" 
                  class="btn btn-danger"
                >
                  Eliminar estudiante
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <!-- Cursos relacionados con un estudiante -->
    <section v-if="cursos.length" class="courses-section">
      <h2 class="section-title">Información del estudiante</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Curso</th>
            <th>Créditos</th>
            <th>Profesor</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="curso in cursos" :key="curso.id">
            <td>{{ curso.nombre }}</td>
            <td>{{ curso.creditos }}</td>
            <td>{{ curso.profesorNombre || 'Sin profesor' }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
import apiService from '@/services/apiService';

export default {
  data() {
    return {
      alumnos: [],
      cursos: [],
      nuevoAlumno: { nombre: '', matricula: '', semestre: '' },
    };
  },
  methods: {
    async cargarAlumnos() {
      try {
        const response = await apiService.getAllAlumnos();
        this.alumnos = response.data;
      } catch (error) {
        console.error('Error al cargar alumnos:', error);
      }
    },
    async agregarAlumno() {
      try {
        await apiService.addAlumno(this.nuevoAlumno);
        this.nuevoAlumno = { nombre: '', matricula: '', semestre: '' };
        this.cargarAlumnos();
      } catch (error) {
        console.error('Error al agregar alumno:', error);
      }
    },
    async eliminarAlumno(id) {
      try {
        await apiService.deleteAlumno(id);
        this.cargarAlumnos();
      } catch (error) {
        console.error('Error al eliminar alumno:', error);
      }
    },
    async getCursosDeAlumno(id) {
      try {
        const response = await apiService.getCursosDeAlumnoWithDetails(id);

        const cursosConProfesor = await Promise.all(
          response.data.map(async curso => {
            const profesorResponse = await apiService.getProfesoresDelCurso(curso.id);
            const profesorNombre = profesorResponse.data.length
              ? profesorResponse.data[0].nombre
              : 'Sin profesor';
            return {
              ...curso,
              profesorNombre,
            };
          })
        );

        this.cursos = cursosConProfesor;
      } catch (error) {
        console.error('Error al obtener los cursos del alumno:', error);
        this.cursos = [];
      }
    },
  },
  mounted() {
    this.cargarAlumnos();
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
  background-color: #28a745; /* Fondo verde */
}

.header {
  text-align: center;
  margin-bottom: 2rem;
  background-color: #28a745; /* Fondo verde */
  padding: 1rem 0; /* Añadir espacio al fondo */
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: white; /* Título en blanco */
}

.content {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.form-section {
  flex: 1; /* Se puede reducir a 1 para que ocupe menos espacio */
  min-width: 300px;
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-section {
  flex: 3; /* Aumenta este valor para que ocupe más espacio */
  min-width: 500px; /* Puedes ajustar este valor según lo que necesites */
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

.description {
  font-size: 1rem;
  color: #555;
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
  background-color: #f9f9f9; /* Para que el fondo sea diferente y resalte el borde */
  border-radius: 10px; /* Borde redondeado */
  overflow: hidden; /* Para asegurar que los bordes redondeados se mantengan correctamente */
}

.subtitle {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #067928;
}
</style>
