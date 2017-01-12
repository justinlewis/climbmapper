var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var pg = require('pg');
var routes = require('./routes/index');
var geo = require('./routes/geo');
var passport = require('passport');
var flash    = require('connect-flash');
var session = require('express-session');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var compiler = webpack(webpackConfig);

require('./config/passport')(passport);


var app = express();

app.use(require("webpack-dev-middleware")(compiler,{
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));

// required for passport
//app.use(session({ secret: 'mysecret' })); // session secret
app.use(require('express-session')({ secret: 'secretkey', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());  //persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var server_port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.set('port', server_port);
app.set('ip', server_ip_address);

app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');

app.use('/', routes);

require('./routes/user_routes.js')(app, passport);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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
