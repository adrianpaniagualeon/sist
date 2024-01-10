import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Eventos from '../views/Eventos.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/Home',
    name: 'Home',
    component: Home
  },
  {
    path: '/eventos',
    name: 'eventos',
    component: Eventos
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },

]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Recomendador de Eventos Culturales ';
  next();
});

export default router
