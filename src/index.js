/**
 * Este archivo es el principal del sistema, contiene la creacion del servidor de Express, configuracion de middlewares, rutas, variables globales y configuraciones de puerto y motor de plantillas
 * @module index
 * @author Cristóbal Cortés Páez
 */

/** 
 * Constante que requiere el modulo de Express
 * @const express
 * @requires express
 */
const express = require('express');

/**
 * Constate que requiere el modulo morgan
 * @const morgan
 * @requires morgan
 */
const morgan = require('morgan');

/**
 * Constante que crea la aplicacion de express
 * @const app
 */
const app = express();

/**
 * Constante que requiere el modulo path
 * @const path
 * @requires path
 */
const path = require('path');

/**
 * Constante que requiere el modulo de handlebars
 * @const exhbs
 * @requires express-handlebars
 */
const exhbs = require('express-handlebars');

/**
 * Constante que requiere las credenciales de la base de datos
 * @const database
 * @requires keys
 */
const { database } = require('./keys');

/**
 * Constante que requiere el module express-session
 * @const session
 * @requires express-session
 */
const session = require('express-session');

/**
 * Constante que quiere el modulo de express-mysql-session para almacenar la session del usuario
 * @const mySQLStore 
 * @requires express-mysql-session
 */
const mySQLStore = require('express-mysql-session');

/**
 * Constante que requiere el modulo passport
 * @const passport
 * @requires passport
 */
const passport = require('passport');

/**
 * Constante que requiere connect-flash para mostrar mensajes de informacion
 * @const flash
 * @requires flash
 */
const flash = require('connect-flash');

/**
 * Se requiere el modulo passport creado en la carpeta de librerias
 * @requires /lib/passport
 */
require('./lib/passport');

/**
 * Configuracion del puerto a utilizar
 */
app.set('port', process.env.PORT || 3000);

/**
 * Configuracion de donde se encuentra el directorio con las vistas
 */
app.set('views', path.join(__dirname, 'views'));

/**
 * Configuracion de handlebars
 */
app.engine('.hbs', exhbs({
    defaultLayouts: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));

/**
 * Configuracion del motor de plantillas a utilizar
 */
app.set('view engine', '.hbs');

/**
 * Middleware que configura la sesion del usuario
 */
app.use(session({
    secret: 'secretKey',
    resave: 'false',
    saveUninitialized: true,
    store: new mySQLStore(database)
}));

/**
 * Middleware que configura morgan para desarrollo
 */
app.use(morgan('dev'));

/**
 * Middleware que configura el parseo de las peticiones HTTP
 */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/**
 * Middleware que configura la direccion de la carpeta de archivos estaticos
 */
app.use(express.static(path.join(__dirname, "public")));

/**
 * Middleware que configura la inicializacion de passport
 */
app.use(passport.initialize());

/**
 * Middleware que configura las sesiones de passport
 */
app.use(passport.session());

/**
 * Middleware que configura flash
 */
app.use(flash());

/**
 * Variables globales que envian mensajes con el modulo de flash
 */
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

/**
 * Configuracion de las rutas 
 */
app.use(require('./routes'));
app.use(require('./routes/auth'));
app.use(require('./routes/data'));
app.use(require('./routes/community'));


/**
 * Creacion del servidor 
 */
app.listen(app.get('port'), () => {
    console.log('SERVER ONLINE')
})