/**
 * Modulo que redirecciona a las vista de inicio de sesion y registro, ademas de valida si el usuario se registro o autentico correctamente.
 * @module routes/auth
 * @author Cristóbal Cortés Páez
*/

/** 
 * Constante que requiere el modulo de Express
 * @const express
 * @requires express
 */
const express = require('express');

/** 
 * Constante que obtiene la funcion Router de express
 * @const router
 * @requires express.Router() 
 */
const router = express.Router();

/** 
 * Constante que requiere el modulo passport con la funcion authenticate
 * @const authenticate
 * @requires passport.authenticate 
 */
const { authenticate } = require('passport');

/** 
 * Constante que requiere el modulo passport
 * @const passport
 * @requires authenticate
 */
const passport = require('passport');


/**
 * Peticion GET redirecciona a la vista de inicio de sesion
 */
router.get('/login', (req, res) => {
    res.render('auth/login');
})

/**
 * Peticion POST, dependiendo si el usuario ingreso bien sus datos, si esta autenticado lo envia a la vista de inicio, sino redirecciona a la vista de inicio de sesion
 */
router.post('/login', (req, res, next) => {
    passport.authenticate('local.login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

/**
 * Peticion GET que redirecciona a la vista de login y cierra sesion en su cuenta.
 */
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('login');
})

/**
 * Peticion GET que redirecciona a la vista de registro de usuario
 */
router.get('/register', (req, res) => {
    res.render('auth/register');
})

/**
 * Peticion POST que crea al usuario
 */
router.post('/register', passport.authenticate('local.register', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
}));



module.exports = router;