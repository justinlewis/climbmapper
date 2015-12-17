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
var Strategy = require('passport-local').Strategy;
var flash    = require('connect-flash');
var session = require('express-session');


  
passport.use('local', new Strategy(
  function(username, password, cb) {
    users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }
));

passport.use('local-signup', new Strategy(
  function(username, password, cb) {
  	
	  	users.verifyUser(username, function(err, user) {
	      if(err){ 
	      	return cb(err); 
	      }
	      
	      if(user){ 
	      	console.log("User already exists - ", user);
	      	//return cb(null, false); // USER ALREADY EXISTS!!!
	      }
	      else{
	      	var isValidPass = users.verifyPassword(password);
	      	
	      	if(isValidPass){
	      		var newUserObj = users.createUser(username, password);
	      		
	      		return cb(null, newUserObj);
	      	}
	      }
	    });
	}
));
  
  
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});



var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'


var app = express();

// required for passport
//app.use(session({ secret: 'mysecret' })); // session secret
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
//app.use(flash()); // use connect-flash for flash messages stored in session

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});



// =====================================
// LOGIN ===============================
// =====================================
// show the login form
app.get('/login', function(req, res) {

     // render the page and pass in any flash data if it exists
     res.render('login.hjs'); 
});
 

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login'
                                   })
);

app.get('/signup', function(req, res) {

     // render the page and pass in any flash data if it exists
     res.render('signup.hjs'); 
});

// process the signup form
app.post('/signup', 
	passport.authenticate('local-signup', {
     													successRedirect : '/', // redirect to the secure profile section
     													failureRedirect : '/signup' // redirect back to the signup page if there is an error
}));

 
 
// =====================================
// LOGOUT ==============================
// =====================================
app.get('/logout', function(req, res) {
     req.logout();
     res.redirect('/');
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




app.use('/', routes);
//app.use('/users', users);

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
