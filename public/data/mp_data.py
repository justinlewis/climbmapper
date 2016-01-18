import json, requests, psycopg2, collections, sys, os

class MPData:
	
	def init(self, appuserid, dbConnectParams):
		
		dbHost = dbConnectParams['dbHost']
		dbPort = dbConnectParams['dbPort']
		dbUser = dbConnectParams['dbUser']
		dbPass = dbConnectParams['dbPass']
		dbName = dbConnectParams['dbName']

		#DB connection properties
		conn = psycopg2.connect(database = dbName, host= dbHost, port= dbPort, user = dbUser,password= dbPass)
		cur = conn.cursor()  ## open a cursor
		
		
		cur.execute("DELETE FROM tick WHERE climberid = '"+str(appuserid)+"';")
		cur.execute("DELETE FROM todo WHERE climberid = '"+str(appuserid)+"';")
		conn.commit()
		#conn.close()	
		print "Cleaned db of Todos and Ticks"
		
		cur.execute("SELECT routeid FROM tick WHERE climberid = "+str(appuserid)+";")
		global existingUserTicks
		existingUserTicks = cur.fetchall()
		
		cur.execute("SELECT routeid from todo WHERE climberid = "+str(appuserid)+";")
		global existingUserTodos
		existingUserTodos = cur.fetchall()
		
		cur.execute("SELECT id, usa, hueco FROM grade;")
		global gradesLookup
		gradesLookup = cur.fetchall()	
		
		cur.execute("SELECT id, type FROM route_type;")	
		global typeLookup
		typeLookup = cur.fetchall()	
		
		cur.execute("SELECT a.id as areaId, a.name as areaName, c.id as cragId, c.name as cragName FROM area a INNER JOIN crag c ON a.id = c.area;")	
		global cragLookup
		cragLookup = cur.fetchall()	
		
		#cur.execute("SELECT a.id as areaId, a.name as areaName FROM area a;")	
		cur.execute("""SELECT a.id as areaId, a.name as areaName, c.name AS country, s.name AS state FROM area a
		INNER JOIN countries c ON st_within(a.geo_point, c.geo_poly)
		LEFT JOIN usa_states s ON st_within(a.geo_point, s.geo_poly)
		ORDER BY a.id;""")
		global areaLookup
		areaLookup = cur.fetchall()	
		
		cur.execute("SELECT id, area FROM route;")	
		global routeLookup
		routeLookup = cur.fetchall()
		
		conn.close()

		
	def getToDos(self, mpUserKey, mpUserEmail, appUserId, dbConnectParams):
		dbHost = dbConnectParams['dbHost']
		dbPort = dbConnectParams['dbPort']
		dbUser = dbConnectParams['dbUser']
		dbPass = dbConnectParams['dbPass']
		dbName = dbConnectParams['dbName']

		#DB connection properties
		conn = psycopg2.connect(database = dbName, host= dbHost, port= dbPort, user = dbUser,password= dbPass)
		cur = conn.cursor()  ## open a cursor
		
		urlRoot = "http://www.mountainproject.com/data?action=getToDos"
		urlPropId = "&email="+mpUserEmail
		urlPropStartPos = "&startPos="
		urlPropStartPosList = [0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000]
		mpKey = "&key="+mpUserKey
		toDoList = []
		
						
		toDoCt = 1
		for pos in urlPropStartPosList:
			url = urlRoot + urlPropId + urlPropStartPos + str(pos) + mpKey
			resp = requests.get(url=url)
			
			if resp.status_code == 200:
				toDos = json.loads(resp.text)						
			
				for toDoId in toDos["toDos"]:
					if not self.todoExists(toDoId):
						toDoList.append(toDoId)
						query = cur.mogrify("INSERT INTO todo(id,routeid,climberid) VALUES (%s, %s, %s)", (str(toDoId), str(toDoId), str(appUserId)))
						
						cur.execute(query)
						conn.commit()	
			else:
				print "BAD REQUEST"
					
		conn.close()
		print len(toDoList), " ToDos"
		return toDoList
	
	
	def getTicks(self, mpUserKey, mpUserEmail, appUserId, dbConnectParams):
		
		dbHost = dbConnectParams['dbHost']
		dbPort = dbConnectParams['dbPort']
		dbUser = dbConnectParams['dbUser']
		dbPass = dbConnectParams['dbPass']
		dbName = dbConnectParams['dbName']

		#DB connection properties
		conn = psycopg2.connect(database = dbName, host= dbHost, port= dbPort, user = dbUser,password= dbPass)
		cur = conn.cursor()  ## open a cursor
		
		root = "http://www.mountainproject.com/data?action=getTicks"
		uid = "&email="+mpUserEmail
		key = "&key="+mpUserKey
		
		
		# the api returns a max of 200 ticks in a request so we have to do this in chunks
		reqChunks = 0
		ticks = {}
		ticksArr = []
		while reqChunks < 10000:
			reqStartPos = "&startPos=" + str(reqChunks)
			url = root + uid + key + reqStartPos

			resp = requests.get(url=url)
			
			if resp.status_code == 200:
			
				ticksResp = json.loads(resp.text)
				ticksRespStatus = ticksResp["success"]
				#print ticksRespStatus
			
				if reqChunks == 0:
					hardestTick = ticksResp["hardest"]
					#print hardestTick
			
				# {"date": "2015-10-16", "notes": "pretty ok", "routeId": 106360348}
				for tick in ticksResp["ticks"]:
					if not self.tickExists(tick["routeId"]):
						ticksArr.append(tick["routeId"])
						query = cur.mogrify("INSERT INTO tick(id,routeid,climberid,notes,date) VALUES (%s, %s, %s, %s, %s)", (str(tick["routeId"]), str(tick["routeId"]), str(appUserId), tick["notes"], str(tick["date"])))
						
						cur.execute(query)
						conn.commit()

				reqChunks = reqChunks + 200
			else:
				print "BAD REQUEST"
			
		conn.close()	
		
		print len(ticksArr), " Ticks"
		return ticksArr
		
	# @contentType can be 'todo' or 'tick'	
	def getRoutes(self, idsList, contentType, mpUserKey, dbConnectParams, idTracking):
		dbHost = dbConnectParams['dbHost']
		dbPort = dbConnectParams['dbPort']
		dbUser = dbConnectParams['dbUser']
		dbPass = dbConnectParams['dbPass']
		dbName = dbConnectParams['dbName']

		#DB connection properties
		conn = psycopg2.connect(database = dbName, host= dbHost, port= dbPort, user = dbUser,password= dbPass)
		cur = conn.cursor()  ## open a cursor
		
		root = "http://www.mountainproject.com/data?action=getRoutes&routeIds="
		ids = ''
	 	key = "&key="+mpUserKey
		
		idCt = 1
		rows = []
	 	for id in idsList:
			ids += str(id)
			ids += ","
	
			if idCt % 100 == 0 or idCt == len(idsList):		
				ids = ids.rstrip(",")	
				url = root + ids + key			
					
				resp = requests.get(url=url)
				for rt in json.loads(resp.text)["routes"]:
					
					# Check if the route exists in the db
					routeExists = self.routeExists(rt["id"])
					
					# Check if this is a duplicate route
					# Could be caused by duplicate Ticks
					# We want to avoid adding duplicate routes to the DB		
					if rt["id"] in idTracking:
						routeExists = True

					if routeExists is False:
						area = ','.join(rt["location"])
						
						# Locations from MP are arrays of location names
						# will search from crag to area (more discrete location to less discrete)
						thisLocArr = rt["location"]
						thisAreaId = self.getAreaMatchId(thisLocArr)
						thisCragId = self.getCragMatchId(thisLocArr)
						rating = self.getCleanRating(str(rt["rating"]))
						routeType = self.getRouteType(rt["type"])
						
						# Get the grade
						if "boulder" in rt["type"].lower():
							grade = self.getBoulderGrade(rating)
						else:
							grade = self.getYDSGrade(rating)							
						
						if len(str(rt["pitches"])) > 0:
							pitches = rt["pitches"]
						else:
							pitches = 0 # a better default than n/a
						
						query = cur.mogrify("INSERT INTO route(id,routeid,name,area,type,grade,mpurl,mpimgmedurl,mpimgsmallurl,mpstars,mpstarvotes,pitches,crag,locationstr) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (str(rt["id"]), str(rt["id"]), rt["name"], str(thisAreaId), str(routeType), str(grade), str(rt["url"]), str(rt["imgMed"]), str(rt["imgSmall"]), str(rt["stars"]), str(rt["starVotes"]), str(pitches), str(thisCragId), str(rt["location"]) ))

						cur.execute(query)
						conn.commit()
						
						# tracking to prevent duplicates which can occur with Ticks
						idTracking.append(rt["id"])		
										
					else:
						if self.existingRouteLocationExists(rt["id"]) is False:
							# Locations from MP are arrays of location names
							# will search from crag to area (more discrete location to less discrete)
							thisLocArr = rt["location"]
							thisAreaId = self.getAreaMatchId(thisLocArr)
						
							if thisAreaId >= 0:
								query = "UPDATE route SET area = " + str(thisAreaId) + " WHERE routeid = '"+ str(rt["id"]) +"';"
								cur.execute(query)
								conn.commit()
							
						
				ids = ''
			idCt += 1	
		conn.close()		
		
		print len(idTracking), " imported routes"
		return idTracking
	
	
	def getAreaMatchId(self, locationArr):
		
		containingGeog = self.getContainingGeographyForArea(locationArr)
		
		#print "Containing Geog: ", containingGeog
		
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
				
				# Trying to only match areas within more specific containing geographies (like USA states)
				# This is to account for non-unique area name matching. We are hoping that there would only
				# be 1 area with a specific name in a single containing geography (i.e. state)
				if aName == thisLoc:
					if region == containingGeog:
						return aId
					elif country == containingGeog:
						return aId
		
		# no match found
		print "No loc match: ", locationArr
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
		print "NO containing geog Match: ", locationArr
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
		
	def todoExists(self, inRouteId):
		for routeId in existingUserTodos:
			if str(routeId[0]) == str(inRouteId):
				return True
				
		return False
	
	def tickExists(self, inRouteId):
		for routeId in existingUserTicks:
			if str(routeId[0]) == str(inRouteId):
				return True
				
		return False
		
	
	def getCleanRating(self, rating):
		rating = rating.lower().replace("r", "")
		rating = rating.replace("pg13", "")
		rating = rating.replace("/b", "")
		rating = rating.replace("/c", "")
		rating = rating.replace("/d", "")
		rating = rating.replace("-2", "")
		rating = rating.replace("-3", "")
		rating = rating.replace("-4", "")
		rating = rating.replace("-5", "")
		rating = rating.replace("-6", "")
		rating = rating.replace("-7", "")
		rating = rating.replace("-8", "")
		rating = rating.replace("-9", "")
		rating = rating.replace("-10", "")
		rating = rating.replace("-11", "")
		rating = rating.replace("-12", "")
		rating = rating.replace("-13", "")
		rating = rating.replace("-14", "")
		rating = rating.replace("-15", "")
		rating = rating.replace("-easy", "")
		rating = rating.replace("easy snow", "")
		rating = rating.replace("?", "")
		rating = rating.replace("x", "")
		rating = rating.replace("+", "")
		rating = rating.replace("-", "")
		rating = rating.strip()
		
		return rating				
					
							
	def getCleanTypeName(self, type):
		# We are doing this if/else check because types can come in all kinds of combinations
		# I.E. "trad, bouder"
		if "boulder" in type.lower():
			# sometimes types are boulder, trad. this is non-sense. its boulder
			type = "Boulder"	
		elif "trad" in type.lower():
			# i don't care if it's "sport, trad". lets consider it trad if you use passive gear
			type = "Trad"
		elif "alpine" in type.lower():
			type = "Alpine"
		elif "sport" in type.lower():
			type = "Sport"
		elif "tr" in type.lower():
			type = "Top-Rope"
		
		return type


	def getRouteType(self, type):
		type = self.getCleanTypeName(type)		
		for tRow in typeLookup:
			typeId = tRow[0]
			typeName = tRow[1]
				
			if typeName.lower() in type.lower():
				return typeId
		
		print "Can't find type = ", typeName
		return 999


	def getYDSGrade(self, inGrade):
		found = False
		for row in gradesLookup:
			gradeId = row[0]
			ydsGrade = row[1]
			boulderGrade = row[2]

			if inGrade in ydsGrade:
				return gradeId
		
		# If we got this far there was no match for rope YDS grades. 
		# Lets check if its a boulder grade
		grade = self.getBoulderGrade(inGrade)
		
		if grade == 999:
			print "Missing YDS and boulder grade -> ", inGrade
		return grade
	
	
	def getBoulderGrade(self, inGrade):
		for row in gradesLookup:
			gradeId = row[0]
			
			if row[2] is None:
				boulderGrade = ""
			else:
				boulderGrade = row[2].lower()
				boulderGrade = boulderGrade.replace("+", "")
				boulderGrade = boulderGrade.replace("-", "")
				boulderGrade = boulderGrade.strip()

			if inGrade in boulderGrade:
				return gradeId		
		
		return 999



if __name__ == '__main__':
	
	#mpUserKey = sys.argv[1] 
	#mpUserEmail = sys.argv[2]
	#appUserId = sys.argv[3]
	
	mpUserKey = "106251374-a0e6d43518505bec412a547956f25216"
	mpUserEmail = "j.mapping@gmail.com"
	appUserId = 1
	
	print "Getting Mountain Project Todo and Tick Routes..."
	
	dbHost = os.getenv('OPENSHIFT_POSTGRESQL_DB_HOST', 'localhost')
	dbPort = os.getenv('OPENSHIFT_POSTGRESQL_DB_PORT', 5432)
	dbUser = os.getenv('OPENSHIFT_POSTGRESQL_DB_USERNAME', "app_user")
	dbPass = os.getenv('OPENSHIFT_POSTGRESQL_DB_PASSWORD', "reader")
	dbName = os.getenv('OPENSHIFT_APP_NAME', 'climbmapper')
	
	dbConnectParams = { 'dbHost':dbHost, 'dbPort':dbPort, 'dbUser':dbUser, 'dbPass':dbPass, 'dbName':dbName }

	
	MPData = MPData()
	MPData.init(appUserId, dbConnectParams)
	toDoIdList = MPData.getToDos(mpUserKey, mpUserEmail, appUserId, dbConnectParams)
	idTracking = MPData.getRoutes(toDoIdList, 'todo', mpUserKey, dbConnectParams, [])
	
	tickIdList = MPData.getTicks(mpUserKey, mpUserEmail, appUserId, dbConnectParams)
	MPData.getRoutes(tickIdList, 'tick', mpUserKey, dbConnectParams, idTracking)
	
	print("DONE")
	sys.stdout.flush()
