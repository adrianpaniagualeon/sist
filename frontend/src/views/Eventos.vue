<template>
  <v-app>
    <div id="AppBar" position="relative">
      <v-spacer></v-spacer>
      <v-app-bar color="red" height="70px" dense dark>
        <div class="d-flex align-center">
          <v-toolbar-title justify-content:center>Recomendador de Eventos Culturales</v-toolbar-title>
        </div>

        <v-spacer></v-spacer>

        <v-btn href="https://github.com/adrianpaniagualeon/sist" target="_blank" text>
          <span class="mr-2">GITHUB</span>
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
      </v-app-bar>
    </div>

    <br>
    <div style="background-color: #ffffff">
      <div class="text-center" style="margin-left: 50px; margin-right: 50px">
        <br />
        <p text-align="center">Mostrando los eventos de <strong>{{this.$store.state.evento.provincia}}</strong></p>
      </div>
    </div>
    <div id="botonBuscarSitios" class="text-center" style="float:left">
      <v-btn rounded color="primary" v-on:click= "volverAlInicio()"> VOLVER A LA PÁGINA PRINCIPAL </v-btn>
    </div>
    <br>
    <div>
      <v-data-table :headers="headers" :items="eventos" :items-per-page="15" class="elevation-1"></v-data-table>
    </div>
   
    <br>
    <!-- Pie de pagina -->
    <div id="piePagina" >
      <v-footer dark padless >
      <v-card class="flex" flat tile>

        <v-card-text class="py-2 white--text text-center">
          {{ new Date().getFullYear() }} —
          <strong
            >Curso 23/24 Sistemas de Información de Gestión y Business inteligence<br />
          </strong>
        </v-card-text>
      </v-card>
    </v-footer>
    </div>
  </v-app>
</template>

<script>
// @ is an alias to /src
//const Swal = require('sweetalert2')
import Vue from "vue";
import Vuetify from "vuetify/lib";
import swal from 'sweetalert2';
window.Swal = swal;
const axios= require("axios");

Vue.use(Vuetify);
export default {
  data: () => ({
    headers: [
        {
          text: 'Nombre',
          align: 'start',
          sortable: false,
          value: 'nombre',
        },
        { text: 'Provincia',
          align: 'start',
          sortable: false,
          value: 'provincia'
        },
        { text: 'Categoria',
          align: 'start',
          sortable: false,
          value: 'categoria'
        },
        { text: 'Localidad',
          align: 'start',
          sortable: false,
          value: 'localidad'
        },
        { text: 'Fecha',
          align: 'start',
          sortable: false,
          value: 'fecha'
        },
        { text: 'Publcio',
          align: 'start',
          sortable: false,
          value: 'publico'
        },
        { text: 'URL',
          align: 'start',
          sortable: false,
          value: 'url'
        },

      ],
    provincias: ["León", "Palencia", "Burgos", "Zamora", "Valladolid", "Soria","Salamanca", "Ávila", "Segovia"], 
    categorias: ["Cine", "Conciertos", "Conferencias y Cursos", "Espectáculos", "Exposiciones", "Libros y Lectura", "Otros"],   
    publicos: ["Adutlos", "Infantil"],
    fechas: ["Hoy", "Mañana", "Este Mes", "Este año"],
    sheet: false,
    evento: {
      nombre: "",
      fecha: "",
      lugar: "",
      provincia: "",
      categoria: "",
      publico: "",
      url: "",
      imagen: ""
    },
    eventos: []
  }),
  mounted(){
    this.buscarEvento();
  },
  methods:{
        volverAlInicio(){
          this.$router.push("/");
        },

        buscarEvento(){
          axios.get('http://localhost:3000/eventosProvincia/',{
          params:{
            provincia: this.$store.state.evento.provincia,
            categoria: this.$store.state.evento.categoria,
            publico: this.$store.state.evento.publico
          }
        }).then(response => {
          console.log(response.data);
          var eventoUnico;
          for (var step = 0; step < response.data.length; step++) {
            eventoUnico = {
              nombre: response.data[step].titulo,
              provincia: response.data[step].provincia,
              localidad: response.data[step].localidad,
              fecha: response.data[step].fecha,
              publico: response.data[step].publico,
              url: response.data[step].url,
              imagen: response.data[step].imagen,
              categoria: response.data[step].categoria
            }
            this.eventos.push(eventoUnico); 
            console.log(eventoUnico);
        } 

        }).catch(error => {
          console.log(error);
        });
        },
        resetEvento(){
          this.evento.nombre = "";
          this.evento.fecha = "";
          this.evento.lugar = "";
          this.evento.provincia = "";
          this.evento.categoria = "";
          this.evento.publico = "";
          this.evento.url = "";
          this.evento.imagen = "";
        },
      }
};
</script>
