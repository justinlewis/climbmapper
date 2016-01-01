import json, requests, psycopg2, collections, sys, os

class MPData:
	
	def init(self, dbConnectParams):
		
		dbHost = dbConnectParams['dbHost']
		dbPort = dbConnectParams['dbPort']
		dbUser = dbConnectParams['dbUser']
		dbPass = dbConnectParams['dbPass']
		dbName = dbConnectParams['dbName']

		#DB connection properties
		conn = psycopg2.connect(database = dbName, host= dbHost, port= dbPort, user = dbUser,password= dbPass)
		cur = conn.cursor()  ## open a cursor
		
		
		#cur.execute("SELECT a.id as areaId, a.name as areaName FROM area a;")	
		cur.execute("""SELECT a.id as areaId, a.name as areaName, c.name AS country, s.name AS state FROM area a
		INNER JOIN countries c ON st_within(a.geo_point, c.geo_poly)
		LEFT JOIN usa_states s ON st_within(a.geo_point, s.geo_poly)
		ORDER BY a.id;""")
		global areaLookup
		areaLookup = cur.fetchall()	
		
		cur.execute("SELECT id, area, crag, locationstr FROM route;")		
		global routeLookup
		routeLookup = cur.fetchall()
		
		conn.close()

		
	def updateRoutes(self, dbConnectParams, changedAreaId):
		dbHost = dbConnectParams['dbHost']
		dbPort = dbConnectParams['dbPort']
		dbUser = dbConnectParams['dbUser']
		dbPass = dbConnectParams['dbPass']
		dbName = dbConnectParams['dbName']

		#DB connection properties
		conn = psycopg2.connect(database = dbName, host= dbHost, port= dbPort, user = dbUser,password= dbPass)
		cur = conn.cursor()  ## open a cursor
		
		for rt in routeLookup:
			routeId = rt[0]
			assignedAreaId = rt[1]
			assignedCragId = rt[2]
			locationStrArr = rt[3].lstrip("[").rstrip("]").split(',')
			formattedLocArr = []
			
			for l in locationStrArr:
				formattedLocArr.append(l.strip().lstrip("u'").rstrip("'").lstrip('u"').rstrip('"'))
			
			matchedAreaId = self.getAreaMatchId(formattedLocArr)

			if str(assignedAreaId) == str(changedAreaId):
				query = "UPDATE route SET area = -1 WHERE routeid = '"+ str(routeId) +"';"
				cur.execute(query)
				conn.commit()	
			if matchedAreaId >= 0 and str(matchedAreaId) != str(assignedAreaId):
				query = "UPDATE route SET area = " + str(matchedAreaId) + " WHERE routeid = '"+ str(routeId) +"';"
				cur.execute(query)
				conn.commit()	

		conn.close()		
	
	
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
			for a in cragLookup:
				cId = a[2]
				cName = a[3]
				
				if cName.lower().lstrip("*").replace(" ", "") == loc.lower().lstrip("*").replace(" ", ""):
					return cId
		
		#no match found
		return -1
	
	def existingRouteLocationExists(self, inRouteId):
		for route in routeLookup:
			if str(route[0]) == str(inRouteId):
				if route[1] >= 0:
					return True
				
		return False
		
	def routeExists(self, inRouteId):
		for route in routeLookup:
			if str(route[0]) == str(inRouteId):
				return True
				
		return False		


if __name__ == '__main__':
	
	changedAreaId = sys.argv[1] 

	dbHost = os.getenv('OPENSHIFT_POSTGRESQL_DB_HOST', 'localhost')
	dbPort = os.getenv('OPENSHIFT_POSTGRESQL_DB_PORT', 5432)
	dbUser = os.getenv('OPENSHIFT_POSTGRESQL_DB_USERNAME', "app_user")
	dbPass = os.getenv('OPENSHIFT_POSTGRESQL_DB_PASSWORD', "reader")
	dbName = os.getenv('OPENSHIFT_APP_NAME', 'climbmapper')
	
	dbConnectParams = { 'dbHost':dbHost, 'dbPort':dbPort, 'dbUser':dbUser, 'dbPass':dbPass, 'dbName':dbName }

	
	MPData = MPData()
	MPData.init(dbConnectParams)
	MPData.updateRoutes(dbConnectParams, changedAreaId)
	
	print("DONE")
	sys.stdout.flush()
