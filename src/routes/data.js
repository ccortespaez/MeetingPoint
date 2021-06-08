/**
 * Modulo que contiene el CRUD (Create, Read, Update, Delete)
 * @module routes/data
 * @author Cristóbal Cortés Páez
*/


/** 
 * Constante que requiere el modulo de Express
 * @const express
 * @requires express
 */
const express = require('express');

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
const {isLoggedIn} = require('../lib/auth');

/** 
 * Constante que requiere la conexion con la base de datos
 * @const pool
 * @requires database
 */
const pool = require('../database');


/**
 * Peticion GET que si el usuario esta con una sesion activa y tiene el rol de administrador puede entrar al panel de administrador
 */
router.get('/admin', isLoggedIn, async(req, res) => {
    const user = await pool.query('SELECT * FROM usuarios WHERE id = ?', [req.user.id]);
    const data = await pool.query('SELECT * FROM eventos', [req.user.id]);
    if(req.user.rol_id == 1){
        res.render("admin/admin", {
            name: req.user.fullname , user, data
        });
    }else if(req.user.rol_id == 2 || req.user.rol_id == 3){
        res.status(404).send("Acceso denegado");
    } 
    
});

/**
 * Peticion GET que si el usuario esta con una sesion activa y tiene el rol de administrador puede crear un nuevo evento desde el panel de administrador
 */
router.get('/admin/add', isLoggedIn, async(req, res) => {
    if(req.user.rol_id == 1){
        res.render("admin/add", {
            user: req.user.fullname
        });
    }else if(req.user.rol_id == 2 || req.user.rol_id == 3){
        res.status(404).send("Acceso denegado");
    } 
});

/**
 * Peticion POST que si el usuario esta con una sesion activa puede crear un nuevo evento
 */
router.post('/admin/add-data', isLoggedIn, async(req, res) => {
   const { title, description, image, phone, animator, artist, datestart, datefinish, hour, location, type, age, streaming, producer, capacity } = req.body;
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
       usuarios_id: req.user.id
   }
   await pool.query('INSERT INTO eventos SET ?', [newData]);
   req.flash('success', 'New data added');
   res.redirect('/admin');
});  

/**
 * Peticion GET que elimina un evento dependiendo de su ID
 */
router.get('/admin/data-delete/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM eventos WHERE id = ?', [id]);
    req.flash('success', 'Data delete');
    res.redirect('/admin');
});

/**
 * Peticion GET que redirecciona a la vista para modifcar los datos de un evento
 */
router.get('/admin/data-edit/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const data = await pool.query('SELECT * FROM eventos WHERE id = ?', [id]);
    res.render('admin/edit', {data: data[0]});
});

/**
 * Peticion POST que edita los datos de un evento
 */
router.post('/admin/data-edit/:id', async (req, res) => {
    const {id} = req.params;
    const { title, description, image, phone, animator, artist, datestart, datefinish, hour, location, type, age, streaming, producer, capacity } = req.body;
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
       capacity
    };
    await pool.query('UPDATE eventos SET ? WHERE id = ?', [newData, id]);
    req.flash('success', 'Data updated');
    res.redirect('/admin');
});

module.exports = router;