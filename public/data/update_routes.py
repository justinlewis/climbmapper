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
		
		
		cur.execute("SELECT a.id as areaId, a.name as areaName FROM area a;")	
		global areaLookup
		areaLookup = cur.fetchall()	
		
		cur.execute("SELECT id, area, crag, locationstr FROM route;")		
		global routeLookup
		routeLookup = cur.fetchall()
		
		conn.close()

		
	# @contentType can be 'todo' or 'tick'	
	def updateRoutes(self, dbConnectParams):
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
			
			#print formattedLocArr
			
			matchedAreaId = self.getAreaMatchId(reversed(formattedLocArr))
			
			if matchedAreaId >= 0 and str(matchedAreaId) != str(assignedAreaId):
				print "updateing ", routeId, " with: ", matchedAreaId, " - ", formattedLocArr
				query = "UPDATE route SET area = " + str(matchedAreaId) + " WHERE routeid = '"+ str(routeId) +"';"
				cur.execute(query)
				conn.commit()	

		conn.close()		
	
	
	def getAreaMatchId(self, locationArr):
		for loc in locationArr:		
			for a in areaLookup:
				aId = a[0]
				aName = a[1]
				
				if aName.lower().lstrip("*").replace(" ", "") == loc.lower().lstrip("*").replace(" ", ""):
					return aId
		
		# no match found
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
	

	dbHost = os.getenv('OPENSHIFT_POSTGRESQL_DB_HOST', 'localhost')
	dbPort = os.getenv('OPENSHIFT_POSTGRESQL_DB_PORT', 5432)
	dbUser = os.getenv('OPENSHIFT_POSTGRESQL_DB_USERNAME', "app_user")
	dbPass = os.getenv('OPENSHIFT_POSTGRESQL_DB_PASSWORD', "reader")
	dbName = os.getenv('OPENSHIFT_APP_NAME', 'climbmapper')
	
	dbConnectParams = { 'dbHost':dbHost, 'dbPort':dbPort, 'dbUser':dbUser, 'dbPass':dbPass, 'dbName':dbName }

	
	MPData = MPData()
	MPData.init(dbConnectParams)
	MPData.updateRoutes(dbConnectParams)
	
	print("DONE")
	sys.stdout.flush()
