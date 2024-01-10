import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    evento: {
      nombre: '',
      fecha: '',
      categoria: '',
      provincia: '',
      localidad: '',
      calle: '',
      publico: ''
    },
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
