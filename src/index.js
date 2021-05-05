const express = require('express');
const morgan = require('morgan');
const app = express();
const path = require('path');
const exhbs = require('express-handlebars');
const { database } = require('./keys');
const session = require('express-session');
const mySQLStore = require('express-mysql-session'); 
const passport = require('passport');
const flash = require('connect-flash');

require('./lib/passport');

//settings
app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exhbs({
    defaultLayouts: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');


//middlewares
app.use(session({
    secret: 'secretKey',
    resave: 'false',
    saveUninitialized: true,
    store: new mySQLStore(database)
}));
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//routes
app.use(require('./routes'));
app.use(require('./routes/auth'));

    
//server
app.listen(app.get('port'), () => {
    console.log('SERVER ONLINE')
})