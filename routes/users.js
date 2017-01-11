var express = require('express');
var router = express.Router();
var pg = require('pg');
var bcrypt   = require('bcrypt');

var config = require('../config.js');

const saltRounds = 10

if(process.env.OPENSHIFT_POSTGRESQL_DB_URL){
	var dbUrl = process.env.OPENSHIFT_POSTGRESQL_DB_URL + "/climbmapper";
}
var conString = dbUrl || 'postgres://'+config.user_name+':'+config.password+'@localhost:5432/climbmapper';


exports.createUser = function(username, password, cb, req) {

	// Has the password
	bcrypt.hash(password, saltRounds, function(err, hash) {
   
	  	// Store hash in your password DB. 
	   	pg.connect(conString, function(err, client, done) {
		   console.log("creating user")
		   var query = client.query("INSERT INTO appuser(username, password, displayname, email) VALUES ('"+username+"','"+hash+"','"+username+"',null);");
		   
		//   var userQuery = client.query("SELECT id, username, password, displayname, email FROM appuser WHERE username = '"+username+"';");
		   
			done();  
		   
			
			var newUserObj = {
		 			"id": 0, // TODO: this is fine for now  
		 			"username": username, 
		 			"displayname": username, 
		 			"emails": ["email"] 
		 	};
		 	
		 	return cb(null, newUserObj, req.flash('loginMessage', 'Now login with your new user. I know I should log you in automatically at this point but for now I need you to do it.'));
		})
	 
	});
	//pg.end();
}

exports.updateProfile = function(res, user, mpuserkey, email, password, getnotifications) {
   
	// Has the password
	bcrypt.hash(password, saltRounds, function(err, hash) {
	   pg.connect(conString, function(err, client, done) {

		   if(mpuserkey.length > 0) {
		   	client.query("UPDATE appuser SET mountainprojkey='"+mpuserkey+ "' WHERE id ='"+user.id.toString()+"';");
		   }
		   if(email.length > 0){
		   	client.query("UPDATE appuser SET email='"+email+"' WHERE id ='"+user.id.toString()+"';");
		   }
		   if(password.length > 0){
		   	client.query("UPDATE appuser SET password='"+password+"' WHERE id ='"+user.id.toString()+"';");
		   }
		   if(getnotifications !== user.getnotifications){
		   	client.query("UPDATE appuser SET getnotifications='"+getnotifications+"' WHERE id ='"+user.id.toString()+"';");
		   }
		   
		   done()

		   res.redirect('/profile');
		})
   
	});
   //pg.end();
}


exports.verifyPassword = function (password) {
	// Load hash from your password DB. 
	bcrypt.compare(password, hash, function(err, res) {
	    res == true 
	});
	bcrypt.compare(someOtherPlaintextPassword, hash, function(err, res) { // SET UP PW COMPARISON
	    res == false 
	});
}


exports.verifyUser = function (username, cb) {
   
   pg.connect(conString, function(err, client, done) {
		var query = client.query("SELECT id, username, password, displayname, email, mountainprojkey, getnotifications FROM appuser;");
	   
	    query.on('row', function(row, result) {
	    	if (row) {
	    	  rowJSON = { "id": row.id, "username": row.username, "password": row.password, "displayname": row.displayname, "emails": [row.email], "mountainprojkey": row.mountainprojkey, "getnotifications": row.getnotifications };
	        result.addRow(rowJSON);
	      }
	    })
	    
	    query.on("end", function (result) {
	    		var records = result.rows;
				var theUser = null;
				
	    		for (var i = 0; i < records.length; i++) {
			      var record = records[i];
			      if (record.username === username) {
			        return cb(null, record);
			      }
			   }
			    
			   return cb(null, false);
	    })
	    
	    done();
	 })
	 
	 //pg.end();
}


exports.findByUsername = function(username, cb) {
  process.nextTick(function() { 	  
    pg.connect(conString, function(err, client, done) {
	    var query = client.query("SELECT id, username, password, displayname, email, mountainprojkey, getnotifications FROM appuser;");
	   
	    query.on('row', function(row, result) {
	    	  
	        if (row) {
	        		rowJSON = { "id": row.id, "username": row.username, "password": row.password, "displayname": row.displayname, "emails": [row.email], "mountainprojkey": row.mountainprojkey, "getnotifications": row.getnotifications };
	        		result.addRow(rowJSON);
	        }
	    })
	    
	    query.on("end", function (result) {
	    		
	    		var records = result.rows;
	    
	    		for (var i = 0; i < records.length; i++) {
			      var record = records[i];
			      if (record.username === username) {
			        return cb(null, record);
			      }
			    }
	
	    		return cb(null, null);
	    })
	    
	    done();
	 })
  });
  
  //pg.end();
}


/*exports.findByEmail = function(email, cb) {
  process.nextTick(function() { 	  
  	 var client = new pg.Client(conString);
    client.connect();
    
    var query = client.query("SELECT id, username, password, displayname, email FROM appuser;");
   
    query.on('row', function(row, result) {
    	  
        if (row) {
        		rowJSON = { "id": row.id, "username": row.username, "password": row.password, "displayname": row.displayname, "emails": [row.email] };
        		result.addRow(rowJSON);
        }
    })
    
    query.on("end", function (result) {
    		
    		var records = result.rows;
    		
    		for (var i = 0, len = records.length; i < len; i++) {
		      var record = records[i];
		      console.log(record.emails[0], " - ", email)
		      if (record.emails[0] === email) {
		        return cb(null, record);
		      }
		      else{
					console.log("nope")		      
		      }
		    }

    		return cb(null, null);
    })

  });
}
*/

exports.findById = function(id, cb) {
  process.nextTick(function() {  
    pg.connect(conString, function(err, client, done) {
	    var query = client.query("SELECT id, username, password, displayname, email, mountainprojkey, getnotifications FROM appuser;");
	   
	    query.on('row', function(row, result) {
	        if (row) {
	        		rowJSON = { "id": row.id, "username": row.username, "password": row.password, "displayname": row.displayname, "emails": [row.email], "mountainprojkey": row.mountainprojkey, "getnotifications": row.getnotifications };
	        		result.addRow(rowJSON);
	        }
	    })
	    
	    query.on("end", function (result) { 		
	    		var records = result.rows; 		
	    		for (var i = 0, len = records.length; i < len; i++) {
			      var record = records[i];
			      if (record.id === id) {
			        return cb(null, record);
			      }
			    }
	
	    		return cb(null, null);
	    })
	    
	    done();
	 })
  });
  
  //pg.end();
}
