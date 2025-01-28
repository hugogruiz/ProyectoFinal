<template>
  <div class="container">
    <header class="header">
      <h1 class="title">Profesores</h1>
    </header>

    <div class="content">
      <!-- Formulario para agregar maestro -->
      <section class="form-section">
        <h2 class="section-title">Registro de Profesor</h2>
        <form @submit.prevent="agregarMaestro" class="form">
          <div class="form-group">
            <input 
              v-model="nuevoMaestro.nombre" 
              placeholder="Nombre del maestro" 
              required 
              class="input"
            />
          </div>
          <div class="form-group">
            <input 
              v-model="nuevoMaestro.matricula" 
              placeholder="Matrícula del maestro" 
              required 
              class="input"
            />
          </div>
          <button type="submit" class="btn btn-primary">Registrar</button>
        </form>
      </section>

      <!-- Tabla de maestros -->
      <section class="table-section">
        <h2 class="section-title">Lista de Profesores</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Matrícula</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="maestro in maestros" :key="maestro.matricula">
              <td>{{ maestro.nombre }}</td>
              <td>{{ maestro.matricula }}</td>
              <td class="actions">
                <button @click="verRelaciones(maestro)" class="btn btn-info">
                  Acerca de
                </button>
                <button @click="eliminarMaestro(maestro.id)" class="btn btn-danger">
                  Eliminar profesor
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <!-- Relaciones del maestro -->
    <section v-if="maestroSeleccionado" class="courses-section">
      <h2 class="section-title">Información del profesor</h2>

      <!-- Cursos asignados -->
      <div class="relation-subsection">
        <h3 class="subtitle">Cursos Asignados</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Nombre del Curso</th>
              <th>Créditos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="curso in cursos" :key="curso.id">
              <td>{{ curso.nombre }}</td>
              <td>{{ curso.creditos }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Estudiantes -->
      <div class="relation-subsection">
        <h3 class="subtitle">Estudiantes</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Matrícula</th>
              <th>Curso</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alumno in alumnos" :key="alumno.id">
              <td>{{ alumno.nombre }}</td>
              <td>{{ alumno.matricula }}</td>
              <td>{{ alumno.curso }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script>
import apiService from "@/services/apiService";

export default {
  data() {
    return {
      maestros: [],
      nuevoMaestro: { nombre: "", matricula: "" },
      maestroSeleccionado: null,
      alumnos: [],
      cursos: [],
    };
  },
  methods: {
    async cargarMaestros() {
      try {
        const response = await apiService.getAllMaestros();
        this.maestros = response.data;
      } catch (error) {
        console.error("Error al cargar maestros:", error);
      }
    },
    async agregarMaestro() {
      try {
        await apiService.addMaestro(this.nuevoMaestro);
        this.nuevoMaestro = { nombre: "", matricula: "" };
        this.cargarMaestros();
      } catch (error) {
        console.error("Error al agregar maestro:", error);
      }
    },
    async eliminarMaestro(id) {
      try {
        await apiService.deleteMaestro(id);
        this.cargarMaestros();
      } catch (error) {
        console.error("Error al eliminar maestro:", error);
      }
    },
    async verRelaciones(maestro) {
      try {
        this.maestroSeleccionado = maestro;

        // Obtener estudiantes del profesor
        const estudiantesResponse = await apiService.getEstudiantesDeProfesor(maestro.id);
        this.alumnos = estudiantesResponse.data;

        // Obtener cursos del profesor
        const cursosResponse = await apiService.getCursosDeMaestro(maestro.id);
        this.cursos = cursosResponse.data;
      } catch (error) {
        console.error("Error al cargar relaciones del maestro:", error);
      }
    },
  },
  mounted() {
    this.cargarMaestros();
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
</style>