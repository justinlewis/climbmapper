import json, requests, psycopg2, collections, sys, os

#TODO 	- break MPData into its own parent that Update Routes inherits
#			* This would allow us to customize diffirent climbing app data
#		- use try/except for data requests
class MPData_Routes:
	
	def __init__(self, dbConnectParams):
		
		self.dbHost = dbConnectParams['dbHost']
		self.dbPort = dbConnectParams['dbPort']
		self.dbUser = dbConnectParams['dbUser']
		self.dbPass = dbConnectParams['dbPass']
		self.dbName = dbConnectParams['dbName']

		#DB connection properties
		self.conn = psycopg2.connect(database = self.dbName,\
								host= self.dbHost,\
								port= self.dbPort,\
								user = self.dbUser,\
								password= self.dbPass)

		self.cur = self.conn.cursor()  ## open a cursor
		
		#cur.execute("SELECT a.id as areaId, a.name as areaName FROM area a;")	
		self.cur.execute("""SELECT a.id as areaId, a.name as areaName, c.name AS country, s.name AS state FROM area a
							INNER JOIN countries c ON st_within(a.geo_point, c.geo_poly)
							LEFT JOIN usa_states s ON st_within(a.geo_point, s.geo_poly)
							ORDER BY a.id;""")
		
		self.areaLookup = cur.fetchall()	

		self.cur.execute("""SELECT a.id as areaId, a.name as areaName, c.id as cragId, c.name as cragName 
							FROM area a 
							INNER JOIN crag c ON a.id = c.area;""")

		# global cragLookup
		self.cragLookup = cur.fetchall()	
		
		self.cur.execute("SELECT id, area, crag, locationstr FROM route;")		
		
		# global routeLookup
		self.routeLookup = cur.fetchall()
		
		#self.conn.close()


	def __del__(self):
		self.conn.close()
		

	def updateRoutes(self, changedAreaId, areaType):
		
		for rt in self.routeLookup:
			routeId = rt[0]
			assignedAreaId = rt[1]
			assignedCragId = rt[2]
			locationStrArr = rt[3].lstrip("[").rstrip("]").split(',')
			formattedLocArr = []
			
			for l in locationStrArr:
				formattedLocArr.append(l.strip().lstrip("u'").rstrip("'").lstrip('u"').rstrip('"'))
			
			if areaType == "AREA":
				matchedAreaId = self.getAreaMatchId(formattedLocArr)

				if str(assignedAreaId) == str(changedAreaId):
					query = "UPDATE route SET area = -1 WHERE routeid = '"+ str(routeId) +"';"
					self.cur.execute(query)
					self.conn.commit()	
				if matchedAreaId >= 0 and str(matchedAreaId) != str(assignedAreaId):
					query = "UPDATE route SET area = " + str(matchedAreaId) + " WHERE routeid = '"+ str(routeId) +"';"
					self.cur.execute(query)
					self.conn.commit()	
			elif areaType == "CRAG":
				matchedCragId = self.getCragMatchId(formattedLocArr)

				if str(assignedCragId) == str(changedAreaId):
					query = "UPDATE route SET crag = -1 WHERE routeid = '"+ str(routeId) +"';"
					self.cur.execute(query)
					self.conn.commit()	
				if matchedCragId >= 0 and str(matchedCragId) != str(assignedAreaId):
					query = "UPDATE route SET crag = " + str(matchedCragId) + " WHERE routeid = '"+ str(routeId) +"';"
					self.cur.execute(query)
					self.conn.commit()	

		# conn.close()		
	
	
	def getAreaMatchId(self, locationArr):
		
		containingGeog = self.getContainingGeographyForArea(locationArr)
		
		print "Containing Geog: ", containingGeog
		
		## iterate from smallest geography to biggest	
		for loc in reversed(locationArr):		
			thisLoc = loc.lower().lstrip("*").replace(" ", "")
			
			for a in areaLookup:
				aId = a[0]
				aName = a[1].lower().lstrip("*").replace(" ", "")
				country = a[2].lower().replace(" ", "")
				if a[3] is not None:
					region = a[3].lower().replace(" ", "") #state for USA
				else:
					region = ""
				
				# Trying to only match areas within more specific containing geographies (like USA states)
				# This is to account for non-unique area name matching. We are hoping that there would only
				# be 1 area with a specific name in a single containing geography (i.e. state)
				if aName == thisLoc:
					if region == containingGeog:
						print "match"
						return aId
					elif country == containingGeog:
						print "match"
						return aId
		
		# no match found
		return -1
	
		
	def getContainingGeographyForArea(self, locationArr):
		## iterate from smallest geography to biggest	
		for loc in reversed(locationArr):		
			thisLoc = loc.lower().lstrip("*").replace(" ", "")
			for a in areaLookup:
				aId = a[0]
				aName = a[1].lower().lstrip("*").replace(" ", "")
				
				if a[2] is not None:
					country = a[2].lower().replace(" ", "")
				else:
					country = ""
				
				if a[3] is not None:
					region = a[3].lower().replace(" ", "") #state for USA
				else:
					region = ""
				
				if region == thisLoc:
					return region
				elif country == thisLoc:
					return country
		
		# no match found
		print "NO Match: ", locationArr
		return -1
		
		
	# currently only matching crags with known areas (check sql query for cragLookup)
	def getCragMatchId(self, locationArr):
		for loc in locationArr:	
			for a in self.cragLookup:
				cId = a[2]
				cName = a[3]
				
				if cName.lower().lstrip("*").replace(" ", "") == loc.lower().lstrip("*").replace(" ", ""):
					return cId
		
		#no match found
		return -1
	

	def existingRouteLocationExists(self, inRouteId):
		for route in self.routeLookup:
			if str(route[0]) == str(inRouteId):
				if route[1] >= 0:
					return True
				
		return False
	

	def routeExists(self, inRouteId):
		for route in self.routeLookup:
			if str(route[0]) == str(inRouteId):
				return True
				
		return False		


if __name__ == '__main__':
	
	changedAreaId = sys.argv[1] 
	areaType = sys.argv[2]

	dbHost = os.getenv('OPENSHIFT_POSTGRESQL_DB_HOST', 'localhost')
	dbPort = os.getenv('OPENSHIFT_POSTGRESQL_DB_PORT', 5432)
	dbUser = os.getenv('OPENSHIFT_POSTGRESQL_DB_USERNAME', "app_user")
	dbPass = os.getenv('OPENSHIFT_POSTGRESQL_DB_PASSWORD', "reader")
	dbName = os.getenv('OPENSHIFT_APP_NAME', 'climbmapper')
	
	dbConnectParams = { 'dbHost':dbHost, 'dbPort':dbPort, 'dbUser':dbUser, 'dbPass':dbPass, 'dbName':dbName }

	# Initialize MPData
	MPData = MPData_Routes(dbConnectParams)
	
	MPData.updateRoutes(dbConnectParams, changedAreaId, areaType)
	
	print("DONE")
	sys.stdout.flush()
