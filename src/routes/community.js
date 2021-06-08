/**
 * Modulo que muestra los eventos creados y una vista previa
 * @module routes/community
 * @author Cristóbal Cortés Páez
*/

/** 
 * Constante que requiere el modulo de Express
 * @const express
 * @requires express
 */
const express = require('express');

/** 
 * Constante que requiere las funciones para saber si un usuario esta autenticado o no
 * @const isLoggedIn
 * @requires auth
 */
const { isLoggedIn } = require('../lib/auth');

/** 
 * Constante que requiere la conexion con la base de datos
 * @const pool
 * @requires database
 */
const pool = require('../database');

/**
 * Constante que obtiene la funcion Router de Express
 * @const router
 */
const router = express.Router();

/**
 * Peticion GET que redirecciona al panel de administrador con todos los eventos 
 */
router.get('/admin/all', isLoggedIn, async (req, res) => {
    const data = await pool.query('SELECT * FROM eventos');
    res.render('admin/all', {data});
})

/**
 * Peticion GET que redirecciona a la vista detallada de un evento desde el panel de administrador
 */
router.get('/admin/view-event/:id', async (req, res) => {
    const {id} = req.params;
    const data = await pool.query('SELECT * FROM eventos WHERE id = ?', [id]);
    res.render('admin/view', {data: data[0]});
})


module.exports = router;