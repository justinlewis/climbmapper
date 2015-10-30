import json, requests, psycopg2
from psycopg2.extensions import adapt

class ClimbingAreas:
	
	def init(self):
		print "init"
		
	def getAreas(self):
		
		#DB connection properties
		conn = psycopg2.connect(dbname = 'climbmapper', host= 'localhost', port= 5432, user = 'postgres',password= 'SUPERSECRET')
		cur = conn.cursor()  ## open a cursor
		areaPtsR = open('area_pts.geojson', 'r')
		
		#truncate = "TRUNCATE area;"
		#cur.execute(truncate)
		#conn.commit()
		
		cur.execute("SELECT name FROM area;")
		areaLookup = cur.fetchall()	
		
		with open('area_pts.geojson') as data_file:    
			data = json.load(data_file)
			areasArr = data["features"]
		
		for area in areasArr:
			geom = area["geometry"]
			geomType = geom["type"]
			coords = geom["coordinates"]
			id = area["properties"]["id"]
			areaName = area["properties"]["area"]
			if self.areaExists(areaName) == False:
				print "Adding: ", areaName
				insertMog = cur.mogrify("INSERT INTO area(id, name, geo_point, lat, long) VALUES(%s,%s,ST_GeomFromText(%s,4326),%s,%s)", (str(id),areaName,"POINT("+str(coords[0])+" "+str(coords[1])+")",str(coords[1]),str(coords[0])))		
				cur.execute(insertMog)
				conn.commit() 
 
		cur.close()
		conn.close()

	def areaExists(self, area):
		#DB connection properties
		conn = psycopg2.connect(dbname = 'climbmapper', host= 'localhost', port= 5432, user = 'postgres',password= 'SUPERSECRET')
		cur = conn.cursor()  ## open a cursor
		
		cur.execute("SELECT name FROM area;")
		areaLookup = cur.fetchall()	
		match = False
		for row in areaLookup:
			a = row[0].lower()
			if area.lower() == a:
				match = True
		
		return match

if __name__ == '__main__':
	
	areas = ClimbingAreas()
	areasData = areas.getAreas()


