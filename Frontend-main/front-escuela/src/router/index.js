import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomePage.vue';
import GestionAlumnos from '@/views/GestionAlumnos.vue';
import GestionCursos from '../views/GestionCursos.vue';
import GestionMaestros from '../views/GestionMaestros.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/alumnos',
    name: 'GestionAlumnos',
    component: GestionAlumnos,
  },
  {
    path: '/cursos',
    name: 'GestionCursos',
    component: GestionCursos,
  },
  {
    path: '/maestros',
    name: 'GestionMaestros',
    component: GestionMaestros,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
