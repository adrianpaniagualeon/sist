const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const axios = require('axios');
const port = 3000;
const ruta = "http://localhost:3000"
var cors = require("cors");
const neo4j = require("neo4j-driver");
const driver = neo4j.driver( "neo4j://localhost:7687", neo4j.auth.basic("neo4j", "eventos2023"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/eventosProvincia/", function(req, res) {
  var provincia = req.query.provincia;
  var categoria = req.query.categoria;
  var publico = req.query.publico;

  nomProv=provincia;
  nomCat=categoria;
  nomPub=publico;

  console.log(provincia);
  console.log("["+categoria+"]");
  console.log(publico);
  
  if(provincia =! "" && categoria == "" && publico == ""){
    console.log("entra en provincia")
    var query = `
    MATCH (evento:Evento)-[:OCURRE_EN]->(lugar:Lugar)-[:PERTENECE_A]->(provincia:Provincia {nombre: $provincia})
    RETURN evento.titulo AS titulo, evento.fecha AS fecha, evento.publico AS publico, evento.link AS url, lugar.nombre AS nombreLugar, lugar.calle AS calle, lugar.localidad AS localidad, lugar.provincia AS provincia, evento.tematica AS categoria
  `;
  }else if(provincia =! "" && categoria != "" && publico == ""){
    console.log("entra en provincia y categoria")
    var query = `
    MATCH (evento:Evento)-[:OCURRE_EN]->(lugar:Lugar)-[:PERTENECE_A]->(provincia:Provincia {nombre: $provincia}), (evento)-[:PERTENECE_A_CATEGORIA]->(categoria:Categoria {nombre: $categoria})
    RETURN evento.titulo AS titulo, evento.fecha AS fecha, evento.publico AS publico, evento.link AS url, lugar.nombre AS nombreLugar, lugar.calle AS calle, lugar.localidad AS localidad, lugar.provincia AS provincia, evento.tematica AS categoria
  `;


  }else if(provincia =! "" && categoria == "" && publico != ""){
    console.log("entra en provincia y publico")
    provincia = nomProv;
    console.log(provincia);
    console.log(publico);
    var query = `
    MATCH (evento:Evento)-[:OCURRE_EN]->(lugar:Lugar)-[:PERTENECE_A]->(provincia:Provincia {nombre: $provincia})
    WHERE evento.publico = $publico
    RETURN evento.titulo AS titulo, evento.fecha AS fecha, evento.publico AS publico, evento.link AS url, lugar.nombre AS nombreLugar, lugar.calle AS calle, lugar.localidad AS localidad, lugar.provincia AS provincia, evento.tematica AS categoria;
    
  `;
  }else if(provincia =! "" && categoria != "" && publico != ""){
    console.log("entra en provincia, categoria y publico")
    var query = `
    MATCH (evento:Evento)-[:OCURRE_EN]->(lugar:Lugar)-[:PERTENECE_A]->(provincia:Provincia {nombre: $provincia})
    WHERE evento.publico = $publico
    MATCH (evento)-[:PERTENECE_A_CATEGORIA]->(categoria:Categoria {nombre: $categoria})
    RETURN evento.titulo AS titulo, evento.fecha AS fecha, evento.publico AS publico, evento.link AS url, lugar.nombre AS nombreLugar, lugar.calle AS calle, lugar.localidad AS localidad, lugar.provincia AS provincia, evento.tematica AS categoria;
    
  `;
  }else{
    console.log("entra en else")
    var query = `
    MATCH (evento:Evento)-[:OCURRE_EN]->(lugar:Lugar)
    RETURN evento.titulo AS titulo, evento.fecha AS fecha, evento.publico AS publico, evento.link AS url, lugar.nombre AS nombreLugar, lugar.calle AS calle, lugar.localidad AS localidad, lugar.provincia AS provincia, evento.tematica AS categoria
  `;
  }

  provincia = nomProv;
  categoria = nomCat;
  publico = nomPub;

  const consultaFiltro = driver.session();
  const lista = [];
  const parametros = { provincia: provincia, categoria: categoria, publico: publico };

  consultaFiltro.run(query,parametros).subscribe({
    onNext: function(result) {
      lista.push({
        titulo: result.get('titulo'),
        fecha: result.get('fecha'),
        provincia: result.get('provincia'),
        localidad: result.get('localidad'),
        calle: result.get('calle'),
        categoria: result.get('categoria'),
        publico: result.get('publico'),
        url: result.get('url')        
      });
    },
    onCompleted: function() {
      res.send(lista);
      consultaFiltro.close();
    },
    onError: function(error) {
      console.log(error);
      res.status(500).send("Error interno del servidor");
    }
  });
});



app.get("/eventosLocalidad/:localidad", function(req, res) {
  var localidad = req.params.localidad;
  
  var query = `
    MATCH (evento:Evento)-[:OCURRE_EN]->(lugar:Lugar {nombre: $localidad})
    RETURN evento.titulo AS titulo, evento.fecha AS fecha, lugar.nombre AS nombreLugar
  `;
  
  const consultaFiltro = driver.session();
  const lista = [];

  consultaFiltro.run(query, { localidad: localidad }).subscribe({
    onNext: function(result) {
      lista.push({
        titulo: result.get('titulo'),
        fecha: result.get('fecha'),
        nombreLugar: result.get('nombreLugar'),
      });
    },
    onCompleted: function() {
      res.send(lista);
      consultaFiltro.close();
    },
    onError: function(error) {
      console.log(error);
      res.status(500).send("Error interno del servidor");
    }
  });
});


app.get("/eventosFecha/:fecha", function(req, res) {
  var fecha = req.params.fecha;
  fecha = fecha.substring(0,2) + "/" + fecha.substring(2,4) + "/" + fecha.substring(4,8); 

  var query = `
    MATCH (evento:Evento {fecha: $fecha})
    RETURN evento.titulo AS titulo, evento.fecha AS fecha
  `;
  
  const consultaFiltro = driver.session();
  const lista = [];

  consultaFiltro.run(query, { fecha: fecha }).subscribe({
    onNext: function(result) {
      lista.push({
        titulo: result.get('titulo'),
        fecha: result.get('fecha'),
      });
    },
    onCompleted: function() {
      res.send(lista);
      consultaFiltro.close();
    },
    onError: function(error) {
      console.log(error);
      res.status(500).send("Error interno del servidor");
    }
  });
});



app.get("/eventosCategoria/:categoria", function(req, res) {
  var categoria = req.params.categoria;
  
  var query = `
    MATCH (evento:Evento)-[:PERTENECE_A_CATEGORIA]->(categoria:Categoria {nombre: $categoria})
    RETURN evento.titulo AS titulo, evento.fecha AS fecha, categoria.nombre AS nombreCategoria
  `;
  
  const consultaFiltro = driver.session();
  const lista = [];

  consultaFiltro.run(query, { categoria: categoria }).subscribe({
    onNext: function(result) {
      lista.push({
        titulo: result.get('titulo'),
        fecha: result.get('fecha'),
        nombreCategoria: result.get('nombreCategoria'),
      });
    },
    onCompleted: function() {
      res.send(lista);
      consultaFiltro.close();
    },
    onError: function(error) {
      console.log(error);
      res.status(500).send("Error interno del servidor");
    }
  });
}
);

app.get("/eventosInfantiles/", function(req, res) {
  var query = `
  MATCH (evento:Evento)
  WHERE evento.publico IN ['Todos los públicos', 'Público infantil']
  RETURN evento.titulo AS titulo, evento.fecha AS fecha
  `;
  
  const consultaFiltro = driver.session();
  const lista = [];

  consultaFiltro.run(query).subscribe({
    onNext: function(result) {
      lista.push({
        titulo: result.get('titulo'),
        fecha: result.get('fecha'),
      });
    },
    onCompleted: function() {
      res.send(lista);
      consultaFiltro.close();
    },
    onError: function(error) {
      console.log(error);
      res.status(500).send("Error interno del servidor");
    }
  });
});

app.get("/eventosAdultos/", function(req, res) {
  var query = `
  MATCH (evento:Evento)
  WHERE evento.publico IN ['Adultos']
  RETURN evento.titulo AS titulo, evento.fecha AS fecha
  `;
  
  const consultaFiltro = driver.session();
  const lista = [];

  consultaFiltro.run(query).subscribe({
    onNext: function(result) {
      lista.push({
        titulo: result.get('titulo'),
        fecha: result.get('fecha'),
      });
    },
    onCompleted: function() {
      res.send(lista);
      consultaFiltro.close();
    },
    onError: function(error) {
      console.log(error);
      res.status(500).send("Error interno del servidor");
    }
  });
});




app.listen(port, function() {
  console.log("App funcionando");
});
