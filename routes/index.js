var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var userName = "";
	if (req.isAuthenticated()){
		userName = req.user.username;
	}
	else {
		userName = "Example User";
	}
  res.render('index', { title: 'My Climb Mapper', username: userName });
});

exports.users = require('./users');


module.exports = router;
