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
        		rowJSON = { "type": "Feature", "properties": { "id": row.id, "area": row.name, "count": row.count, "areatype": "TODO"  }, "geometry": { "type": "Point", "coordinates": [ row.long, row.lat ] } };
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
	        		rowJSON = { "type": "Feature", "properties": { "id": row.id, "area": row.name, "count": row.count, "areatype": "TICK" }, "geometry": { "type": "Point", "coordinates": [ row.long, row.lat ] } };
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


exports.loadTodoCrags = function(req, res) {

	 var userSessionId = req._passport.session.user;
	 if(!userSessionId){
		userSessionId = 1; // just for fun we'll set it to my data
	 }

    pg.connect(conString, function(err, client, done) {
	    var retval = "no data";
	    var idformat = "'" + req.params.id + "'";
	    idformat = idformat.toUpperCase();

	    var query = client.query("SELECT a.id, a.name, st_y(a.geo_point) as lat, st_x(a.geo_point) as long, count(*) as count FROM crag a INNER JOIN route r ON r.crag = a.id INNER JOIN todo t ON r.id = t.routeid INNER JOIN appuser c ON t.climberid = c.id WHERE c.id = "+ userSessionId +" GROUP BY a.id");

	    query.on('row', function(row, result) {
	        if (!result) {
	          return res.send('No data found');
	        }
	        else {
	        		rowJSON = { "type": "Feature", "properties": { "id": row.id, "area": row.name, "count": row.count, "parentarea": row.area, "areatype": "CRAG" }, "geometry": { "type": "Point", "coordinates": [ row.long, row.lat ] } };
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
	    // TODO: add parent country and any other parent geography possible to this query.
	    var query = client.query("SELECT a.id, a.name, a.createdby, s.name as state, ST_Y(geo_point) as lat, ST_X(geo_point) as long FROM area a LEFT JOIN usa_states s ON st_within(a.geo_point, s.geo_poly);");

	    query.on('row', function(row, result) {
	        if (!result) {
	          return res.send('No data found');
	        }
	        else {
	        		rowJSON = { "type": "Feature", "properties": { "id": row.id, "area": row.name, "createdby": row.createdby, "areatype": "AREA", "parentstate":row.state }, "geometry": { "type": "Point", "coordinates": [ row.long, row.lat ] } };
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

	    var queryString = "SELECT r.id as routeid, r.name, r.area, rt.type, g.usa as ropegrade, g.hueco as bouldergrade, g.difficultyindex as difficultyindex, r.mpurl, r.mpimgmedurl, r.mpimgsmallurl, r.mpstars, r.mpstarvotes, r.pitches, t.notes, t.date FROM tick t INNER JOIN appuser c ON t.climberid = c.id INNER JOIN route r ON t.routeid = r.id INNER JOIN area a ON r.area = a.id LEFT JOIN grade g ON r.grade = g.id LEFT JOIN route_type rt ON r.type = rt.id WHERE c.id = "+ userSessionId +" ORDER BY t.date;";
	    var query = client.query(queryString);

	    query.on('row', function(row, result) {
	        if (!result) {
	          return res.send('No data found');
	        }
	        else {
	        		thisRowJSON = { "id": row.id, "routeid": row.routeid, "name": row.name, "area": row.area, "type": row.type, "ropegrade": row.ropegrade, "bouldergrade": row.bouldergrade, "difficultyindex": row.difficultyindex, "url": row.mpurl,
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

	    var queryString = "SELECT r.id as routeid, r.name, r.area, cr.id as crag, rt.type, g.usa as ropegrade, g.hueco as bouldergrade, g.difficultyindex as difficultyindex, r.mpurl, r.mpimgmedurl, r.mpimgsmallurl, r.mpstars, r.mpstarvotes, r.pitches FROM todo t INNER JOIN appuser c ON t.climberid = c.id INNER JOIN route r ON t.routeid = r.id INNER JOIN area a ON r.area = a.id LEFT JOIN crag cr ON cr.id = r.crag LEFT JOIN grade g ON r.grade = g.id LEFT JOIN route_type rt ON r.type = rt.id WHERE c.id = "+ userSessionId +";";
	    var query = client.query(queryString);

	    query.on('row', function(row, result) {
	        if (!result) {
	          return res.send('No data found');
	        }
	        else {
	        		thisRowJSON = { "id": row.id, "routeid": row.routeid, "name": row.name, "crag": row.crag, "area": row.area, "type": row.type, "ropegrade": row.ropegrade, "bouldergrade": row.bouldergrade, "difficultyindex": row.difficultyindex, "url": row.mpurl,
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

/////
//	TODO: Determine best approach for exposing location issues
// CURRENTLY RETURNING MISSING AREAS FOR EVERYONE
/////
exports.loadMissingAreas = function(req, res) {

	var userSessionId = req._passport.session.user;
	if(!userSessionId){
		userSessionId = 1; // just for fun we'll set it to my data
	}

	pg.connect(conString, function(err, client, done) {
	    //var queryString = "SELECT r.name, r.mpurl FROM route r WHERE area = -1;";
	    var queryString = "SELECT r.name, r.locationstr, max(r.mpurl) as mpurl FROM route r, area a, todo t, tick ti, appuser c WHERE r.area = -1 and c.id = "+ userSessionId +" and (t.climberid = c.id OR ti.climberid = c.id) and (r.id = t.routeid or r.id = ti.routeid) GROUP BY r.locationstr, r.name;";

	    var query = client.query(queryString);

	    query.on('row', function(row, result) {
	        if (!result) {
	          return res.send('No data found');
	        }
	        else {
	        		thisRowJSON = { "name": row.name, "locationstr": row.locationstr, "mpurl": row.mpurl }
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
		 var geom = "ST_GeomFromText('POINT("+lng+" "+lat+")',4326)"

		 if(areatype === "AREA"){
	    	queryString = "INSERT INTO area(name, geo_point, createdby) VALUES ($1, "+ geom +", $2);";
	    	client.query(queryString, [name, userid]);
	    }
	    else if(areatype === "CRAG") {
	    	queryString = "INSERT INTO crag(name, area, geo_point, createdby) VALUES ($1, $2,"+ geom +", $3);";
	    	client.query(queryString, [name, parentArea, userid]);
	    }

	    done();

		 updateRoutes(-1, areatype)

		 res.json({"name":name, "actiontype": "NEW", "areatype":areatype, "lat":lat, "lng":lng, "persisted":true});
	 })

	 //pg.end();
};

exports.updatearea = function(id, name, lat, lng, areatype, userid, parentArea, res) {
    pg.connect(conString, function(err, client, done) {
		 var queryString;
		 var geom = "ST_GeomFromText('POINT("+lng+" "+lat+")',4326)"

		 if(areatype === "AREA"){
	    	queryString = "UPDATE area SET name = $1, geo_point = "+ geom +", createdby = $2 WHERE id = $3;";
	    	client.query(queryString, [name, userid, id]);
	    }
	    else if(areatype === "CRAG") {
	    	queryString = "UPDATE crag SET name = $1, area = $2, geo_point = "+ geom +", createdby = $3 WHERE id = $4;";
	    	client.query(queryString, [name, parentArea, userid, id]);
	    }

	    done();

	  	 updateRoutes(id, areatype)
		 res.json( {"type": "Feature", "persisted":true, "actiontype": "UPDATE", "properties": { "id": id, "area": name, "createdby": userid, "areatype": areatype }, "geometry": { "type": "Point", "coordinates": [ lng, lat ] } } );
	 })

	 //pg.end();
};


function updateRoutes(changedAreaId, areaType) {

	 var options = {
		  args: [changedAreaId, areaType]
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
