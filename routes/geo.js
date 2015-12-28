var express = require('express');
var router = express.Router();
var config = require('../config.js');
var PythonShell = require('python-shell');

var pg = require('pg');

if(process.env.OPENSHIFT_POSTGRESQL_DB_URL){
	var dbUrl = process.env.OPENSHIFT_POSTGRESQL_DB_URL + "/climbmapper";
}
var conString = dbUrl || 'postgres://'+config.user_name+':'+config.password+'@localhost:5432/climbmapper';


exports.loadTodoAreas = function(req, res) {
    
    var userSessionId = req._passport.session.user;
    if(!userSessionId){
		userSessionId = 1; // just for fun we'll set it to my data	 
	 }

	pg.connect(conString, function(err, client, done) {
    	var retval = "no data";
    	var idformat = "'" + req.params.id + "'";
    	idformat = idformat.toUpperCase();
     
    	var query = client.query("SELECT a.id, a.name, st_y(a.geo_point) as lat, st_x(a.geo_point) as long, count(*) as count FROM area a INNER JOIN route r ON r.area = a.id INNER JOIN todo t ON r.id = t.routeid INNER JOIN appuser c ON t.climberid = c.id WHERE c.id = "+ userSessionId +" GROUP BY a.id;");
   
    	query.on('row', function(row, result) {
        if (!result) {
          return res.send('No data found');
        } 
        else {
        		rowJSON = { "type": "Feature", "properties": { "id": row.id, "area": row.name, "count": row.count }, "geometry": { "type": "Point", "coordinates": [ row.long, row.lat ] } };
        		result.addRow(rowJSON);
        }
    	})
    
    	query.on("end", function (result) {
        		
          res.send( 
          	JSON.stringify(
          		{ "type": "FeatureCollection", "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },                                                                         
					"features": result.rows 
					}
          	) 
          );
          res.end();
    	})
    	
    	done();
    })
    
    //pg.end();
};


exports.loadTickAreas = function(req, res) {
	
	 var userSessionId = req._passport.session.user;
	 if(!userSessionId){
		userSessionId = 1; // just for fun we'll set it to my data	 
	 }

    pg.connect(conString, function(err, client, done) {
	    var retval = "no data";
	    var idformat = "'" + req.params.id + "'";
	    idformat = idformat.toUpperCase();
	     
	    var query = client.query("SELECT a.id, a.name, st_y(a.geo_point) as lat, st_x(a.geo_point) as long, count(*) as count FROM area a INNER JOIN route r ON r.area = a.id INNER JOIN tick t ON r.id = t.routeid INNER JOIN appuser c ON t.climberid = c.id WHERE c.id = "+ userSessionId +" GROUP BY a.id;");
	   
	    query.on('row', function(row, result) {
	        if (!result) {
	          return res.send('No data found');
	        } 
	        else {
	        		rowJSON = { "type": "Feature", "properties": { "id": row.id, "area": row.name, "count": row.count }, "geometry": { "type": "Point", "coordinates": [ row.long, row.lat ] } };
	        		result.addRow(rowJSON);
	        }
	    })
	    
	    query.on("end", function (result) {
	        		
	          res.send( 
	          	JSON.stringify(
	          		{ "type": "FeatureCollection", "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },                                                                         
						"features": result.rows 
						}
	          	) 
	          );
	          res.end();
	    })
	    
	    done();
	 })
	 
	 //pg.end();
};


exports.loadCrags = function(req, res) {
    pg.connect(conString, function(err, client, done) {
	    var retval = "no data";
	    var idformat = "'" + req.params.id + "'";
	    idformat = idformat.toUpperCase();
	     
	    var query = client.query("SELECT id, name, area, ST_Y(geo_point) as lat, ST_X(geo_point) as long FROM crag;");
	   
	    query.on('row', function(row, result) {
	        if (!result) {
	          return res.send('No data found');
	        } 
	        else {
	        		rowJSON = { "type": "Feature", "properties": { "id": row.id, "area": row.name, "parentarea": row.area, "areatype": "CRAG" }, "geometry": { "type": "Point", "coordinates": [ row.long, row.lat ] } };
	        		result.addRow(rowJSON);
	        }
	    })
	    
	    query.on("end", function (result) {
	        		
	          res.send( 
	          	JSON.stringify(
	          		{ "type": "FeatureCollection", "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },                                                                         
						"features": result.rows 
						}
	          	) 
	          );
	          res.end();
	    })
	    
	    done();
	 })
	 
	 //pg.end();
};


exports.loadAreas = function(req, res) {
    pg.connect(conString, function(err, client, done) {
	     
	    var query = client.query("SELECT id, name, createdby, ST_Y(geo_point) as lat, ST_X(geo_point) as long FROM area;");
	   
	    query.on('row', function(row, result) {
	        if (!result) {
	          return res.send('No data found');
	        } 
	        else {
	        		rowJSON = { "type": "Feature", "properties": { "id": row.id, "area": row.name, "createdby": row.createdby, "areatype": "AREA" }, "geometry": { "type": "Point", "coordinates": [ row.long, row.lat ] } };
	        		result.addRow(rowJSON);
	        }
	    })
	    
	    query.on("end", function (result) {
	        		
	          res.send( 
	          	JSON.stringify(
	          		{ "type": "FeatureCollection", "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },                                                                         
						"features": result.rows 
						}
	          	) 
	          );
	          res.end();
	    })
	    
	    done();
	 })
	 
	 //pg.end();
};


exports.loadTicks = function(req, res) {
	
	 var userSessionId = req._passport.session.user;
	 if(!userSessionId){
		userSessionId = 1; // just for fun we'll set it to my data	 
	 }
/*    var client = new pg.Client(conString);
    client.connect();*/
    
    pg.connect(conString, function(err, client, done) {
	    var retval = "no data";
	    var idformat = "'" + req.params.id + "'";
	    idformat = idformat.toUpperCase();
	     
	    var queryString = "SELECT r.id as routeid, r.name, r.area, rt.type, g.usa as ropegrade, g.hueco as bouldergrade, r.mpurl, r.mpimgmedurl, r.mpimgsmallurl, r.mpstars, r.mpstarvotes, r.pitches, t.notes, t.date FROM tick t INNER JOIN appuser c ON t.climberid = c.id INNER JOIN route r ON t.routeid = r.id INNER JOIN area a ON r.area = a.id LEFT JOIN grade g ON r.grade = g.id LEFT JOIN route_type rt ON r.type = rt.id WHERE c.id = "+ userSessionId +" ORDER BY t.date;";
	    var query = client.query(queryString);
	    
	    query.on('row', function(row, result) {
	        if (!result) {
	          return res.send('No data found');
	        } 
	        else {
	        		thisRowJSON = { "id": row.id, "routeid": row.routeid, "name": row.name, "area": row.area, "type": row.type, "ropegrade": row.ropegrade, "bouldergrade": row.bouldergrade, "url": row.mpurl, 
	        						    "imgSmall": row.mpimgsmallurl, "imgMed": row.mpimgmedurl, "stars": row.mpstars, "starVotes": row.mpstarvotes, "pitches": row.pitches,
	        						    "notes": row.notes, "date": row.date }
	        		result.addRow(thisRowJSON);
	        }
	    })
	    
	    query.on("end", function (result) {
	        		
	          res.send( 
	          	JSON.stringify(
	          		{ "routes" : result.rows }
	          	) 
	          );
	          res.end();
	    })
	    
	    done();
	 })
	 
	 //pg.end();
};

exports.loadToDos = function(req, res) {
	
	 var userSessionId = req._passport.session.user;
	 if(!userSessionId){
		userSessionId = 1; // just for fun we'll set it to my data	 
	 }
    
    pg.connect(conString, function(err, client, done) {
	    var retval = "no data";
	    var idformat = "'" + req.params.id + "'";
	    idformat = idformat.toUpperCase();
	     
	    var queryString = "SELECT r.id as routeid, r.name, r.area, rt.type, g.usa as ropegrade, g.hueco as bouldergrade, r.mpurl, r.mpimgmedurl, r.mpimgsmallurl, r.mpstars, r.mpstarvotes, r.pitches FROM todo t INNER JOIN appuser c ON t.climberid = c.id INNER JOIN route r ON t.routeid = r.id INNER JOIN area a ON r.area = a.id LEFT JOIN grade g ON r.grade = g.id LEFT JOIN route_type rt ON r.type = rt.id WHERE c.id = "+ userSessionId +";";
	    var query = client.query(queryString);
	    
	    query.on('row', function(row, result) {
	        if (!result) {
	          return res.send('No data found');
	        } 
	        else {
	        		thisRowJSON = { "id": row.id, "routeid": row.routeid, "name": row.name, "area": row.area, "type": row.type, "ropegrade": row.ropegrade, "bouldergrade": row.bouldergrade, "url": row.mpurl, 
	        						    "imgSmall": row.mpimgsmallurl, "imgMed": row.mpimgmedurl, "stars": row.mpstars, "starVotes": row.mpstarvotes, "pitches": row.pitches }
	        		result.addRow(thisRowJSON);
	        }
	    })
	    
	    query.on("end", function (result) {
	        		
	          res.send( 
	          	JSON.stringify(
	          		{ "routes" : result.rows }
	          	) 
	          );
	          res.end();
	    })
	    
	    done();
	 })
	 
	 //pg.end();
};

exports.loadMissingAreas = function(req, res) {
	pg.connect(conString, function(err, client, done) {
	    var queryString = "SELECT r.name, r.mpurl FROM route r WHERE area = -1;";
	    var query = client.query(queryString);
	    
	    query.on('row', function(row, result) {
	        if (!result) {
	          return res.send('No data found');
	        } 
	        else {
	        		thisRowJSON = { "name": row.name, "mpurl": row.mpurl }
	        		result.addRow(thisRowJSON);
	        }
	    })
	    
	    query.on("end", function (result) {
	        		
	          res.send( 
	          	JSON.stringify(
	          		{ "missingAreas" : result.rows }
	          	) 
	          );
	          res.end();
	    })
	    
	    done();
	 })
	 
	 //pg.end();
};



// TODO: db trigger to match todo/tick area attribute with the new area record when created. 
// currently those attributes are only set on data upload
exports.persistarea = function(name, lat, lng, areatype, userid, parentArea, res) {
    pg.connect(conString, function(err, client, done) {
		 var queryString;
		 if(areatype === "AREA"){
	    	queryString = "INSERT INTO area(name, geo_point, createdby) VALUES ('"+name+"',ST_GeomFromText('POINT("+lng+" "+lat+")',4326), "+userid+");";
	    }
	    else if(areatype === "CRAG") {
	    	queryString = "INSERT INTO crag(name, area, geo_point, createdby) VALUES ('"+name+"','"+parentArea+"',ST_GeomFromText('POINT("+lng+" "+lat+")',4326), "+userid+");";
	    }
	    
	    var query = client.query(queryString);    
	    done();
	    
		 updateRoutes(-1)
		 
		 res.json({"name":name, "actiontype": "NEW", "areatype":areatype, "lat":lat, "lng":lng, "persisted":true});
	 })
	 
	 //pg.end();
};

exports.updatearea = function(id, name, lat, lng, areatype, userid, parentArea, res) {
    pg.connect(conString, function(err, client, done) {
		 var queryString;
		 if(areatype === "AREA"){
	    	queryString = "UPDATE area SET name = '"+name+"', geo_point = ST_GeomFromText('POINT("+lng+" "+lat+")',4326), createdby = "+userid+" WHERE id = "+id+";";
	    }
	    else if(areatype === "CRAG") {
	    	queryString = "UPDATE crag SET name = '"+name+"', area = '"+parentArea+"', geo_point = ST_GeomFromText('POINT("+lng+" "+lat+")',4326), createdby = "+userid+" WHERE id = "+id+";";
	    }
	    
	    var query = client.query(queryString);  
	        
	    done();

	  	 updateRoutes(id)
		 res.json( {"type": "Feature", "persisted":true, "actiontype": "UPDATE", "properties": { "id": id, "area": name, "createdby": userid, "areatype": areatype }, "geometry": { "type": "Point", "coordinates": [ lng, lat ] } } );
	 })
	  
//		 res.json( {"type": "Feature", "persisted":true, "actiontype": "UPDATE", "properties": { "id": id, "area": name, "createdby": userid, "areatype": areatype }, "geometry": { "type": "Point", "coordinates": [ lng, lat ] } } );
	 //pg.end();
};


function updateRoutes(changedAreaId) {
	 
	 var options = {
		  args: [changedAreaId]
	 };
	 PythonShell.run('./public/data/update_routes.py', options, function (err, results) {
	  	if (err){
	  		console.log(err)
	  		throw err
	  	}
	  	
	  	// results is an array consisting of messages collected during execution 
	  	if(results.slice(-1)[0] === "DONE"){
  			console.log("Update complete")
  	  	}
	 });
}
