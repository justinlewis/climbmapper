var Strategy = require('passport-local').Strategy;
var users = require('../routes/users');
var bcrypt   = require('bcrypt');

const saltRounds = 10

module.exports = function(passport) {

    passport.use('local', new Strategy({
            usernameField : 'username',
          passwordField : 'password',
          passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, cb) {

            users.findByUsername(username, function(err, user) {
                if(err) { 
                    return cb(err); 
                }
                if(!user){ 
                    return cb(null, false); 
                }
                // Load hash from your password DB.
                bcrypt.compare(password, user.password, function(err, res) {
                    // Success
                    if (res == true)
                        return cb(null, user); 
                    else {
                    	return cb(null, false, req.flash('loginMessage', 'Oops... Wrong password. Please try again.')); 
                    }
                });
            });
          }
    ));
    
    passport.use('local-signup', new Strategy({
            usernameField : 'username',
          passwordField : 'password',
          passReqToCallback : true // allows us to pass back the entire request to the callback
      },
      function(req, username, password, cb) {
        
            users.verifyUser(username, function(err, user) {
              if(err){ 
                return cb(err, req.flash('loginMessage', 'A system error has occurred. ')); 
              }
              
              if(user){ 
                return cb(null, false, req.flash('loginMessage', 'This user name is already taken. Please try a new one.')); 
              }
              else{
                var isValidPass = users.verifyPassword(password);
                
                if(isValidPass){
                    users.createUser(username, password, cb, req);
                }
                else {
                    return cb(null, false, req.flash('loginMessage', 'Your password is too weak. Please try a new one.'));
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

}