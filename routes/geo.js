var express = require('express');
var router = express.Router();
var config = require('../config.js');

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
    var client = new pg.Client(conString);
    client.connect();

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
};


exports.loadTickAreas = function(req, res) {
	
	 var userSessionId = req._passport.session.user;
	 if(!userSessionId){
		userSessionId = 1; // just for fun we'll set it to my data	 
	 }
    var client = new pg.Client(conString);
    client.connect();
    
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
};


exports.loadCrags = function(req, res) {
    var client = new pg.Client(conString);
    client.connect();
    
    var retval = "no data";
    var idformat = "'" + req.params.id + "'";
    idformat = idformat.toUpperCase();
     
    var query = client.query("SELECT id, name, area, ST_Y(geo_point) as lat, ST_X(geo_point) as long FROM crag;");
   
    query.on('row', function(row, result) {
        if (!result) {
          return res.send('No data found');
        } 
        else {
        		rowJSON = { "type": "Feature", "properties": { "id": row.id, "name": row.name, "area": row.area }, "geometry": { "type": "Point", "coordinates": [ row.long, row.lat ] } };
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
};


exports.loadTicks = function(req, res) {
	
	 var userSessionId = req._passport.session.user;
	 if(!userSessionId){
		userSessionId = 1; // just for fun we'll set it to my data	 
	 }
    var client = new pg.Client(conString);
    client.connect();
    
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
};

exports.loadToDos = function(req, res) {
	
	 var userSessionId = req._passport.session.user;
	 if(!userSessionId){
		userSessionId = 1; // just for fun we'll set it to my data	 
	 }
    var client = new pg.Client(conString);
    client.connect();
    
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
};

exports.loadMissingAreas = function(req, res) {
    var client = new pg.Client(conString);
    client.connect();

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
};
