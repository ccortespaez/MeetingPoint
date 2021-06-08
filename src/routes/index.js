/**
 * Modulo que contiene las redirecciones y creacion de eventos desde la vistas principales del sistema
 * @module routes/index
 * @author Cristóbal Cortés Páez
*/

/** 
 * Constante que requiere la conexion con la base de datos
 * @const pool
 * @requires database
 */
const pool = require("../database");


/** 
 * Constante que requiere el modulo de Express
 * @const express
 * @requires express
 */
const express = require("express");

/**
 * Constante que obtiene la funcion Router de Express
 * @const router
 */
const router = express.Router();

/** 
 * Constante que requiere las funciones para saber si un usuario esta autenticado o no
 * @const isLoggedIn
 * @requires auth
 */
const { isLoggedIn } = require("../lib/auth");

/**
 * Peticion GET que redireccion a la vista principal del sitio y envia los datos de los eventos almacenados en la base de datos
 */
router.get("/", async (req, res) => {
  const data = await pool.query("SELECT * FROM eventos");
  res.render("index", { data });
});

/**
 * Peticion GET que redirecciona a la vista de mas detalles de un evento seleccionado
 */
router.get("/view-event/:id", async (req, res) => {
  const { id } = req.params;
  const data = await pool.query("SELECT * FROM eventos WHERE id = ?", [id]);
  res.render("event", { data: data[0] });
});

/**
 * Peticion GET que redirecciona a la vista de todos los eventos publicados
 */
router.get("/events", async (req, res) => {
  const data = await pool.query("SELECT * FROM eventos");
  res.render("events", { data });
});

/**
 * Peticion GET que redirecciona al formulario para crear eventos con rol de Organizador solo si esta con sesion activa
 */
router.get("/my-event", isLoggedIn, async (req, res) => {
  const user = await pool.query("SELECT * FROM usuarios WHERE id = ?", [
    req.user.id,
  ]);
  if (req.user.rol_id == 1 || req.user.rol_id == 2) {
    res.render("myevent");
  } else if (req.user.rol_id == 3) {
    res.render("index");
  }
});

/**
 * Peticion POST que añade el evento creado por el usuario Organizador a la base de datos
 */
router.post("/my-event/add-data", isLoggedIn, async (req, res) => {
  const {
    title,
    description,
    image,
    phone,
    animator,
    artist,
    datestart,
    datefinish,
    hour,
    location,
    type,
    age,
    streaming,
    producer,
    capacity,
  } = req.body;
  const newData = {
    title,
    description,
    image,
    phone,
    animator,
    artist,
    datestart,
    datefinish,
    hour,
    location,
    type,
    age,
    streaming,
    producer,
    capacity,
    usuarios_id: req.user.id,
  };
  await pool.query("INSERT INTO eventos SET ?", [newData]);
  req.flash("success", "New data added");
  res.redirect("/events");
});

/**
 * Peticion GET que redirecciona a la vista de nosotros con más informacion del sitio
 */
router.get("/about", async (req, res) => {
  res.render("about");
});

/**
 * Peticion POST que añade a un usuario a un evento como participante
 */
router.post("/view-event/:id/add-user", isLoggedIn, async (req, res) => {
  const { usuarios_id, eventos_id } = req.body;
  parseInt(usuarios_id);
  parseInt(eventos_id);
  const newSuscriber = {
    usuarios_id: usuarios_id,
    eventos_id: eventos_id,
  };
  await pool.query("INSERT INTO participante SET ? ", [newSuscriber]);
  req.flash("success", "New data added");
  res.render("index");
});

module.exports = router;
