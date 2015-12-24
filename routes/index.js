var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var userName = "";
	var userId = 1;
	if (req.isAuthenticated()){
		userName = req.user.username;
		userId = req.user.id;
	}
	else {
		userName = "Example User";
	}
  res.render('index', { title: 'Climb Mapper', username: userName, isAuthenticated: req.isAuthenticated(), authenticatedUserId: userId });
});

exports.users = require('./users');


module.exports = router;
