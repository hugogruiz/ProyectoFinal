<template>
    <div>
      <AlumnosTable @verRelaciones="cargarRelaciones" />
      <RelacionComponent v-if="mostrarRelaciones" :matricula="matriculaSeleccionada" entidad="Alumno" />
    </div>
  </template>
  
  <script>
  import AlumnosTable from '@/components/AlumnosTable.vue';
  import RelacionComponent from '@/components/RelacionComponent.vue';
  
  export default {
    components: { AlumnosTable, RelacionComponent },
    data() {
      return {
        mostrarRelaciones: false,
        matriculaSeleccionada: '',
      };
    },
    methods: {
      cargarRelaciones(matricula) {
        this.mostrarRelaciones = true;
        this.matriculaSeleccionada = matricula;
      },
    },
  };
  </script>
  