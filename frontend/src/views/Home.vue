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

    <!-- Div con todos los elementos de la búsqueda -->
    <div style="background-color: #ffffff">
      <div text-align="center" style="margin-left: 50px; margin-right: 50px">
        <br />
        <H1>Buscar evento cultural</H1>
        <br />
        <!-- div para el radiobutton de provincia -->
        <div id="provincia" style="float:left; margin-right: 80px">
          <strong><div>PROVINCIA</div></strong>
          <v-radio-group v-model="evento.provincia">
            <v-radio v-for="provincia in provincias" :key="provincia" :label="`${provincia}`" :value="provincia"></v-radio>
          </v-radio-group>
        </div>

        <!-- div para el radiobutton de categoría -->
        <div id="categoria" style="float:left; margin-right: 80px">
          <strong><div>CATEGORÍA</div></strong>
          <v-radio-group v-model="evento.categoria">
            <v-radio v-for="categoria in categorias" :key="categoria" :label="`${categoria}`" :value="categoria"></v-radio>
          </v-radio-group>
        </div>

        <!-- div para el radiobutton de público -->

        <div id="publico" style="float:left; margin-right: 80px">
          <strong><div>PÚBLICO</div></strong>
          <v-radio-group v-model="evento.publico">
            <v-radio v-for="publico in publicos" :key="publico" :label="`${publico}`" :value="publico"></v-radio>
          </v-radio-group>
        </div>


        <div id="botonBuscarEventos" class="text-center" style="float:left">
          <v-btn rounded color="primary" v-on:click= "buscarEvento()"> Buscar Eventos </v-btn>
        </div>
      </div>
    </div>  


        <!-- Finaliza el div de los elementos de busqueda -->


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
const Swal = require('sweetalert2')
// @ is an alias to /src
import Vue from "vue";
import Vuetify from "vuetify/lib";
import swal from 'sweetalert2';
window.Swal = swal;
Vue.use(Vuetify);
export default {
  data: () => ({
    provincias: ["León", "Palencia", "Burgos", "Zamora", "Valladolid", "Soria","Salamanca", "Ávila", "Segovia"], 
    categorias: ["Cine", "Conciertos", "Conferencias y Cursos", "Espectáculos", "Exposiciones", "Libros y Lectura", "Otros"],   
    publicos: ["Adultos", "Público infantil", "Todos los públicos", "Otros colectivos destinados" ],
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
    }
  }),


  methods:{
        buscarEvento(){
          console.log(this.evento.provincia);
          console.log(this.evento.categoria);
          console.log(this.evento.publico);
          console.log(this.evento.fecha);
          
            if(this.evento.provincia == ''){
                //Mensaje de error
                Swal.fire({
                  title: '¡BÚSQUEDA INCOMPLETA!',
                  text: 'Debes introducir al menos la provincia del evento que quieres buscar',
                  icon: 'error',
                  confirmButtonText: 'Aceptar'
                })
            }else{
                //Guardamos en la variable global evento los valores que nos han introducido por pantalla
                this.$store.state.evento.provincia = this.evento.provincia;
                this.$store.state.evento.fecha = this.evento.fecha;
                this.$store.state.evento.categoria = this.evento.categoria;
                this.$store.state.evento.publico = this.evento.publico;
                //Redireccionamos a eventos, allí se hará la consulta
                this.$router.push('/eventos');
            }
        },
    }
};
</script>