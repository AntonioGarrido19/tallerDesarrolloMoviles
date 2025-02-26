//SELECT DE LISTADO CON, "TODOS", "SEMANA", "MES" Y BOTON MOSTRAR LISTADO

class Usuario {
  constructor(usuario, password, pais) {
    this.usuario = usuario;
    this.password = password;
    this.pais = pais;
  }
}

class UsuarioConectado {
  constructor(usuario, password) {
    this.usuario = usuario;
    this.password = password;
  }
}

class Actividad {
  constructor(idActividad, idUsuario, tiempo, fecha) {
    this.idActividad = idActividad;
    this.idUsuario = idUsuario;
    this.tiempo = tiempo;
    this.fecha = fecha;
  }
}

const MENU = document.querySelector("#menu");
const ROUTER = document.querySelector("#ruteo");
const HOME = document.querySelector("#pantalla-home");
const LOGIN = document.querySelector("#pantalla-login");
const REGISTRARU = document.querySelector("#pantalla-registrarU");
const registrarS = document.querySelector("#pantalla-registrarS");
const listado = document.querySelector("#pantalla-listado");
const informe = document.querySelector("#pantalla-informe");
const mapa = document.querySelector("#pantalla-mapa");
const URLBASE = "https://movetrack.develotion.com/";

inicio();
function inicio() {
  ROUTER.addEventListener("ionRouteDidChange", navegar);
  document
    .querySelector("#btnRegistrarUsuario")
    .addEventListener("click", previaRegistrarUsuario);
  cargarPaisesSelect();

  document
    .querySelector("#btnLogin")
    .addEventListener("click", previaHacerLogin);

  HOME.style.display = "block";

  chequearSesion();
  usuariosPorPais();
}

document
  .querySelector("#btnMenuListado")
  .addEventListener("click", previaListado);

document
  .querySelector("#btnMenuInforme")
  .addEventListener("click", previaInforme);

document
  .querySelector("#btnMenuLogout")
  .addEventListener("click", cerrarSesion);

function cerrarMenu() {
  MENU.close();

  document
    .querySelector("#btnRegistrarActividad")
    .addEventListener("click", previaRegistraActividad);

  document
    .querySelector("#slcFiltrarListado")
    .addEventListener("ionChange", mostrarListado);

  document.querySelector("#btnMenuMapa").addEventListener("click", armarMapa);
}

//Variable global para almacenar lista de paises
let listaPaisesGlobal = [];

//CARGAR SELECT REGISTRO
function cargarPaisesSelect() {
  fetch(`${URLBASE}paises.php`)
    .then(function (response) {
      return response.json();
    })
    .then(function (informacion) {
      console.log(informacion);
      listaPaisesGlobal = informacion.paises;
      escribirPaisesSelect(informacion.paises);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function escribirPaisesSelect(listaPaises) {
  let miSelect = "";

  for (let miPais of listaPaises) {
    miSelect += `  <ion-select-option value=${miPais.id}>${miPais.name}</ion-select-option>`;
  }
  document.querySelector("#slcRegistrarUPais").innerHTML = miSelect;
}

//NAVEGACIÓN DEL MENÚ
function navegar(evt) {
  let destino = evt.detail.to;
  ocultarPantallas();
  if (destino == "/") HOME.style.display = "block";
  if (destino == "/home") HOME.style.display = "block";
  if (destino == "/login") LOGIN.style.display = "block";
  if (destino == "/registrarS") registrarS.style.display = "block";
  if (destino == "/registrarU") REGISTRARU.style.display = "block";
  if (destino == "/listado") listado.style.display = "block";
  if (destino == "/informe") informe.style.display = "block";
  if (destino == "/mapa") mapa.style.display = "block";
}

function ocultarPantallas() {
  HOME.style.display = "none";
  LOGIN.style.display = "none";
  REGISTRARU.style.display = "none";
  registrarS.style.display = "none";
  listado.style.display = "none";
  informe.style.display = "none";
  mapa.style.display = "none";
}

//PETICIÓN REGISTRO USUARIO
function previaRegistrarUsuario() {
  let usuario = document.querySelector("#txtRegistrarUUsuario").value;
  let password = document.querySelector("#txtRegistrarUPassword").value;
  let pais = document.querySelector("#slcRegistrarUPais").value;

  if (usuario != "" && password != "" && pais != "") {
    let nuevoUsuario = new Usuario(usuario, password, pais);
    hacerRegistroUsuario(nuevoUsuario);
  } else {
    mostrarMensaje(
      "ERROR",
      "Todos los campos deben ser completados",
      "No has podido registrarte.",
      2000
    );
  }
}

function hacerRegistroUsuario(nuevoUsuario) {
  fetch(`${URLBASE}usuarios.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevoUsuario),
  })
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (informacion) {
      if (informacion.codigo >= 200 && informacion.codigo <= 299) {
        console.log(informacion);

        mostrarMensaje(
          "SUCCESS",
          "Registro Exitoso",
          "Puedes usar la App",
          3000
        );
        ocultarPantallas();
        HOME.style.display = "block";
        let nuevoUsuarioConectado = new UsuarioConectado(
          nuevoUsuario.usuario,
          nuevoUsuario.password
        );
        hacerLogin(nuevoUsuarioConectado);
        // en su obligatorio van a guardar el usuario y el token en el localStorage
        //van mostrar el menú de usuario conectado
      } else {
        mostrarMensaje(
          "ERROR",
          "Error",
          "No fue posible hacer el registro",
          3000
        );
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

//LOGIN

function previaHacerLogin() {
  let usuario = document.querySelector("#txtLoginUsuario").value;
  let password = document.querySelector("#txtLoginPassword").value;

  if (usuario != "" && password != "") {
    let nuevoUsuarioConectado = new UsuarioConectado(usuario, password);
    hacerLogin(nuevoUsuarioConectado);
  } else {
    mostrarMensaje(
      "ERROR",
      "Todos los campos deben ser completados",
      "No has podido ingresar.",
      2000
    );
  }
}

function hacerLogin(nuevoUsuarioConectado) {
  fetch(`${URLBASE}login.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevoUsuarioConectado),
  })
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (informacion) {
      console.log(informacion);

      if (informacion.codigo >= 200 && informacion.codigo <= 299) {
        ocultarPantallas();
        HOME.style.display = "block";
        mostrarMensaje("SUCCESS", "Login Exitoso", "Puedes usar la App", 3000);
        localStorage.setItem("id", informacion.id);
        localStorage.setItem("apiKey", informacion.apiKey);
        chequearSesion();
      } else {
        mostrarMensaje("ERROR", "Error", "No fue posible ingresar", 3000);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

//FUNCIONES DEL MENU
function ocultarMenu() {
  document.querySelector("#btnMenuRegistrarU").style.display = "none";
  document.querySelector("#btnMenuLogin").style.display = "none";
  document.querySelector("#btnMenuRegistrarS").style.display = "none";
  document.querySelector("#btnMenuListado").style.display = "none";
  document.querySelector("#btnMenuInforme").style.display = "none";
  document.querySelector("#btnMenuMapa").style.display = "none";
  document.querySelector("#btnMenuLogout").style.display = "none";
}

function mostrarMenuLogin() {
  document.querySelector("#btnMenuLogin").style.display = "block";
  document.querySelector("#btnMenuRegistrarU").style.display = "block";
}

function mostrarMenuVIP() {
  document.querySelector("#btnMenuRegistrarS").style.display = "block";
  document.querySelector("#btnMenuListado").style.display = "block";
  document.querySelector("#btnMenuInforme").style.display = "block";
  document.querySelector("#btnMenuMapa").style.display = "block";
  document.querySelector("#btnMenuLogout").style.display = "block";
  cargarActividadesSelect();
}

function chequearSesion() {
  ocultarMenu();

  if (localStorage.getItem("id") == null) {
    mostrarMenuLogin();
  } else {
    mostrarMenuVIP();
  }
}

//MENSAJE DE EXITO O ERROR
function mostrarMensaje(tipo, titulo, texto, duracion) {
  const toast = document.createElement("ion-toast");
  toast.header = titulo;
  toast.message = texto;
  if (!duracion) {
    duracion = 2000;
  }
  toast.duration = duracion;
  if (tipo === "ERROR") {
    toast.color = "danger";
    toast.icon = "alert-circle-outline";
  } else if (tipo === "WARNING") {
    toast.color = "warning";
    toast.icon = "warning-outline";
  } else if (tipo === "SUCCESS") {
    toast.color = "success";
    toast.icon = "checkmark-circle-outline";
  }

  document.body.appendChild(toast);
  toast.present();
}

//LISTAR ACTIVIDADES
function previaListado() {
  const idUsuario = localStorage.getItem("id");

  fetch(`${URLBASE}registros.php?idUsuario=${idUsuario}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: localStorage.getItem("apiKey"),
      iduser: idUsuario,
    },
  })
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (informacion) {
      filtrarListadoPorFecha(informacion.registros);
      mostrarListado();
      console.log(informacion);
    })
    .catch(function (error) {
      console.log(error);
    });
}

//TRABAJAMOS CON FECHAS PARA PODER FILTRAR
function obtenerFechaHoy() {
  const hoy = new Date();

  const anio = hoy.getFullYear();
  const mes = ("0" + (hoy.getMonth() + 1)).slice(-2);
  const dia = ("0" + hoy.getDate()).slice(-2);

  let fecha = anio + "-" + mes + "-" + dia;
  return fecha;
}

//FUNCION PARA RESTAR DIAS A LAS FECHAS
function restarDias(fechaString, dias) {
  let fecha = new Date(fechaString);
  fecha.setDate(fecha.getDate() - dias);

  const anio = fecha.getFullYear();
  const mes = ("0" + (fecha.getMonth() + 1)).slice(-2);
  const dia = ("0" + fecha.getDate()).slice(-2);

  return `${anio}-${mes}-${dia}`;
}

//DEFINIMOS LAS FECHAS DESDE DONDE VAMOS A COMPRAR
let fechaHoy = obtenerFechaHoy();
let fechaSemanaAtras = restarDias(fechaHoy, 7);
let fechaMesAtras = restarDias(fechaHoy, 30);

//VARIABLES GLOBALES PARA PODER ACCEDER A LAS LISTAS FILTRADAS
let actividadesSemana = [];
let actividadesMes = [];
let actividadesTodas = [];

//AGREGAMOS LAS ACTIVIDADES QUE CORRESPONDEN A CADA LISTA, SIEMPRE VACIANDO ANTES LAS LISTAS GLOBALES
function filtrarListadoPorFecha(listaActividades) {
  actividadesSemana = [];
  actividadesMes = [];
  actividadesTodas = [];

  for (let act of listaActividades) {
    if (act.fecha >= fechaSemanaAtras) {
      actividadesSemana.push(act);
    }
    if (act.fecha >= fechaMesAtras) {
      actividadesMes.push(act);
    }
    actividadesTodas.push(act);
  }
}

//CHEQUEO SELECT A VER QUE DEVUELVO
function devolverListadoFiltrado() {
  let valorSlc = parseInt(document.querySelector("#slcFiltrarListado").value);
  if (valorSlc == 1) {
    return actividadesSemana;
  } else if (valorSlc == 2) {
    return actividadesMes;
  } else {
    return actividadesTodas;
  }
}

//COMPARO LAS ACTIVIDADES REGISSTRADAS CON LA LISTA DE ACTIVIDADES ORIGINAL PARA BUSCAR SU IMAGEN
function devolverImagen(id) {
  let urlBaseImagenes = "https://movetrack.develotion.com/imgs/";
  for (let unaActividad of actividadesGlobal) {
    if (unaActividad.id == id) {
      let imagenURL = `${urlBaseImagenes}${unaActividad.imagen}.png`;
      return imagenURL;
    }
  }
}

//MUESTRO DINAMICAMENTE EL LISTADO RECORRIENDO LA LISTA FILTRADA, EJECUTO LA FUNCION EN EL PEDIDO A LA API Y CON UN
//EVENTO ONCHANGE ASOCIADO AL SELECT DEL FILTRO
function mostrarListado() {
  let listaActividadesMostrar = devolverListadoFiltrado();

  let misEjercicios = "";
  for (let unEj of listaActividadesMostrar) {
    misEjercicios += `<ion-item>
<ion-label>
<h3>Id: ${unEj.id}</h2>
<h3>Actividad: ${unEj.idActividad}</h3>
<h3>Tiempo: ${unEj.tiempo}</h3>
<h3>Fecha: ${unEj.fecha}</h3>
 <img src="${devolverImagen(unEj.idActividad)}" alt="Imagen de ${unEj.nombre}">
</ion-label>
<ion-button onclick="eliminarRegistro(${unEj.id})"
>Eliminar</ion-button>
</ion-item>`;
  }

  document.querySelector("#cotenedor-listado").innerHTML = misEjercicios;
}

//ELIMINAR ACTIVIDADES
function eliminarRegistro(idRegistro) {
  fetch(`${URLBASE}/registros.php?idRegistro=${idRegistro}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      apikey: localStorage.getItem("apiKey"),
      iduser: localStorage.getItem("id"),
    },
    body: { idRegistro: idRegistro },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data && data.error) {
        throw data.error;
      } else {
        mostrarMensaje(
          "SUCCESS",
          "Registro Eliminado",
          "Has eliminado un registro.",
          2000
        );
        previaListado();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

//REGISTRAR ACTIVIDADES

function tomarBtnRegistroAct() {
  document
    .querySelector("#btnRegistrarActividad")
    .addEventListener("click", previaRegistraActividad);
}

let actividadesGlobal = [];

function cargarActividadesSelect() {
  fetch(`${URLBASE}actividades.php`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: localStorage.getItem("apiKey"), // recupero apiKey
      iduser: localStorage.getItem("id"), // recupero id
    },
  })
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (informacion) {
      escribirActividadesSelect(informacion.actividades);
      actividadesGlobal = informacion.actividades;
      console.log(informacion);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function escribirActividadesSelect(listaActividades) {
  let miSelect = "";

  for (let miActividad of listaActividades) {
    miSelect += `  <ion-select-option value=${miActividad.id}>${miActividad.nombre}</ion-select-option>`;
  }
  document.querySelector("#slcRegistrarEjercicio").innerHTML = miSelect;
}

//PETICIÓN REGISTRO ACTIVIDAD

document.addEventListener("DOMContentLoaded", (event) => {
  limitarFechaActual();
});
function limitarFechaActual() {
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = ("0" + (hoy.getMonth() + 1)).slice(-2);
  const dia = ("0" + hoy.getDate()).slice(-2);
  const horas = ("0" + hoy.getHours()).slice(-2);
  const minutos = ("0" + hoy.getMinutes()).slice(-2);
  const segundos = ("0" + hoy.getSeconds()).slice(-2);
  const fechaMaxima = `${año}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
  document.querySelector("#txtFecha").setAttribute("max", fechaMaxima);
}

function previaRegistraActividad() {
  let idActividad = document.querySelector("#slcRegistrarEjercicio").value;
  let idUsuario = localStorage.getItem("id");
  let tiempo = document.querySelector("#txtRegistrarEjercicioTiempo").value;
  let fecha = document.querySelector("#txtFecha").value;

  if (idActividad != "" && idUsuario != "" && tiempo != "" && fecha != "") {
    let nuevaActividad = new Actividad(idActividad, idUsuario, tiempo, fecha);
    hacerRegistroActividad(nuevaActividad);
  } else {
    mostrarMensaje(
      "ERROR",
      "Todos los campos deben ser completados",
      "No has podido ingresar tu actividad.",
      2000
    );
  }
}

function hacerRegistroActividad(nuevaActividad) {
  fetch(`${URLBASE}registros.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: localStorage.getItem("apiKey"), // recupero apiKey
      iduser: localStorage.getItem("id"), // recupero id
    },
    body: JSON.stringify(nuevaActividad),
  })
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (informacion) {
      if (informacion.codigo >= 200 && informacion.codigo <= 299) {
        console.log(informacion);

        mostrarMensaje(
          "SUCCESS",
          "Registro Exitoso",
          "Se relgistro una nueva actividad",
          3000
        );
      } else {
        mostrarMensaje(
          "ERROR",
          "Error",
          "No fue posible hacer el registro",
          3000
        );
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

//PREVIA INFORME
function previaInforme() {
  const idUsuario = localStorage.getItem("id");

  fetch(`${URLBASE}registros.php?idUsuario=${idUsuario}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: localStorage.getItem("apiKey"),
      iduser: idUsuario,
    },
  })
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (informacion) {
      mostrarInforme(informacion.registros);
      console.log(informacion);
    })
    .catch(function (error) {
      console.log(error);
    });
}

//MOSTRAR INFORME

//

function mostrarInforme(registros) {
  let tiempoTotal = 0;
  let tiempoDia = 0;

  const hoy = obtenerFechaHoy();
  console.log(hoy);

  for (let reg of registros) {
    const fechaActividad = reg.fecha;
    console.log(fechaActividad);

    if (hoy == fechaActividad) {
      tiempoDia += reg.tiempo;
    }
    tiempoTotal += reg.tiempo;
  }
  let mostrarTiempo = `

  <ion-item>  <h4>Tu tiempo total de actividades es:</h4>
  <p>${tiempoTotal} minutos</p>
</ion-item>

<ion-item>
    <h4>Tu tiempo total de actividades hoy es:</h4>
  <p>${tiempoDia} minutos</p>
</ion-item>
  `;
  document.querySelector("#cotenedor-informe").innerHTML = mostrarTiempo;
}

//MAPA

//GUARDO EN VARIABLE GLOBAL ARRAY PAISES

//HAGO PETICION DE USUARIOS POR PAIS
let listaPaisesCantidadUsuariosGlobal = [];

function usuariosPorPais() {
  fetch(`${URLBASE}usuariosPorPais.php`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: localStorage.getItem("apiKey"),
      iduser: localStorage.getItem("id"),
    },
  })
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (informacion) {
      listaPaisesCantidadUsuariosGlobal = informacion.paises;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function obtenerUsuariosPais(id) {
  for (let unPais of listaPaisesCantidadUsuariosGlobal) {
    if (unPais.id == id) {
      return unPais.cantidadDeUsuarios;
    }
  }
}

//LUEGO DEBO PONER LOS DATOS EN EL MAPA

let map;

if (map) {
  map.remove();
}

function armarMapa() {
  usuariosPorPais();
  map = L.map("map").setView([51.505, -0.09], 15);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 3,
    attribution: "OpenStreetMap",
  }).addTo(map);

  for (let unPais of listaPaisesGlobal) {
    let marker = L.marker([unPais.latitude, unPais.longitude]).addTo(map);
    info = `${unPais.name} Cantidad de usuarios: ${obtenerUsuariosPais(
      unPais.id
    )}`;

    marker.bindPopup(info).openPopup();
  }
}

//CERRAR SESION
function cerrarSesion() {
  localStorage.removeItem("id");
  localStorage.removeItem("apiKey");

  ocultarPantallas();
  ocultarMenu();
  mostrarMenuLogin();
  mostrarMensaje("SUCCESS", "Sesión Cerrada", "Has cerrado sesión.", 2000);
}
