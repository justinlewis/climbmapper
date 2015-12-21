	
var spawn = require("child_process").spawn;
var users = require('../routes/users');

module.exports = function(app, passport) {	
	// LOG-IN
	app.get('/login', function(req, res) {
		res.render('login.html',  { message : req.flash("loginMessage") }); 
	});
	 
	
	app.post('/login',
	  passport.authenticate('local', { successRedirect: '/',
	                                   failureRedirect: '/login', 
	                                   failureFlash : true
	                                   })
	);
	
	// SIGN-UP
	app.get('/signup', function(req, res) {
	
	   // render the page and pass in any flash data 
		res.render('signup.html', { message : req.flash("loginMessage") }); 
	});
	
	app.post('/signup', 
		passport.authenticate('local-signup', {
	     													successRedirect : '/profile', 
	     													failureRedirect : '/signup',
	     													failureFlash : true
															})
	);
	
	
	// PROFILE
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.html', {
			user : req.user 
		});
	});
	
	
	app.get('/updateprofile', isLoggedIn, function(req, res, cb) {
		res.render('updateprofile.html', {
			user : req.user 
		});
	});
	
	app.post('/updateprofile', isLoggedIn, function(req, res) {
		users.updateProfile(res, req.user, req.body.mpuserkey, req.body.email, req.body.password);
	});
	
	
	// LOGOUT
	app.get('/logout', function(req, res) {
	     req.logout();
	     res.redirect('/');
	});
	 
	
	
	// MOUNTAN PROJECT UPDATE
	app.post('/mpupdate', isLoggedIn, function(req, res) {	

		var process = spawn('python',[ "./public/data/mp_data.py", req.user.mountainprojkey.replace(/ /g,''), req.user.emails[0], req.user.id ]);

		process.stdout.setEncoding('utf8');
		process.stdout.on('data', function (data){
			var str = data.toString();
			var lines = str.split(/(\r?\n)/g);
			
	  		for (var i=0; i<lines.length; i++) {
	  			var line = lines[i].replace(/(\r\n|\n|\r)/gm,"").replace(/ /g,'');

	  			if(line === "DONE"){
	  				console.log("Update complete")
	  				res.redirect('/profile');
	  			}
	  		}
		});
	});
}


// Route middleware to check for authentication status
function isLoggedIn(req, res, next) {
	
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/login');
}