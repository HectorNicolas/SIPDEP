var port = process.env.PORT || 3000;
var express = require('express');
var cookieParser = require('cookie-parser');
var partials = require('express-partials');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var app = express();

/*Locals*/
app.locals.user = '';
app.locals.errorMessage = '';
app.locals.succesfulMessage = '';
app.locals.addPregErrorMessage = '';
app.locals.addPregSuccesfulMessage = '';
app.locals.addRespuestaErrorMessage = '';
app.locals.addRespuestaSuccesfulMessage = '';

app.set('view engine', 'ejs');
app.use(partials());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static('./public'));
app.use(session({
    secret: '1a2b3c4d5e6f7g8h9',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: true,
        httpOnly: true
    }
}));
app.use(passport.initialize());
app.use(passport.session());

/* Routes code*/
require('./routes/routes.js')(app);

var servidor = app.listen(port, function () {
    console.log("The server is listening in 8080 port");
});