import json, requests, psycopg2, collections, sys, os

#TODO 	- break MPData into parent class for ToDo and Ticklist class
#			* This would allow us to customize diffirent climbing app data
#		- use try/except for data requests
class MPData_ToDo:

	def __init__(self, appuserid, dbConnectParams):

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

		self.cur.execute("DELETE FROM tick WHERE climberid = '"+str(appuserid)+"';")
		self.cur.execute("DELETE FROM todo WHERE climberid = '"+str(appuserid)+"';")
		self.conn.commit()
		print "Cleaned db of Todos and Ticks"

		# Querying App User info
		self.cur.execute("""SELECT routeid
							FROM tick
							WHERE climberid = '"""+str(appuserid)+"""';""")

		# global existingUserTicks
		self.existingUserTicks = self.cur.fetchall()

		self.cur.execute("""SELECT routeid
							FROM todo
							WHERE climberid = '"""+str(appuserid)+"""';""")

		# global existingUserTodos
		self.existingUserTodos = self.cur.fetchall()

		self.cur.execute("""SELECT id, usa, hueco
							FROM grade;""")

		# global gradesLookup
		self.gradesLookup = self.cur.fetchall()

		self.cur.execute("""SELECT id, type
							FROM route_type;""")

		# global typeLookup
		self.typeLookup = self.cur.fetchall()

		self.cur.execute("""SELECT a.id as areaId, a.name as areaName, c.id as cragId, c.name as cragName
							FROM area a
							INNER JOIN crag c ON a.id = c.area;""")

		# global cragLookup
		self.cragLookup = self.cur.fetchall()

		#cur.execute("SELECT a.id as areaId, a.name as areaName FROM area a;")
		self.cur.execute("""SELECT a.id as areaId, a.name as areaName, c.name AS country, s.name AS state FROM area a
							INNER JOIN countries c ON st_within(a.geo_point, c.geo_poly)
							LEFT JOIN usa_states s ON st_within(a.geo_point, s.geo_poly)
							ORDER BY a.id;""")

		# global areaLookup
		self.areaLookup = self.cur.fetchall()

		self.cur.execute("SELECT id, area FROM route;")

		# global routeLookup
		self.routeLookup = self.cur.fetchall()


	def __del__(self):
		self.conn.close()


	def getToDos(self, mpUserKey, mpUserEmail, appUserId):

		urlRoot = "http://www.mountainproject.com/data?action=getToDos"
		urlPropId = "&email=" + mpUserEmail
		urlPropStartPos = "&startPos="
		urlPropStartPosList = [0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000]
		mpKey = "&key=" + mpUserKey
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
						query = self.cur.mogrify("INSERT INTO todo(id,routeid,climberid) VALUES (%s, %s, %s)", (str(toDoId), str(toDoId), str(appUserId)))

						self.cur.execute(query)
						self.conn.commit()
			else:
				print "BAD REQUEST"

		print len(toDoList), " ToDos"
		return toDoList


	def getTicks(self, mpUserKey, mpUserEmail, appUserId):

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

						##
						## This is really dumb. MP has bad dates in their system so I have to set a invalid one to something.
						## Postgres does not like '0000-00-00'
						##
						if str(tick["date"]) == '0000-00-00':
							thisDate = '2016-01-01'
						else:
							thisDate = str(tick["date"])

						query = self.cur.mogrify("INSERT INTO tick(id,routeid,climberid,notes,date) VALUES (%s, %s, %s, %s, %s)", (str(tick["routeId"]), str(tick["routeId"]), str(appUserId), tick["notes"], thisDate))

						self.cur.execute(query)
						self.conn.commit()

				reqChunks = reqChunks + 200
			else:
				print "BAD REQUEST"

		print len(ticksArr), " Ticks"
		return ticksArr


	# @contentType can be 'todo' or 'tick'
	def getRoutes(self, idsList, contentType, mpUserKey, idTracking):

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

					# Check if the route exists in the db
					routeExists = self.routeExists(rt["id"])

					# Check if this is a duplicate route
					# Could be caused by duplicate Ticks
					# We want to avoid adding duplicate routes to the DB
					if rt["id"] in idTracking:
						routeExists = True

					if routeExists is True:
						## if self.existingRouteLocationExists(rt["id"]) is False:
						# Locations from MP are arrays of location names
						# will search from crag to area (more discrete location to less discrete)
						thisLocArr = rt["location"]
						thisAreaId = self.getAreaMatchId(thisLocArr)

						if thisAreaId >= 0:
							query = self.cur.mogrify("UPDATE route SET area = %s, name = %s, type = %s, grade = %s, mpurl = %s, mpimgsmallurl = %s, mpimgmedurl = %s, mpstars = %s, mpstarvotes = %s, pitches = %s, locationstr = %s WHERE routeid = '"+ str(rt["id"]) +"';", ( str(thisAreaId), rt["name"], str(routeType), str(grade), str(rt["url"]), str(rt["imgSmall"]), str(rt["imgMed"]), str(rt["stars"]), str(rt["starVotes"]), str(pitches), str(rt["location"]) ))

							self.cur.execute(query)
							self.conn.commit()
					else:
						area = ','.join(rt["location"])

						#TODO: Determine if we can delete this commented code
						# # Locations from MP are arrays of location names
						# # will search from crag to area (more discrete location to less discrete)
						# thisLocArr = rt["location"]
						# thisAreaId = self.getAreaMatchId(thisLocArr)
						# thisCragId = self.getCragMatchId(thisLocArr)
						# rating = self.getCleanRating(str(rt["rating"]))
						# routeType = self.getRouteType(rt["type"])

						# # Get the grade
						# if "boulder" in rt["type"].lower():
						# 	grade = self.getBoulderGrade(rating)
						# else:
						# 	grade = self.getYDSGrade(rating)

						# if len(str(rt["pitches"])) > 0:
						# 	pitches = rt["pitches"]
						# else:
						# 	pitches = 0 # a better default than n/a

						query = self.cur.mogrify("INSERT INTO route(id,routeid,name,area,type,grade,mpurl,mpimgmedurl,mpimgsmallurl,mpstars,mpstarvotes,pitches,crag,locationstr) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (str(rt["id"]), str(rt["id"]), rt["name"], str(thisAreaId), str(routeType), str(grade), str(rt["url"]), str(rt["imgMed"]), str(rt["imgSmall"]), str(rt["stars"]), str(rt["starVotes"]), str(pitches), str(thisCragId), str(rt["location"]) ))

						self.cur.execute(query)
						self.conn.commit()

						# tracking to prevent duplicates which can occur with Ticks
						idTracking.append(rt["id"])


				ids = ''
			idCt += 1

		print len(idTracking), " imported routes"
		return idTracking


	def getAreaMatchId(self, locationArr):

		containingGeog = self.getContainingGeographyForArea(locationArr)

		#print "Containing Geog: ", containingGeog

		## iterate from smallest geography to biggest
		for loc in reversed(locationArr):
			thisLoc = loc.lower().lstrip("*").replace(" ", "")

			for a in self.areaLookup:
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
			for a in self.areaLookup:
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


	def todoExists(self, inRouteId):
		for routeId in self.existingUserTodos:
			if str(routeId[0]) == str(inRouteId):
				return True

		return False


	def tickExists(self, inRouteId):
		for routeId in self.existingUserTicks:
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
			return "Boulder"
		elif "alpine" in type.lower():
			return "Alpine"
		elif "trad" in type.lower():
			# i don't care if it's "sport, trad". lets consider it trad if you use passive gear
			return "Trad"
		elif "sport" in type.lower():
			return "Sport"
		elif "tr" in type.lower():
			return "Top-Rope"

		return "n/a"


	def getRouteType(self, type):
		type = self.getCleanTypeName(type)
		for tRow in self.typeLookup:
			typeId = tRow[0]
			typeName = tRow[1]

			if typeName.lower() in type.lower():
				return typeId

		print "Can't find type = ", typeName
		return 999


	def getYDSGrade(self, inGrade):
		found = False
		for row in self.gradesLookup:
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
		for row in self.gradesLookup:
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

	mpUserKey = sys.argv[1]
	mpUserEmail = sys.argv[2]
	appUserId = sys.argv[3]

	# mpUserKey = "106251374-a0e6d43518505bec412a547956f25216"
	# mpUserEmail = "j.mapping@gmail.com"
	# appUserId = 1

	print "Getting Mountain Project Todo and Tick Routes..."

	dbHost = os.getenv('OPENSHIFT_POSTGRESQL_DB_HOST', 'localhost')
	dbPort = os.getenv('OPENSHIFT_POSTGRESQL_DB_PORT', 5432)
	dbUser = os.getenv('OPENSHIFT_POSTGRESQL_DB_USERNAME', "app_user")
	dbPass = os.getenv('OPENSHIFT_POSTGRESQL_DB_PASSWORD', "reader")
	dbName = os.getenv('OPENSHIFT_APP_NAME', 'climbmapper')

	dbConnectParams = { 'dbHost':dbHost, 'dbPort':dbPort, 'dbUser':dbUser, 'dbPass':dbPass, 'dbName':dbName }

	# Unitialize MPData
	MPData = MPData_ToDo(appUserId, dbConnectParams)

	toDoIdList = MPData.getToDos(mpUserKey, mpUserEmail, appUserId)
	idTracking = MPData.getRoutes(toDoIdList, 'todo', mpUserKey, [])

	tickIdList = MPData.getTicks(mpUserKey, mpUserEmail, appUserId)
	MPData.getRoutes(tickIdList, 'tick', mpUserKey, idTracking)

	print("DONE")
	sys.stdout.flush()
