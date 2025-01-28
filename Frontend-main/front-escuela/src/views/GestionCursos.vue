<template>
  <div>

    <!-- Tabla de cursos -->
    <CursosTable @verRelaciones="cargarRelaciones" />

    <!-- Asignación de relaciones -->
    <div v-if="mostrarRelaciones">
      <h3>Gestionar relaciones para el curso: {{ cursoSeleccionado.nombre }}</h3>

      <!-- Profesores asignados -->
      <h4>Profesores</h4>
      <ul>
        <li v-for="profesor in cursoSeleccionado.Profesores" :key="profesor.id">
          {{ profesor.nombre }}
        </li>
      </ul>
      <form @submit.prevent="asignarProfesor">
        <select v-model="profesorSeleccionado">
          <option v-for="profesor in profesores" :key="profesor.id" :value="profesor.id">
            {{ profesor.nombre }}
          </option>
        </select>
        <button type="submit">Asignar Profesor</button>
      </form>

      <!-- Alumnos inscritos -->
      <h4>Alumnos</h4>
      <ul>
        <li v-for="alumno in cursoSeleccionado.Alumnos" :key="alumno.id">
          {{ alumno.nombre }}
        </li>
      </ul>
      <form @submit.prevent="inscribirAlumno">
        <select v-model="alumnoSeleccionado">
          <option v-for="alumno in alumnos" :key="alumno.id" :value="alumno.id">
            {{ alumno.nombre }}
          </option>
        </select>
        <button type="submit">Inscribir Alumno</button>
      </form>
    </div>
  </div>
</template>

<script>
import CursosTable from '@/components/CursosTable.vue';
import apiService from '@/services/apiService';

export default {
  components: { CursosTable },
  data() {
    return {
      mostrarRelaciones: false,
      cursoSeleccionado: null,
      profesores: [],
      alumnos: [],
      profesorSeleccionado: null,
      alumnoSeleccionado: null,
    };
  },
  methods: {
    async cargarRelaciones(clave) {
      try {
        // Obtener el curso seleccionado con sus relaciones
        const response = await apiService.getCursoById(clave);
        this.cursoSeleccionado = response.data;
        this.mostrarRelaciones = true;

        // Cargar lista de profesores y alumnos para asignación
        const [profesoresResponse, alumnosResponse] = await Promise.all([
          apiService.getAllProfesores(),
          apiService.getAllAlumnos(),
        ]);
        this.profesores = profesoresResponse.data;
        this.alumnos = alumnosResponse.data;
      } catch (error) {
        console.error('Error al cargar las relaciones:', error);
      }
    },
    async asignarProfesor() {
      try {
        await apiService.asignarProfesorACurso({
          profesorId: this.profesorSeleccionado,
          cursoId: this.cursoSeleccionado.id,
        });
        this.cargarRelaciones(this.cursoSeleccionado.id);
      } catch (error) {
        console.error('Error al asignar profesor:', error);
      }
    },
    async inscribirAlumno() {
      try {
        await apiService.inscribirAlumnoACurso({
          alumnoId: this.alumnoSeleccionado,
          cursoId: this.cursoSeleccionado.id,
        });
        this.cargarRelaciones(this.cursoSeleccionado.id);
      } catch (error) {
        console.error('Error al inscribir alumno:', error);
      }
    },
  },
};
</script>
