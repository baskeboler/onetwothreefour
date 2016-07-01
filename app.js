var express = require('express');
require('./init_mongo');
var config = require('./config/config');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var bands = require('./routes/band');
var venues = require('./routes/venue');
var pictures = require('./routes/picture');
var geocoding = require('./routes/geocoding');

var app = express();
var multer = require('multer');
var upload = multer({ dest: config.tmpDir });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/libs', express.static(path.join(__dirname, 'bower_components')));
app.use('/', routes);
app.use('/users', users);
app.use('/api/band/:bandId/pictures', upload.fields([{name: 'image'}]));
app.use('/api/band', bands);
app.use('/api/venue', venues);
app.use('/api/geocoding', geocoding);
app.use('/api/pictures', upload.fields([{name: 'image'}]), pictures);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
