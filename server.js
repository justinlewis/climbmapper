var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var fs      = require('fs');
var pg = require('pg');
var routes = require('./routes/index');
var users = require('./routes/users');
var geo = require('./routes/geo');
var passport = require('passport');
var Strategy = require('passport-http').DigestStrategy;
//var db = require('db');

passport.use(new Strategy({ qop: 'auth' },
  function(username, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      return cb(null, user, user.password);
    })
  }));

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'


var app = express();

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});

/*app.get('/',
  passport.authenticate('digest', { session: false }),
  function(req, res) {
    res.json({ username: req.user.username, email: req.user.emails[0].value });
  });*/
  
// curl -v --user jack:secret --digest "http://127.0.0.1:3000/hello?name=World&x=y"
app.get('/hello',
  passport.authenticate('digest', { session: false }),
  function(req, res) {
    res.json({ message: 'Hello, ' + req.query.name, from: req.user.username });
  });
  
// curl -v -d "name=World" --user jack:secret --digest http://127.0.0.1:3000/hello
app.post('/hello',
  passport.authenticate('digest', { session: false }),
//  express.bodyParser(),
  function(req, res) {
    res.json({ message: 'Hello, ' + req.body.name, from: req.user.username });
  });

app.get('/todoareas', geo.loadTodoAreas);
app.get('/tickareas', geo.loadTickAreas);
app.get('/crags', geo.loadCrags);
app.get('/todos', geo.loadToDos);
app.get('/ticks', geo.loadTicks);
app.get('/missingareas', geo.loadMissingAreas);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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
