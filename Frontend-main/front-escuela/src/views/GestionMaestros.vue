<template>
    <div>
      <MaestrosTable @verRelaciones="cargarRelaciones" />
      <RelacionComponent v-if="mostrarRelaciones" :identificador="matriculaSeleccionada" entidad="Maestro" />
    </div>
  </template>
  
  <script>
  import MaestrosTable from '@/components/MaestrosTable.vue';
  import RelacionComponent from '@/components/RelacionComponent.vue';
  
  export default {
    components: { MaestrosTable, RelacionComponent },
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
  