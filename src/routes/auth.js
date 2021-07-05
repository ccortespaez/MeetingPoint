const express = require('express');
const router = express.Router();
const { authenticate } = require('passport');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const { body, validationResult } = require('express-validator');
const Swal = require('sweetalert2');

router.get('/login', (req, res) => {
    res.render('auth/login');
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local.login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
    
});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('login');
})

router.get('/register', (req, res) => {
    res.render('auth/register');
})

router.post('/register', passport.authenticate('local.register', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
}));



module.exports = router;