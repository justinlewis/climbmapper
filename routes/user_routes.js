
var PythonShell = require('python-shell');
var users = require('../routes/users');
var geo = require('../routes/geo');

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
		var getNotes = false;
		if(req.body.getnotifications){
			getNotes = true
		}
		users.updateProfile(res, req.user, req.body.mpuserkey, req.body.email, req.body.password, getNotes);
	});


	// LOGOUT
	app.get('/logout', function(req, res) {
	     req.logout();
	     res.redirect('/');
	});



	// MOUNTAN PROJECT UPDATE
	app.post('/mpupdate', isLoggedIn, function(req, res) {

		var options = {
		  args: [req.user.mountainprojkey.replace(/ /g,''), req.user.emails[0].replace(/ /g,''), req.user.id]
		};

		if(options.args[0].length < 1 || options.args[1].length < 1){
			console.log("improper profile settings")
			res.render('profile.html', {
				user : req.user,
				message : "To pull data from Mountain Project you must include the email used for your Mountain Project account as well as the Mountain Project API key. Please try adding them to your profile and attempting an update again."
			});
		}
		else{
			PythonShell.run('./public/data/mp_data.py', options, function (err, results) {
			  	if (err) throw err;

			  	// results is an array consisting of messages collected during execution
			  	if(results.slice(-1)[0] === "DONE"){
		  			console.log("Update complete")
		  			res.redirect('/profile');
		  	  	}
			});
		}
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
