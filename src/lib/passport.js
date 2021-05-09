const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { desearlizeUser } = require('passport');
const pool = require('../database');
const helpers = require('./helpers');

passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username])
    console.log(req.body);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('success', 'Welcome ' + user.username));
        } else {
            done(null, false, req.flash('message', 'Incorrect Password'));
        }
    } else {
        return done(null, false, req.flash('message', 'The username does not exits'));
    }
}));

passport.use('local.register', new LocalStrategy({

    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname } = req.body;
    //console.log(req.body, 'signup')
    const newUser ={
        username,
        password,
        fullname,
        rol: 'user'
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