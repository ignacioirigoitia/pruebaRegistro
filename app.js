var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session");
var localsCheck = require("./middlewares/localsCheck");
var cookieCheck = require("./middlewares/cookieCheck");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const methodOverride = require("method-override");

app.use(methodOverride("_method"));

// instalo session, lo requiero y lo uso como middleware de aplicacion con su metodo secret
app.use(session({secret: "Mi Secreto", resave: true, saveUninitialized: true}));




// requiero el middleware de localsCheck y lo uso como middleware de aplicacion para tener los datos en todas las rutas
app.use(localsCheck);

// requiero el middleware de coockie y lo uso como middleware de aplicacion para que no me cierre el usuario 
app.use(cookieCheck);

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
