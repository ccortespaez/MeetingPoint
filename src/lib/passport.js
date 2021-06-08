/**
 * Modulo que registra a los usuarios en la base de datos y autentica a los usuarios en el sistema
 * @module passport
 * @author Cristóbal Cortés Páez
*/

/** 
 * Constante que requiere el modulo {@link node_modules/@types/passport/index}
 * @const passport
 * @requires passport 
 */
const passport = require('passport');

/** 
 * Constante que requiere el modulo {@link node_modules/@types/passport/index}
 * @const LocalStrategy 
 * @requires LocalStrategy
 */
const LocalStrategy = require('passport-local').Strategy;

/** 
 * Constante que requiere el modulo {@link node_modules/@types/passport/index} 
 * @const deserializeUser 
 * @requires passport
 */
const { deserializeUser } = require('passport');

/** 
 * Constante que requiere la conexion con la base de datos
 * @const pool
 * @requires database.js
 */
const pool = require('../database');

/** 
 * Constante que requiere el modulo creado para encriptar la contraseña
 * @const helpers contiene la logica de la encriptacion de la contraseña
 * @requires bcrypt
 */
const helpers = require('./helpers');

passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const rows = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email])
    console.log(req.body);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('success', 'Welcome ' + user.email));
            console.log('funciono');
        } else {
            done(null, false, req.flash('message', 'Incorrect Password'));
            console.log('no funciono');
        }
    } else {
        return done(null, false, req.flash('message', 'The username does not exits'));
        console.log('error');
    }
}));

passport.use('local.register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const { fullname, date } = req.body;
    //console.log(req.body, 'signup')
    const newUser = {
        email,
        password,
        fullname,
        date,
        rol_id: 3
    };
    newUser.password = await helpers.encryptPassword(password);

    const result = await pool.query('INSERT INTO usuarios SET ?', [newUser]);
    //console.log('result', result);
    newUser.id = result.insertId;
    return done(null, newUser);
}));


passport.serializeUser((user, done) => {
    done(null, user.id);
})
passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    done(null, rows[0])
})