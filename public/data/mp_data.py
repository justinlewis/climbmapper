import json, requests, psycopg2, collections

class MPData:
	
	def init(self):
		print "init"
		#DB connection properties
		conn = psycopg2.connect(dbname = 'climbmapper', host= 'localhost', port= 5432, user = 'postgres',password= 'SUPERSECRET')
		cur = conn.cursor()  ## open a cursor
		
		cur.execute("TRUNCATE route;")
		cur.execute("TRUNCATE tick;")
		cur.execute("TRUNCATE todo;")
		conn.commit()
		conn.close()	
		print "cleaned db"
		
	def getToDos(self):
		#DB connection properties
		conn = psycopg2.connect(dbname = 'climbmapper', host= 'localhost', port= 5432, user = 'postgres',password= 'SUPERSECRET')
		cur = conn.cursor()  ## open a cursor
		
		urlRoot = "http://www.mountainproject.com/data?action=getToDos"
		urlPropId = "&userId=106251374"
		urlPropStartPos = "&startPos="
		urlPropStartPosList = [0, 200, 400]
		mpKey = "&key=106251374-a0e6d43518505bec412a547956f25216"
		toDoList = []
		
		
		toDoCt = 1
		for pos in urlPropStartPosList:
			url = urlRoot + urlPropId + urlPropStartPos + str(pos) + mpKey
			resp = requests.get(url=url)
			toDos = json.loads(resp.text)								
			
			for toDoId in toDos["toDos"]:
				toDoList.append(toDoId)
				query = cur.mogrify("INSERT INTO todo(id,routeid,climberid) VALUES (%s, %s, %s)", (str(toDoId), str(toDoId), str(1)))
						
				cur.execute(query)
				conn.commit()
				
				toDoCt += 1
		
		conn.close()
		return toDoList
	
	
	def getTicks(self):
		
		#DB connection properties
		conn = psycopg2.connect(dbname = 'climbmapper', host= 'localhost', port= 5432, user = 'postgres',password= 'SUPERSECRET')
		cur = conn.cursor()  ## open a cursor
		
		root = "http://www.mountainproject.com/data?action=getTicks"
		uid = "&userId=106251374"
		key = "&key=106251374-a0e6d43518505bec412a547956f25216"
		
		
		# the api returns a max of 200 ticks in a request so we have to do this in chunks
		reqChunks = 0
		ticks = {}
		ticksArr = []
		while reqChunks < 600:
			reqStartPos = "&startPos=" + str(reqChunks)
			url = root + uid + key + reqStartPos

			resp = requests.get(url=url)
			ticksResp = json.loads(resp.text)
			
			if reqChunks == 0:
				hardestTick = ticksResp["hardest"]
				print hardestTick
			
			# {"date": "2015-10-16", "notes": "pretty ok", "routeId": 106360348}
			for tick in ticksResp["ticks"]:
				ticksArr.append(tick["routeId"])
				query = cur.mogrify("INSERT INTO tick(id,routeid,climberid,notes,date) VALUES (%s, %s, %s, %s, %s)", (str(tick["routeId"]), str(tick["routeId"]), str(1), tick["notes"], str(tick["date"])))
						
				cur.execute(query)
				conn.commit()

			reqChunks = reqChunks + 200
			
		conn.close()	
		return ticksArr
		
	# @contentType can be 'todo' or 'tick'	
	def getRoutes(self, idsList, contentType):
		
		#DB connection properties
		conn = psycopg2.connect(dbname = 'climbmapper', host= 'localhost', port= 5432, user = 'postgres',password= 'SUPERSECRET')
		cur = conn.cursor()  ## open a cursor
		
		root = "http://www.mountainproject.com/data?action=getRoutes&routeIds="
		ids = ''
	 	key = "&key=106251374-a0e6d43518505bec412a547956f25216"

		if(contentType == 'todo'):
			open('toDoRoutes.json', 'w').close()	
		elif(contentType == 'tick'):
			open('ticks.json', 'w').close()	
		
		
		cur.execute("SELECT id, usa, hueco FROM grade;")
		gradesLookup = cur.fetchall()	
		
		cur.execute("SELECT id, type FROM route_type;")	
		typeLookup = cur.fetchall()	
		
		cur.execute("SELECT id, name FROM area;")	
		areaLookup = cur.fetchall()	
		
		cur.execute("SELECT id FROM route;")	
		routeLookup = cur.fetchall()	
		
		idCt = 1
		rows = []
		idTracking = []
	 	for id in idsList:
			ids += str(id)
			ids += ","
	
			if idCt % 100 == 0 or idCt == len(idsList):		
				ids = ids.rstrip(",")	
				url = root + ids + key			
					
				if idCt == 100:
					resp = requests.get(url=url)
					routes = json.loads(resp.text)
				else:
					resp = requests.get(url=url)
					for rt in json.loads(resp.text)["routes"]:
						
						# check if the route already exists
						routeExists = False
						for routeId in routeLookup:
							if str(routeId[0]) == str(rt["id"]):
								routeExists = True
								print routeId, " exists"
								break
								
						if rt["id"] in idTracking:
							routeExists = True

						if routeExists is False:
							routes["routes"].append(rt)	
							area = ','.join(rt["location"])
							rating = str(rt["rating"]).lower().replace("r", "")
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
							
							grade = 999 # TODO better trapping of non-matches than just setting 999
							for row in gradesLookup:
								gradeId = row[0]
								ydsGrade = row[1]
								
								if row[2] is None:
									boulderGrade = ""
								else:
									boulderGrade = row[2].lower()
									boulderGrade = boulderGrade.replace("+", "")
									boulderGrade = boulderGrade.replace("-", "")
									boulderGrade = boulderGrade.strip()
				
								if rating in ydsGrade.lower():
									grade = gradeId
									break
								elif rating in boulderGrade:
									grade = gradeId
									break
									
							if grade == 999:
								print "Missing grade -> ", rating
							
							type = 999		# TODO better trapping of non-matches than just setting 999
							for tRow in typeLookup:
								typeId = tRow[0]
								typeName = tRow[1]
								if typeName.lower() in rt["type"].lower():
									type = typeId
									break
							
							thisLoc = rt["location"]
							thisLocId = 999  # TODO better trapping of non-matches than just setting 999
							for loc in reversed(thisLoc):
								#print loc, " the loc"
									
								for a in areaLookup:
									aId = a[0]
									aName = a[1]
		
									if aName.lower().lstrip("*").replace(" ", "") == loc.lower().lstrip("*").replace(" ", ""):
										thisLocId = aId
										break
							
							pitches = 999
							if len(str(rt["pitches"])) > 0:
								pitches = rt["pitches"]
							#print rt["name"]
							if thisLocId == 999:
								print thisLoc	
							#print rt["rating"], " - ", grade, rt["type"], " - ", type
							query = cur.mogrify("INSERT INTO route(id,routeid,name,area,type,grade,mpurl,mpimgmedurl,mpimgsmallurl,mpstars,mpstarvotes,pitches) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (str(rt["id"]), str(rt["id"]), rt["name"], str(thisLocId), str(type), str(grade), str(rt["url"]), str(rt["imgMed"]), str(rt["imgSmall"]), str(rt["stars"]), str(rt["starVotes"]), str(pitches)))
							
							cur.execute(query)
							conn.commit()
							
							idTracking.append(rt["id"])
							
							# TODO: add additional info to db table		
							#{u'rating': u'V2', u'name': u'Super Slab', u'url': u'http://www.mountainproject.com/v/super-slab/106042278', 
							#u'imgMed': u'http://www.mountainproject.com/images/24/49/106042449_medium_7fd478.jpg',
							#u'pitches': u'', u'starVotes': u'6', u'imgSmall': u'http://www.mountainproject.com/images/24/49/106042449_small_7fd478.jpg', 
							#u'location': [u'Colorado', u'Morrison/Evergreen', u'Morrison Boulders', u'The Dark Side'], u'stars': u'3.8', 
							#u'type': u'Boulder', u'id': u'106042278'}
	
				ids = ''
			idCt += 1	
		conn.close()		
	
		# Write to file
		if(contentType == 'todo'):
			with open('toDoRoutes.json', 'w') as toDoRoutesFile:
				json.dump(routes, toDoRoutesFile)
		elif(contentType == 'tick'):	
			with open('ticks.json', 'w') as ticksFile:
				json.dump(routes, ticksFile)
		
		#self.printRoutesInfo(routes)


	def printRoutesInfo(self, routesJSON):
		routeCt = 1
		print routesJSON["routes"]
		for route in routesJSON["routes"]:
			print "Route # " , routeCt
			print 
			print route["id"]
			print route["name"]
			print route["type"]
			print route["rating"]
			print route["stars"]
			print route["starVotes"]
			print route["pitches"]
			print route["location"]
			locationList = route["location"]
			print locationList[0]  # Root - State
			
			locationCt = 1
			locationListLen = len(locationList)
			for locationStep in locationList:	
				if locationCt == 1:
					print "Root = " + locationStep
				elif locationCt > 1 and locationCt < locationListLen:
					print "Area / Sub Area " + str(locationCt) + " = " + locationStep
				elif locationCt == locationListLen:
					print "Crag = " + locationStep	
					
				locationCt += 1
			print route["url"]
			
			routeCt += 1
		print "Route Count = " + str(routeCt)

if __name__ == '__main__':
	
	MPData = MPData()
	MPData.init()
	toDoIdList = MPData.getToDos()
	MPData.getRoutes(toDoIdList, 'todo')
	
	tickIdList = MPData.getTicks()
	MPData.getRoutes(tickIdList, 'tick')
