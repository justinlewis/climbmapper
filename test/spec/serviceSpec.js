var request = require("request");

//
//
// TODO: add tests for post requests
//
//



var base_url = "http://localhost:8080/"


describe("Not Authenticated Server", function() {
	
  describe("GET /", function() {
    it("Should return status code 200", function(done) {
      request.get(base_url, function(error, response, body) {

        expect(response.statusCode).toBe(200);
        done();
      });
    });
  });
   
  
  describe("/todoareas", function() {
    it("Should return GeoJSON", function(done) {
      request.get(base_url+"todoareas", function(error, response, body) {
		  var respJSON = JSON.parse(response.body);

        expect(respJSON.type).toBe("FeatureCollection");
        expect(respJSON.crs.type).toBe("name");
        expect(respJSON.crs.properties.name).toBe("urn:ogc:def:crs:OGC:1.3:CRS84");
        expect(respJSON.features[0].type).toBe("Feature");
		  expect(respJSON.features[0].properties.id).toBeGreaterThan(0);
		  expect(respJSON.features[0].properties.count).toBeGreaterThan(0);
		  expect(respJSON.features[0].geometry.type).toBe("Point");
		  expect(respJSON.features[0].geometry.coordinates.length).toBe(2);
        done();
      });
    });
  });
  
  describe("/tickareas", function() {
    it("Should return GeoJSON", function(done) {
      request.get(base_url+"tickareas", function(error, response, body) {
		  var respJSON = JSON.parse(response.body);

        expect(respJSON.type).toBe("FeatureCollection");
        expect(respJSON.crs.type).toBe("name");
        expect(respJSON.crs.properties.name).toBe("urn:ogc:def:crs:OGC:1.3:CRS84");
        expect(respJSON.features[0].type).toBe("Feature");
		  expect(respJSON.features[0].properties.id).toBeGreaterThan(0);
		  expect(respJSON.features[0].properties.count).toBeGreaterThan(0);
		  expect(respJSON.features[0].geometry.type).toBe("Point");
		  expect(respJSON.features[0].geometry.coordinates.length).toBe(2);
        done();
      });
    });
  });
  
  describe("/crags", function() {
    it("Should return GeoJSON", function(done) {
      request.get(base_url+"crags", function(error, response, body) {
		  var respJSON = JSON.parse(response.body);

        expect(respJSON.type).toBe("FeatureCollection");
        expect(respJSON.crs.type).toBe("name");
        expect(respJSON.crs.properties.name).toBe("urn:ogc:def:crs:OGC:1.3:CRS84");
        expect(respJSON.features[0].type).toBe("Feature");
		  expect(respJSON.features[0].properties.id).toBeGreaterThan(0);
		  expect(respJSON.features[0].properties.parentarea).toBeGreaterThan(0);
		  expect(respJSON.features[0].properties.areatype).toBe("CRAG");
		  expect(respJSON.features[0].geometry.type).toBe("Point");
		  expect(respJSON.features[0].geometry.coordinates.length).toBe(2);
        done();
      });
    });
  });
  
  describe("/areas", function() {
    it("Should return GeoJSON", function(done) {
      request.get(base_url+"areas", function(error, response, body) {
		  var respJSON = JSON.parse(response.body);

        expect(respJSON.type).toBe("FeatureCollection");
        expect(respJSON.crs.type).toBe("name");
        expect(respJSON.crs.properties.name).toBe("urn:ogc:def:crs:OGC:1.3:CRS84");
        expect(respJSON.features[0].type).toBe("Feature");
		  expect(respJSON.features[0].properties.id).toBeGreaterThan(0);
		  expect(respJSON.features[0].properties.area.length).toBeGreaterThan(0);
		  expect(respJSON.features[0].properties.createdby).toBeGreaterThan(0);
		  expect(respJSON.features[0].properties.areatype).toBe("AREA");
		  expect(respJSON.features[0].geometry.type).toBe("Point");
		  expect(respJSON.features[0].geometry.coordinates.length).toBe(2);
        done();
      });
    });
  });
  
  describe("/todos", function() {
    it("Should return JSON", function(done) {
      request.get(base_url+"todos", function(error, response, body) {
		  var respJSON = JSON.parse(response.body);
			
		  expect(respJSON.routes.length).toBeGreaterThan(0);
        expect(respJSON.routes[0].hasOwnProperty("routeid")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("name")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("area")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("type")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("ropegrade")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("bouldergrade")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("url")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("imgSmall")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("imgMed")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("stars")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("starVotes")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("pitches")).toBeTruthy();
              
        done();
      });
    });
  });
  
  describe("/ticks", function() {
    it("Should return JSON", function(done) {
      request.get(base_url+"ticks", function(error, response, body) {
		  var respJSON = JSON.parse(response.body);
			
		  expect(respJSON.routes.length).toBeGreaterThan(0);
        expect(respJSON.routes[0].hasOwnProperty("routeid")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("name")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("area")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("type")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("ropegrade")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("bouldergrade")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("url")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("imgSmall")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("imgMed")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("stars")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("starVotes")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("pitches")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("notes")).toBeTruthy();
        expect(respJSON.routes[0].hasOwnProperty("date")).toBeTruthy();
              
        done();
      });
    });
  });
  
  describe("/missingareas", function() {
    it("Should return GeoJSON", function(done) {
      request.get(base_url+"missingareas", function(error, response, body) {
		  var respJSON = JSON.parse(response.body);
        
        expect(respJSON.hasOwnProperty("missingAreas")).toBeTruthy();

        done();
      });
    });
  });
  
});