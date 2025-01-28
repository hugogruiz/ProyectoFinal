<template>
  <div>
    <h2>Relaciones de {{ entidad }}</h2>
    <h3>Cursos</h3>
    <ul>
      <li v-for="curso in cursos" :key="curso.nombre">{{ curso.nombre }}</li>
    </ul>
    <h3>Estudiantes</h3>
    <ul>
      <li v-for="estudiante in estudiantes" :key="estudiante.matricula">{{ estudiante.nombre }}</li>
    </ul>
  </div>
</template>

<script>
import apiService from '@/services/apiService';

export default {
  props: ['identificador', 'entidad'],
  data() {
    return {
      cursos: [],
      estudiantes: [],
    };
  },
  methods: {
    async cargarRelaciones() {
      if (this.entidad === 'Maestro') {
        this.cursos = (await apiService.getCursosDeMaestro(this.identificador)).data;
      } else if (this.entidad === 'Curso') {
        this.estudiantes = (await apiService.getEstudiantesDeCurso(this.identificador)).data;
        this.cursos = (await apiService.getMaestrosDeCurso(this.identificador)).data;
      }
    },
  },
  mounted() {
    this.cargarRelaciones();
  },
};
</script>
