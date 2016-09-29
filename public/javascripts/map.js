
(function(){

	$(document).ready(function () {
			//map;
			var popup;
			var orphanRouteArr = [];
			var todoAreaPts;
			var tickAreaPts;
			var todoCragPts;
			var cragPts;
			var areaPts;
			var routeTypeFilter = 'ALL'

			var isAuthenticated = $("#app-config-el").data("isauthenticated");
			var userId = $("#app-config-el").data("authenticateduserid");

	 		var outdoors = new L.tileLayer.provider('Thunderforest.Outdoors');
	 		var mqosm = new L.tileLayer.provider('MapQuestOpen');
	 		var mqaerial = new L.tileLayer.provider('MapQuestOpen.Aerial');
	 		var darkmater = new L.tileLayer.provider('CartoDB.DarkMatter');
	 		var positron = new L.tileLayer.provider('CartoDB.Positron');


	 		// Initialize
	 		this.init = function () {

	 			if(!isAuthenticated){
	 				$('#welcome-modal').modal('show');
	 			}

	 			////
	 			// Make all data requests and execute a single callback when they all finish... It's amazing
	 			////
				// 	$.when(
	 		// 		getMPToDoData(),
	 		// 		getMPTicksData(),
	 		// 		getTodoAreaPts(),
	 		// 		getTickAreaPts(),
	 		// 		getTodoCragPts(),
	 		// 		getCragPts(),
	 		// 		getAreaPts(),
	 		// 		getMissingAreas()
				// 	).done(function (toDoResponse, tickResponse, areaTodoPtResponse, areaTickPtResponse,todoCragPtResponse, cragPtResponse, areaPtResponse, missingAreasResponse) {
				// 	todoAreaPts = areaTodoPtResponse[0];
				// 	tickAreaPts = areaTickPtResponse[0];
				// 	todoCragPts = todoCragPtResponse[0];
				// 	cragPts = cragPtResponse[0];
				// 	areaPts = areaPtResponse[0];
				// 	processRoutes(tickResponse[0]["routes"], 'tick');
				// 	processRoutes(toDoResponse[0]["routes"], 'todo');
				// 	reportMissingAreas(missingAreasResponse);
				//
				// 	setSearchBar(areaPts.features);

					renderMap();
					setTimeSlider();

					resizeLocations("ALL")
	 			});

 				$("#trad-btn").click(function(e){
 					resizeLocations('TRAD');
 					changeBtnText(this, "Trad");
 					routeTypeFilter = "TRAD";
 				})
 				$("#sport-btn").click(function(e){
 					resizeLocations('SPORT');
 					changeBtnText(this, "Sport");
 					routeTypeFilter = "SPORT";
 				})
 				$("#boulder-btn").click(function(e){
 					resizeLocations('BOULDER');
 					changeBtnText(this, "Boulder");
 					routeTypeFilter = "BOULDER";
 				})
 				$("#all-btn").click(function(e){
 					resizeLocations('ALL');
 					changeBtnText(this, "All Route Types");
 					routeTypeFilter = "ALL";
 				})
 				$("#alpine-btn").click(function(e){
 					resizeLocations('ALPINE');
 					changeBtnText(this, "Alpine");
 					routeTypeFilter = "ALPINE";
 				})


 				function changeBtnText(element, newTypeLabel){
 					var btnContainer = $(element).parent().parent().parent().children()[0];
 					var oldText = $(btnContainer).text()
 					var newText = oldText.replace(oldText, newTypeLabel);
					newText = newText + '  <span class="caret"></span>';
					$(btnContainer).html(newText);
					$.parseHTML($(btnContainer))
 				}
	 		}

			// 	function setSearchBar(areas) {
	 	// 			var substringMatcher = function(strs) {
			// 		  return function findMatches(q, cb) {
			// 		    var matches, substringRegex;
			//
			// 		    // an array that will be populated with substring matches
			// 		    matches = [];
			//
			// 		    // regex used to determine if a string contains the substring `q`
			// 		    substrRegex = new RegExp(q, 'i');
			//
			// 		    // iterate through the pool of strings and for any string that
			// 		    // contains the substring `q`, add it to the `matches` array
			// 		    $.each(strs, function(i, str) {
			// 		      if (substrRegex.test(str)) {
			// 		        matches.push(str);
			// 		      }
			// 		    });
			//
			// 		    cb(matches);
			// 		  };
			// 		};
			//
			// 		var areasArr = [];
			// 		for(var i=0; i<areas.length; i++){
			// 			var areaName = areas[i].properties.area;
			// 			var geom = areas[i].geometry.coordinates;
			// 			areasArr.push(JSON.stringify({"areaName":areaName, "geom":geom}));
			// 		}
			//
			//
			// 		$('#area-search .typeahead').typeahead({
			// 		  hint: true,
			// 		  highlight: true,
			// 		  minLength: 1
			// 		},
			// 		{
			// 		  name: 'areas',
			// 		  source: substringMatcher(areasArr),
			// 		  display:function(area) {
			// 				return JSON.parse(area).areaName;
			// 		  },
			// 		}).bind('typeahead:select', function(e, suggestion) {
  		// 				var sugObj = JSON.parse(suggestion);
  		// 				map.setView(L.latLng(sugObj.geom[1],sugObj.geom[0]), 14);
			// 		});
			// 	}

			// 	function setTimeSlider() {
	 	// 		var allTickArr = [];
	 	// 		for(var n=0; n<tickAreaPts.features.length; n++){
			// 		var tickArr = tickAreaPts.features[n].properties.customTicksArr;
			//
			// 		if(tickArr){
			// 			for(var d=0; d<tickArr.length; d++){
			// 				allTickArr.push(new Date(tickArr[d].date));
			// 			}
			// 		}
			// 	}
			//
			// 	var sortDatesAscending = function (date1, date2) {
			// 	  // This is a comparison function that will result in dates being sorted in
			// 	  // ASCENDING order.
			// 	  if (date1 > date2) return 1;
			// 	  if (date1 < date2) return -1;
			// 	  return 0;
			// 	};
			//
			// 	var sortedAllTickArr = allTickArr.sort(sortDatesAscending);
			//
			// 	$("#tick-slider").slider({
			//       range: "min",
			//       value: allTickArr.length,
			//       min: 1,
			//       max: allTickArr.length-1,
			//       create: function( event, ui ) {
			//       		// A silly hack because the slider is appending a ghostly empty <p> element to my label. No time to look deeper now.
			//       		if($("#time-slider-label").next("p").text().trim().length === 0){
			// 	     			$("#time-slider-label").next("p").remove();
			// 	     		}
			//       },
			//       slide: function( event, ui ) {
			//       	var sliderPos = ui.value;
			//       	var selectedDate = sortedAllTickArr[sliderPos];
			//
			//       	if($("#tick-time-chart")){
      // 					$("#tick-time-chart").remove()
      // 				}
			//
      // 				if(selectedDate){
			//
			// 	      	if(!$("#chart-row-1").is(':visible')){
			// 				$("#chart-row-1").show();
			// 			}
			//
			// 		   	$("#chart-row-1").append('<div id="tick-time-chart" ></div>');
			// 		   	var lineChart = new LineChart(tickAreaPts.features, selectedDate, "#tick-time-chart", $("#tick-time-chart").parent().width());
			// 		   	lineChart.build();
			//
			//      		var tickLocs = tickAreaPts.features;
			//      		var rtsCt = 0;
			//      		for(var t=0; t<tickLocs.length; t++){
			//      			var thisLoc = tickLocs[t];
			//      			var thisLocTicks = thisLoc.properties.customTicksArr;
			//      			var laterThanTicksCt = 0;
			//
			//      			for(var i=0; i<thisLocTicks.length; i++){
			//      				if(new Date(thisLocTicks[i].date) > selectedDate){
			//      					laterThanTicksCt = laterThanTicksCt + 1;
			//      				}
			//      				else{
			//      					rtsCt = rtsCt + 1;
			//      				}
			//      			}
			//
			//      			var newRadius = getLocationSizeBucket(thisLocTicks.length - laterThanTicksCt);
			//
			//      			map.eachLayer(function (layer) {
			//      				if(layer.feature && layer.feature.properties.customTicksCt){
			// 					    var mapLayerId = layer.feature.properties.id;
			// 					    if(thisLoc.properties.id === mapLayerId){
			// 					    	 layer.setRadius(newRadius);
			// 					    }
			// 					 }
			// 				});
			//      		}
			//
			//      		if( ! $("#time-slider-label").is(":visible")){
			//      			$("#time-slider-label").show();
			//      		}
			//      		$("#time-slider-label").text( selectedDate.getMonth() + " / " + selectedDate.getDay() + " / " + selectedDate.getFullYear()  + " | " + rtsCt + " Ticks");
			//      	}
			//       },
			//       stop: function( event, ui ) {
			//       	setTimeout(function(){
			//       		$("#time-slider-label").fadeOut(400);
			//       		if($("#tick-time-chart:visible").length > 0){
			//       			$("#chart-row-1").fadeOut(400);
			//       			$("#time-time-chart").remove();
			//       		}
			//       	}, 30000);
			//
			//       }
			//    });
			// 	}

	 		////
			// 	// Area points are the climbing area locations
			// 	////
			// 	function getTodoAreaPts() {
	 	// 		return $.ajax({
	  	// 			url: "todoareas",
	  	// 			context: document.body,
	  	// 			type: "GET",
	  	// 			crossDomain: false,
	  	// 			dataType: "json"
			// 	})
			// 	}
			//
			//
			// 	////
			// 	// Crag points are the climbing area locations
			// 	////
			// 	function getTodoCragPts() {
	 	// 		return $.ajax({
	  	// 			url: "todocrags",
	  	// 			context: document.body,
	  	// 			type: "GET",
	  	// 			crossDomain: false,
	  	// 			dataType: "json"
			// 	})
			// 	}
			//
			//
			// 	////
			// 	// Area points are the climbing area locations
			// 	////
			// 	function getTickAreaPts() {
	 	// 		return $.ajax({
	  	// 			url: "tickareas",
	  	// 			context: document.body,
	  	// 			type: "GET",
	  	// 			crossDomain: false,
	  	// 			dataType: "json"
			// 	})
			// 	}
			//
			// 	////
			// 	// Crag points are the climbing sub-area locations
			// 	////
			// 	function getCragPts() {
	 	// 		return $.ajax({
	  	// 			url: "crags",
	  	// 			context: document.body,
	  	// 			type: "GET",
	  	// 			crossDomain: false,
	  	// 			dataType: "json"
			// 	})
			// 	}
			//
			// 	////
			// 	// Area points are the climbing area locations
			// 	////
			// 	function getAreaPts() {
	 	// 		return $.ajax({
	  	// 			url: "areas",
	  	// 			context: document.body,
	  	// 			type: "GET",
	  	// 			crossDomain: false,
	  	// 			dataType: "json"
			// 	})
			// }
			//
			// 	////
			// 	// Ticks include routes that have been done
			// 	////
			// 	function getMPTicksData() {
	 	// 		return $.ajax({
	  	// 			url: "ticks",
	  	// 			context: document.body,
	  	// 			type: "GET",
	  	// 			crossDomain: false,
	  	// 			dataType: "json"
			// 	})
			// }
			//
			// 	////
			// 	// ToDos include routes that are yet to be done
			// 	////
			// 	function getMPToDoData() {
	 	// 		var that = this;
	 	// 		return $.ajax({
	  	// 			url: "todos",
	  	// 			context: document.body,
	  	// 			type: "GET",
	  	// 			crossDomain: false,
	  	// 			dataType: "json"
			// 	})
			// }
			//
			// function getMissingAreas() {
			// 	return $.ajax({
	  	// 			url: "missingareas",
	  	// 			context: document.body,
	  	// 			type: "GET",
	  	// 			crossDomain: false,
	  	// 			dataType: "json"
			// 	})
			// }

			// ////
			// // Process route data
			// // content type can be 'todo' or 'tick'
			// ////
			// function processRoutes(routesArr, contentType) {
			// 		for(var rtI=0; rtI<routesArr.length; rtI++){
			// 			var route = routesArr[rtI];

			// 			if(contentType === 'todo'){
			// 				route.routeCategory = "TODO";
			// 				setToDoLocationRouteAttributes(route);
			// 				setCragLocationRouteAttributes(route);
			// 			}
			// 			else if(contentType === 'tick'){
			// 				route.routeCategory = "TICK";
			// 				setTickLocationRouteAttributes(route);
			// 			}
			// 		}

			// 		setToDoLocationRouteFrequency();
			// 		setCragLocationRouteFrequency();
			// 		setTickLocationRouteFrequency();
			// }


			function reportMissingAreas(data) {
				var areas = data[0].missingAreas;

				var convertLocationArrToString = function(locationArr){
					var formatted = "";

					locationArr = locationArr.split(", u'").join(", '"); // remove unicode type characters
					locationArr = locationArr.split(', u"').join(', "'); // remove unicode type characters
					locationArr = eval(locationArr);
					for(var i=0; i<locationArr.length; i++){
						var loc = locationArr[i];
						formatted += loc + "/"
					}
					formatted.substring(0, formatted.lastIndexOf("/")) + '';

					return formatted;
				}

				if(areas.length === 0){
					$("#issues-content-msg").append("<h5 class='info-content'><b>There are no known issues.</b></h5>");
				}
				else{
					$("#issue-content-container").show();

					for(var i=0; i<areas.length; i++){
						var area = areas[i];
						$("#issues-content").append("<tr> <td>"+ area.name +"</td> <td>Missing climbing area: "+ convertLocationArrToString(area.locationstr) +"</td> <td>Add the missing climbing area using the tools on the right side of the map.</td> <td><a class='error-link' href="+ area.mpurl+" target='_blank'>See it on Mountain Project!</a> </td></tr>");
					}
				}
			}

			// ////
			// // Set the frequency of ticks on locations that will dictate the point size.
			// //
			// ////
			// function setTickLocationRouteFrequency() {

			// 	// @tickAreaPts
			// 	for(var n=0; n<tickAreaPts.features.length; n++){
			// 		var currAreaId = tickAreaPts.features[n].properties.id;

			// 		tickAreaPts.features[n].properties.customTicksCt = 0;

			// 		tickAreaPts.features[n].properties.customTicksCt = tickAreaPts.features[n].properties.count;
			// 	}
			// }


			// ////
			// // Set the frequency of todos on locations that will dictate the point size.
			// //
			// ////
			// function setToDoLocationRouteFrequency() {

			// 	// @todoAreaPts
			// 	for(var n=0; n<todoAreaPts.features.length; n++){
			// 		var currAreaId = todoAreaPts.features[n].properties.id;

			// 		// create or reset var to ensure a clean ct
			// 		todoAreaPts.features[n].properties.customRouteCt = 0;

			// 		todoAreaPts.features[n].properties.customRouteCt = todoAreaPts.features[n].properties.count;
			// 	}
			// }


			// ////
			// // Set the frequency of crags on locations that will dictate the point size.
			// //
			// ////
			// function setCragLocationRouteFrequency() {

			// 	// @todoCragPts
			// 	for(var n=0; n<todoCragPts.features.length; n++){
			// 		var currAreaId = todoCragPts.features[n].properties.id;

			// 		// create or reset var to ensure a clean ct
			// 		todoCragPts.features[n].properties.customRouteCt = 0;

			// 		todoCragPts.features[n].properties.customRouteCt = todoCragPts.features[n].properties.count;
			// 	}
			// }


			// ////
			// // Sets custom attributes of ticks on locations.
			// //
			// // @route - a route representing either a tick or a todo
			// ////
			// function setTickLocationRouteAttributes(route) {

			// 	// @tickAreaPts
			// 	for(var n=0; n<tickAreaPts.features.length; n++){
			// 		var currAreaId = tickAreaPts.features[n].properties.id;

			// 		if(!tickAreaPts.features[n].properties.customTicksArr){
			// 			tickAreaPts.features[n].properties.customTicksArr = [];
			// 		}
			// 		if(!tickAreaPts.features[n].properties.customTradCt){
			// 			tickAreaPts.features[n].properties.customTradCt = 0;
			// 		}
			// 		if(!tickAreaPts.features[n].properties.customSportCt){
			// 			tickAreaPts.features[n].properties.customSportCt = 0;
			// 		}
			// 		if(!tickAreaPts.features[n].properties.customBoulderCt){
			// 			tickAreaPts.features[n].properties.customBoulderCt = 0;
			// 		}
			// 		if(!tickAreaPts.features[n].properties.customAlpineCt){
			// 			tickAreaPts.features[n].properties.customAlpineCt = 0;
			// 		}

			// 		if(currAreaId === route.area){
			// 			var type = String(route.type ? String(route.type) : 'n/a').trim();
			// 			if(type.toLowerCase() === "trad"){
			// 				tickAreaPts.features[n].properties.customTradCt = tickAreaPts.features[n].properties.customTradCt + 1;
			// 			}
			// 			else if(type.toLowerCase() === "sport"){
			// 				tickAreaPts.features[n].properties.customSportCt = tickAreaPts.features[n].properties.customSportCt + 1;
			// 			}
			// 			else if(type.toLowerCase() === "boulder"){
			// 				tickAreaPts.features[n].properties.customBoulderCt = tickAreaPts.features[n].properties.customBoulderCt + 1;
			// 			}
			// 			else if(type.toLowerCase() === "alpine"){
			// 				tickAreaPts.features[n].properties.customAlpineCt = tickAreaPts.features[n].properties.customAlpineCt + 1;
			// 			}
			// 		}


			// 		if(currAreaId === route.area){
			// 			tickAreaPts.features[n].properties.customTicksArr.push(route);
			// 		}
			// 	}
			// }

			////
			// Set the types (trad, sport, boulder, etc...) and the route tracking array on the location objects
			//
			////
			// function setToDoLocationRouteAttributes(route) {

			// 	// @todoAreaPts
			// 	for(var n=0; n<todoAreaPts.features.length; n++){
			// 		var currAreaId = todoAreaPts.features[n].properties.id;

			// 		if(!todoAreaPts.features[n].properties.customRouteArr){
			// 			todoAreaPts.features[n].properties.customRouteArr = [];
			// 		}
			// 		if(!todoAreaPts.features[n].properties.customTradCt){
			// 			todoAreaPts.features[n].properties.customTradCt = 0;
			// 		}
			// 		if(!todoAreaPts.features[n].properties.customSportCt){
			// 			todoAreaPts.features[n].properties.customSportCt = 0;
			// 		}
			// 		if(!todoAreaPts.features[n].properties.customBoulderCt){
			// 			todoAreaPts.features[n].properties.customBoulderCt = 0;
			// 		}
			// 		if(!todoAreaPts.features[n].properties.customAlpineCt){
			// 			todoAreaPts.features[n].properties.customAlpineCt = 0;
			// 		}

			// 		if(currAreaId === route.area){
			// 			todoAreaPts.features[n].properties.customRouteArr.push(route);

			// 			var type = String(route.type ? String(route.type) : 'n/a').trim();
			// 			if(type.toLowerCase() === "trad"){
			// 				todoAreaPts.features[n].properties.customTradCt = todoAreaPts.features[n].properties.customTradCt + 1;
			// 			}
			// 			else if(type.toLowerCase() === "sport"){
			// 				todoAreaPts.features[n].properties.customSportCt = todoAreaPts.features[n].properties.customSportCt + 1;
			// 			}
			// 			else if(type.toLowerCase() === "boulder"){
			// 				todoAreaPts.features[n].properties.customBoulderCt = todoAreaPts.features[n].properties.customBoulderCt + 1;
			// 			}
			// 			else if(type.toLowerCase() === "alpine"){
			// 				todoAreaPts.features[n].properties.customAlpineCt = todoAreaPts.features[n].properties.customAlpineCt + 1;
			// 			}
			// 		}
			// 	}
			// }


			// ////
			// // Set the types (trad, sport, boulder, etc...) and the route tracking array on the location objects
			// //
			// ////
			// function setCragLocationRouteAttributes(route) {

			// 	if(route.crag){
			// 		// @todoCragPts
			// 		for(var n=0; n<todoCragPts.features.length; n++){
			// 			var currAreaId = todoCragPts.features[n].properties.id;

			// 			if(!todoCragPts.features[n].properties.customRouteArr){
			// 				todoCragPts.features[n].properties.customRouteArr = [];
			// 			}
			// 			if(!todoCragPts.features[n].properties.customTradCt){
			// 				todoCragPts.features[n].properties.customTradCt = 0;
			// 			}
			// 			if(!todoCragPts.features[n].properties.customSportCt){
			// 				todoCragPts.features[n].properties.customSportCt = 0;
			// 			}
			// 			if(!todoCragPts.features[n].properties.customBoulderCt){
			// 				todoCragPts.features[n].properties.customBoulderCt = 0;
			// 			}
			// 			if(!todoCragPts.features[n].properties.customAlpineCt){
			// 				todoCragPts.features[n].properties.customAlpineCt = 0;
			// 			}

			// 			if(currAreaId === route.crag){
			// 				todoCragPts.features[n].properties.customRouteArr.push(route);

			// 				var type = String(route.type ? String(route.type) : 'n/a').trim();

			// 				if(type.toLowerCase() === "trad"){
			// 					todoCragPts.features[n].properties.customTradCt = todoCragPts.features[n].properties.customTradCt + 1;
			// 				}
			// 				else if(type.toLowerCase() === "sport"){
			// 					todoCragPts.features[n].properties.customSportCt = todoCragPts.features[n].properties.customSportCt + 1;
			// 				}
			// 				else if(type.toLowerCase() === "boulder"){
			// 					todoCragPts.features[n].properties.customBoulderCt = todoCragPts.features[n].properties.customBoulderCt + 1;
			// 				}
			// 				else if(type.toLowerCase() === "alpine"){
			// 					todoCragPts.features[n].properties.customAlpineCt = todoCragPts.features[n].properties.customAlpineCt + 1;
			// 				}
			// 			}
			// 		}
			// 	}
			// }


			////
			// Simple way to control the size of the location points
			//
			////
			// function getLocationSizeBucket(rtCount) {
			// 	if(rtCount < 1){
			// 		return 0
			// 	}
			// 	else if(rtCount < 3){
			// 		return 3
			// 	}
			// 	else if(rtCount >= 3 && rtCount < 5){
			// 		return 4
			// 	}
			// 	else if(rtCount >= 5 && rtCount < 7){
			// 		return 6
			// 	}
			// 	else if(rtCount >= 7 && rtCount < 10){
			// 		return 9
			// 	}
			// 	else if(rtCount >= 10 && rtCount < 20){
			// 		return 15
			// 	}
			// 	else if(rtCount >= 20 && rtCount < 30){
			// 		return 20
			// 	}
			// 	else if(rtCount >= 30 && rtCount < 40){
			// 		return 25
			// 	}
			// 	else if(rtCount >= 40 && rtCount < 50){
			// 		return 30
			// 	}
			// 	else if(rtCount >= 50 && rtCount < 60){
			// 		return 35
			// 	}
			// 	else if(rtCount >= 60 && rtCount < 70){
			// 		return 40
			// 	}
			// 	else if(rtCount >= 70 && rtCount < 100){
			// 		return 45
			// 	}
			// 	else if(rtCount >= 100 && rtCount < 150){
			// 		return 60
			// 	}
			// 	else if(rtCount >= 150){
			// 		return 80
			// 	}
			// }


			// ////
			// // Sets the size of the location points respective to the amount of climbs in that area
			// // TODO: better check for ticks vs. todos
			// //
			// // NOTE: only resizes areas that are currently added to the map.
			// //
			// // @param filter - a filter keyword that filters the radius by route type.
			// ////
			// function resizeLocations(filter) {
			// 		map.eachLayer(function(layer){
			// 			if(layer.feature){
			// 				layer.setRadius(0);
			//
			// 				if(filter.toUpperCase() === 'ALL'){
			// 					// customRouteCt is currently ToDo frequency and will take priority over existing area points
			// 					if(layer.feature.properties.customRouteCt > 0){
			// 						var routeCt = getLocationSizeBucket(layer.feature.properties.customRouteCt);
			// 						layer.setRadius(routeCt);
			// 					}
			//
			// 					if(layer.feature.properties.customTicksCt > 0){
			// 						var ticksCt = getLocationSizeBucket(layer.feature.properties.customTicksCt);
			// 						layer.setRadius(ticksCt);
			// 					}
			//
			// 				}
			// 				else if(filter.toUpperCase() === 'TRAD'){
			// 					if(layer.feature.properties.customTradCt > 0){
			// 						var routeCt = getLocationSizeBucket(layer.feature.properties.customTradCt);
			// 						layer.setRadius(routeCt);
			// 					}
			// 				}
			// 				else if(filter.toUpperCase() === 'SPORT'){
			// 					if(layer.feature.properties.customSportCt > 0){
			// 						var routeCt = getLocationSizeBucket(layer.feature.properties.customSportCt);
			// 						layer.setRadius(routeCt);
			// 					}
			// 				}
			// 				else if(filter.toUpperCase() === 'BOULDER'){
			// 					if(layer.feature.properties.customBoulderCt > 0){
			// 						var routeCt = getLocationSizeBucket(layer.feature.properties.customBoulderCt);
			// 						layer.setRadius(routeCt);
			// 					}
			// 				}
			// 				else if(filter.toUpperCase() === 'ALPINE'){
			// 					if(layer.feature.properties.customAlpineCt > 0){
			// 						var routeCt = getLocationSizeBucket(layer.feature.properties.customAlpineCt);
			// 						layer.setRadius(routeCt);
			// 					}
			// 				}
			// 			}
			//
			// 		});
			// }


			function renderMap() {

					// // properties set on each feature of a Leaflet layer object
					// function onEachTodoFeature(feature, layer) {
					// 	layer.on({
			    //         mouseover: todoHoverAction,
			    //         mouseout: resetAreaHover,
			    //         click: featureClickEvent
			    //         });
					// }

					function onEachTickFeature(feature, layer) {
						layer.on({
			            mouseover: tickHoverAction,
			            mouseout: resetAreaHover,
			            click: featureClickEvent
			            });
					}

					function onEachBasicAreaFeature(feature, layer) {
						layer.on({
			            mouseover: basicAreaHoverAction,
			            mouseout: resetBasicAreaHover,
			            click: basicLocationFeatureClickEvent
			            });
					}

					function onEachBasicCragFeature(feature, layer) {
						layer.on({
			            mouseover: basicCragHoverAction,
			            mouseout: resetBasicCragHover,
			            click: basicLocationFeatureClickEvent
			            });
					}


					function basicAreaHoverAction(e) {
						var layer = e.target;
						layer.setStyle({"fillColor":"#ff4d4d"});

						$("#left-sidebar-heading-info-container").show();
						$("#left-sidebar-heading").text(layer.feature.properties.area);
					}

					function resetBasicAreaHover(e) {
						var feature = e.target;
						feature.setStyle({"fillColor":"red"});

						$("#left-sidebar-heading-info-container").hide();
						$("#left-sidebar-heading").text("");
					}

					function basicCragHoverAction(e) {
						var layer = e.target;
						layer.setStyle({"fillColor":"#878787"});

						$("#left-sidebar-heading-info-container").show();
						$("#left-sidebar-heading").text(layer.feature.properties.area);
					}

					function resetBasicCragHover(e) {
						var feature = e.target;
						feature.setStyle({"fillColor":"orange"});

						$("#left-sidebar-heading-info-container").hide();
						$("#left-sidebar-heading").text("");
					}


					// function tickHoverAction(e) {
	      	// 			var layer = e.target;
					//
	      	// 			if($("#tick-time-chart")){
	      	// 				$("#tick-time-chart").remove()
	      	// 			}
					//
	      	// 			layer.setStyle({"fillColor":"#878787"});
					//
	      	// 			$("#left-sidebar-heading-info-container").show();
	      	// 			$("#left-sidebar-heading").text(layer.feature.properties.area);
					//
	      	// 			//////
	      	// 			/// TODO: this is really boring. Make this rout info more interesting
	      	// 			/////
	      	// 			if(layer.feature.properties.customTicksArr){
		      // 				var html = '<div class="tick-info-container">';
					// 			for(var i=0; i<layer.feature.properties.customTicksArr.length; i++){
					// 				var rt = layer.feature.properties.customTicksArr[i];
					// 				var date = new Date(rt.date);
					// 				var dateStr = date.getMonth() + "/" + date.getDay() + "/" + date.getFullYear();
					//
					// 				var newTickInfo = '<div class="info-content"><b>' + rt.name + '</b> : ' + rt.notes + ' ' + dateStr + '</div>'
					// 				html += newTickInfo;
					// 			}
					// 			html += "</div>";
					//
					// 		   $("#hover-text-info-container").html('<p class="info-content"><b>' + layer.feature.properties.customTicksCt + '</b> Ticks</p>')
					//
					// 		   if(!$("#chart-row-1").is(':visible')){
					// 				$("#chart-row-1").show();
					// 			}
					// 			if(!$("#chart-row-2").is(':visible')){
					// 				$("#chart-row-2").show();
					// 			}
					//
					// 		   $("#chart-row-1").append('<div id="tick-grade-chart" ></div>');
					//    		var hoverBarChart = new BarChart(getRouteArrayByType(layer.feature.properties.customTicksArr, routeTypeFilter), "#tick-grade-chart", $("#tick-grade-chart").parent().width());
					//    		hoverBarChart.build();
					//
					//    		$("#chart-row-2").append('<div id="tick-type-chart" ></div> <div id="tick-height-chart" ></div>');
					//    		new PieChart(layer.feature, "#tick-type-chart", $("#tick-type-chart").parent().width()/2, routeTypeFilter);
					//    		new RouteHeightPieChart(getRouteArrayByType(layer.feature.properties.customTicksArr, routeTypeFilter), "#tick-height-chart", $("#tick-height-chart").parent().width()/2);
					//
					// 		// TODO: Add some more fun hover actions like a chart of all the comments from ticked routes
					// 	}
					// }

					// action to perform when mousing over a feature
					// function todoHoverAction(e) {
					//     var layer = e.target;
					//
					//     removeAllCharts();
					//
					//     if($("#tick-time-chart")){
      		// 				$("#tick-time-chart").remove()
      		// 			}
					//
      		// 			if(layer.feature.properties.areatype === "TODO") {
				  //   		layer.setStyle({"fillColor":"#138DA9"});
				  //   	}
				  //   	else if(layer.feature.properties.areatype === "CRAG"){
				  //   		layer.setStyle({"fillColor":"#878787"});
				  //   	}
					//
					// 	$("#left-sidebar-heading-info-container").show();
					//     $("#left-sidebar-heading").text(layer.feature.properties.area);
					//
					//     var routeCountPropertyName = "customRouteCt"; // Default
					//     if(routeTypeFilter === "ALL"){
					//     	routeCountPropertyName = "customRouteCt";
					//     }
					//     else if(routeTypeFilter === "TRAD"){
					//     	routeCountPropertyName = "customTradCt";
					//     }
					//     else if(routeTypeFilter === "SPORT"){
					//     	routeCountPropertyName = "customSportCt";
					//     }
					//     else if(routeTypeFilter === "BOULDER"){
					//     	routeCountPropertyName = "customBoulderCt";
					//     }
					//     else if(routeTypeFilter === "ALPINE"){
					//     	routeCountPropertyName = "customAlpineCt";
					//     }
					//
					//     if( layer.feature.properties[routeCountPropertyName] ){
					//    		$("#hover-text-info-container").html('<p class="info-content"><b>' + layer.feature.properties[routeCountPropertyName] + '</b> ToDos</p>');
					//
					// 		if(!$("#chart-row-1").is(':visible')){
					// 			$("#chart-row-1").show();
					// 		}
					// 		if(!$("#chart-row-2").is(':visible')){
					// 			$("#chart-row-2").show();
					// 		}
					//
					// 		$("#chart-row-1").append('<div id="todo-grade-chart" ></div>');
					//    		var todoBarChart = new BarChart(getRouteArrayByType(layer.feature.properties.customRouteArr, routeTypeFilter), "#todo-grade-chart", $("#todo-grade-chart").parent().width());
					//    		todoBarChart.build();
					//
					//    		$("#chart-row-2").append('<div id="todo-type-chart" ></div> <div id="todo-height-chart" ></div>');
					// 		new PieChart(layer.feature, "#todo-type-chart", $("#todo-type-chart").parent().width()/2, routeTypeFilter);
					// 		new RouteHeightPieChart(getRouteArrayByType(layer.feature.properties.customRouteArr, routeTypeFilter), "#todo-height-chart", $("#todo-height-chart").parent().width()/2);
					// 	}
					// }

					// function getRouteArrayByType(routeArr, routeTyoe){
					// 	var newTypeArr = [];
					//
					// 	if(routeTyoe.toUpperCase() === "ALL"){
					// 		return routeArr;
					// 	}
					// 	else{
					// 		for(let i=0; i<routeArr.length; i++){
					// 			var rt = routeArr[i];
					// 			if(rt.type && rt.type.toUpperCase() === routeTyoe.toUpperCase()){
					// 				newTypeArr.push(rt);
					// 			}
					// 		}
					// 	}
					//
					// 	return newTypeArr;
					// }


					// function resetAreaHover(e) {
					// 	var layer = e.target;
					// 	resetFeatureColor(layer);
					// 	removeAllCharts();
					// }
					//
					//
					// function resetFeatureColor(layer) {
					//
					// 	if(layer.feature.properties.areatype === "TODO") {
					//     	layer.setStyle({"fillColor": "#0a4958"});
					//     }
					//     else if(layer.feature.properties.areatype === "CRAG"){
					//     	layer.setStyle({"fillColor":"orange"});
					//     }
					//     else if(layer.feature.properties.areatype === "TICK"){
					//     	layer.setStyle({"fillColor":"#505050"});
					//     }
					// }


					function removeAllCharts() {
						$("#todo-grade-chart").remove();
						$("#todo-type-chart").remove();
						$("#todo-height-chart").remove();
						$("#left-sidebar-heading-info-container").hide();
						$("#left-sidebar-heading").text("");
						$("#hover-text-info-container").html("");
						$("#chart-row-1").hide();
						$("#chart-row-1").html("");
						$("#chart-row-2").hide();
						$("#chart-row-2").html("");
					}

					function basicLocationFeatureClickEvent(e) {
						var layer = e.target;
						if(isAuthenticated){
							var geojsonLayer = L.geoJson(layer.toGeoJSON());
							geojsonLayer.eachLayer(
							    function(l){

							    	var layerName = l.feature.properties.area;
									var layerId = l.feature.properties.id;
									var layerCreatedby = l.feature.properties.createdby;
								    var layerAreaType = l.feature.properties.areatype;

							        drawnItems.addLayer(l);

							        var html = '<form class="new-area-form" action="/updatearea" method="post">' +
					        			'<div class="form-group">' +
					            		'<label>Name</label>' +
										'<input id="areaid_" type="hidden" class="form-control" name="areaid" value="'+layerId+'">' +
					            		'<input id="name_" type="text" class="form-control" name="areaname" value="'+layerName+'">' +
					            		'<p><strong>NOTE:</strong> This name should match the name of the area in Mountain Project if possible. Ex: If the location heading looks like this: "Locations > Colorado > Boulder > Eldorado Canyon SP > Redgarden Wall > Redgarden - Lumpe to the top" a good name would be "Eldorado Canyon SP".</p>' +
					        			'</div>'+

					        			'<div class="form-group">' +
					            		'<label for="areatype">Area Type</label>' +
					        			'<select id="area-type-select" class="form-control" name="areatype">' +
		  									'<option value="AREA">General Area (ex: Yosemite Valley)</option>' +
		  									'<option value="CRAG">Crag (ex: Half Dome)</option>' +
										'</select>' +
					        			'</div>'+


					        			'<div class="form-group">' +
					            		'<input id="lat" class="location-input" type="hidden" class="form-control" name="lat">' +
					            		'<input id="lng" class="location-input" type="hidden" class="form-control" name="lng">' +
					            		'<input id="userid" class="location-input" type="hidden" class="form-control" name="userid" value="'+userId+'">' +
					        			'</div>'+

					        			'<button id="submit-btn"  type="submit" class="btn btn-success btn-sm">Submit</button>' +
					    				'</form>';


							        l.bindPopup(html);
							        l.openPopup();

							        l.on('dragend', function(e) {
									    l.openPopup();
									  });

							        $("#area-type-select").val(layerAreaType);
							        if(layerAreaType === "CRAG"){
							        		// call change event to show parent area options
											$("#area-type-select").change();

											var parentArea = l.feature.properties.parentarea;
											$("#parent-area-select").val(parentArea);
							        }
							     }
							);

							enableEditModeInToolbar();
						}
					}

					// ////
					// // click event for areas
					// ////
					// function featureClickEvent(e) {
					//
					//  	var layer = e.target;
					//
					// 	if(!$("#info-container").is(':visible')){
					// 		$("#info-container").show();
					// 	}
					//
					// 	if($(".info-ul").length > 0){
					// 		$(".info-ul").remove();
					// 	}
					//
					// 	if($(".info-area-title").text().length > 0){
					// 		$(".info-area-title").remove();
					// 	}
					//
					// 	// This is a really weak check. we need to make sure this is
					// 	var subHeading = "";
					// 	if(layer.feature.properties.customTicksArr){
					// 		var layers = layer.feature.properties.customTicksArr;
					// 		subHeading = "Ticks";
					// 	}
					// 	else {
					// 		var layers = layer.feature.properties.customRouteArr;
					// 		subHeading = "ToDo";
					// 	}
					//
					// 	// Sort the array by the orderIndex property
					// 	function compare(a,b) {
					// 	  if (a.difficultyindex < b.difficultyindex)
					// 	     return -1;
					// 	  if (a.difficultyindex > b.difficultyindex)
					// 	    return 1;
					// 	  return 0;
					// 	}
					// 	layers.sort(compare);
					//
					// 	$("#info-area-title").text(subHeading+": "+layer.feature.properties.area);
					//
					// 	for(var l=0; l<layers.length; l++){
					//
					// 	    if(routeTypeFilter === "ALL" || layers[l].type.toUpperCase() === routeTypeFilter ){
					// 			var name = String(layers[l].name ? layers[l].name : 'n/a');
					// 			var type = String(layers[l].type ? layers[l].type :"n/a");
					// 			if(type.toUpperCase() === "TRAD" || type.toUpperCase() === "SPORT" || type.toUpperCase() === "ALPINE"){
					// 				var rating = String(layers[l].ropegrade ? layers[l].ropegrade : 'n/a');
					// 			}
					// 			else{
					// 				var rating = String(layers[l].bouldergrade ? layers[l].bouldergrade : 'n/a');
					// 			}
					// 			var pitches = String(layers[l].pitches ? layers[l].pitches :"n/a");
					// 			var stars = String(layers[l].stars ? layers[l].stars :"n/a");
					// 			var starVotes = String(layers[l].starVotes ? layers[l].starVotes :"n/a");
					// 			var url = String(layers[l].url ? layers[l].url :"n/a");
					// 			var geoLoc = String(layers[l].location ? layers[l].location :"n/a");
					// 			var crag = getLocationName(layers[l].area) ;
					// 			var imgMed = String(layers[l].imgMed ? layers[l].imgMed :"n/a");
					// 			var imgMed = String(layers[l].imgMed ? layers[l].imgMed :"n/a");
					//
					// 			var routeHTMLStr = "<ul class='info-ul'>";
					// 			routeHTMLStr += "<li class='info-text'><h3 class='info-header'><u>" +  name + "</u></h3></li>";
					// 			routeHTMLStr += "<li class='info-text'><i>Rating:  </i>" +  rating + "</li>";
					// 			routeHTMLStr += "<li class='info-text'><i>Type:  </i>" +  type + "</li>";
					// 			routeHTMLStr += "<li class='info-text'><i>Pitches:  </i>" +  pitches + "</li>";
					// 			routeHTMLStr += "<li class='info-text'><i>Stars:  </i>" +  stars + " out of "+ starVotes + " votes</li>";
					// 			routeHTMLStr += "<li class='info-text'><i>Crag:  </i>" +  crag + "</li>";
					// 			routeHTMLStr += "<li class='info-text'><a class='info-link' target='_blank' href='"+  url + "'>See it on Mountain Project</a></li>";
					// 			// routeHTMLStr += "<li class='info-link'> <img class='info-image' src=http://mountainproject.com"+ imgMed +" alt='Climbing Img'> </li>";
					// 			routeHTMLStr += "</ul>";
					//
					// 			$("#info-box").append(routeHTMLStr);
					// 		}
					//
					// 	}
					//
					// 	function getLocationName(areaId) {
					// 		var areaName = "";
					// 		for(var n=0; n<todoAreaPts.features.length; n++){
					// 			var thisAreaId = todoAreaPts.features[n].properties.id;
					// 			if(areaId === thisAreaId){
					// 				areaName = todoAreaPts.features[n].properties.area;
					// 			}
					// 		}
					//
					// 		return areaName;
					// 	}
					// }

					// // define the default feature style
					// var areaTodoPtsDefaultStyle = {
					//     radius: 0,
					//     fillColor: "#0a4958",
					//     stroke: false,
					//     weight: 1,
					//     opacity: 1,
					//     fillOpacity: 0.8
					// };
					//
					// var areaTickPtsDefaultStyle = {
			    // 		radius: 0,
			    // 		fillColor: "#505050",
			    // 		stroke: false,
			    // 		weight: 1,
			    // 		opacity: 1,
			    // 		fillOpacity: 0.8,
					// }
					//
					// var allAreaPtsDefaultStyle = {
					//     radius: 4,
					//     fillColor: "red",
					//     stroke: false,
					//     weight: 1,
					//     opacity: 1,
					//     fillOpacity: 0.8
					// };
					//
					// var allCragPtsDefaultStyle = {
					//     radius: 4,
					//     fillColor: "orange",
					//     stroke: false,
					//     weight: 1,
					//     opacity: 1,
					//     fillOpacity: 0.8
					// };
					//
					//
					// var areaTodoPtsObj = new L.GeoJSON(todoAreaPts, {
					// 		pointToLayer: function (feature, latlng) {
		      //   				return L.circleMarker(latlng, areaTodoPtsDefaultStyle);
		   	// 			},
					// 		onEachFeature: onEachTodoFeature
					// });
					//
					// var todoCragPtsObj = new L.GeoJSON(todoCragPts, {
					// 		pointToLayer: function (feature, latlng) {
		      //   				return L.circleMarker(latlng, allCragPtsDefaultStyle);
		   	// 			},
					// 		onEachFeature: onEachTodoFeature
					// });
					//
					// var areaTickPtsObj = new L.GeoJSON(tickAreaPts, {
					// 		pointToLayer: function (feature, latlng) {
		      //   				return L.circleMarker(latlng, areaTickPtsDefaultStyle);
		   	// 			},
					// 		onEachFeature: onEachTickFeature
					// });
					//
					// var areaPtsObj = new L.GeoJSON(areaPts, {
					// 		pointToLayer: function (feature, latlng) {
		      //   				return L.circleMarker(latlng, allAreaPtsDefaultStyle);
		   	// 			},
					// 		onEachFeature: onEachBasicAreaFeature
					// });
					//
					// var cragPtsObj = new L.GeoJSON(cragPts, {
					// 		pointToLayer: function (feature, latlng) {
		      //   				return L.circleMarker(latlng, allCragPtsDefaultStyle);
		   	// 			},
					// 		onEachFeature: onEachBasicCragFeature
					// });


					// initialize the Leaflet map object
					map = new L.Map('map', {
						//center: new L.LatLng(39.7789912112384, -465.47149658203125),
						zoom: 9,
						zoomAnimation: false,
						layers: [positron],
						zoomControl: false
					});

					new L.Control.Zoom({ position: 'topright' }).addTo(map);
					map.on('click', mapClickEvent);

					function mapClickEvent(e) {

						// Clear the info box
						if($("#info-box-content").text().length > 0){
							$("#info-box-content").html("");
						}
						if($(".info-area-title").text().length > 0){
							$(".info-area-title").text("");
						}
						if($("#info-container").is(':visible')){
							$("#info-container").hide();
						}

						if(drawnItems){
							drawnItems.eachLayer(function(layer){drawnItems.removeLayer(layer)});

							disableEditModeInToolbar();
						}
					}

					if(isAuthenticated){
						// Initialise the FeatureGroup to store editable layers
						var drawnItems = new L.FeatureGroup();
						map.addLayer(drawnItems);

						var drawControl = new L.Control.Draw({
							position: 'topright',
						   draw: {
						        polygon: false,
						        polyline: false,
						        rectangle: false,
						        marker: true,
						        circle: false
						   },
						   edit: {
						        featureGroup: drawnItems,
						        remove: false, // delete button/functionality
						        edit: true  // edit button/functionality
						   }
						});
						map.addControl(drawControl);
						L.drawLocal.draw.toolbar.buttons.marker = 'Add a climbing area or crag';
						L.drawLocal.draw.handlers.marker.tooltip.start = 'Place pin then fill out and submit to save this new area.';
						L.drawLocal.edit.handlers.edit.tooltip.text = 'Drag the pin to change location and/or fill out and submit the form.';
						L.drawLocal.edit.handlers.edit.tooltip.subtext = '';

						map.on('draw:created', function (e) {
						    var type = e.layerType;
						    var layer = e.layer;
						    var randomId = Math.random().toString(36).substring(7);

							 // add the feature to the edit feature group
						    drawnItems.addLayer(layer)


						    if (type === 'marker') {
						    	var html = '<form class="new-area-form" action="/submitarea" method="post">' +
				        			'<div class="form-group">' +
				            	'<label>Name</label>' +
				            	'<input id="name_'+randomId+'" type="text" class="form-control" name="areaname">' +
				            	'<p><strong>NOTE:</strong> This name should match the name of the area in Mountain Project if possible. Ex: If the location heading looks like this: "Locations > Colorado > Boulder > Eldorado Canyon SP > Redgarden Wall > Redgarden - Lumpe to the top" you could set the name as "Eldorado Canyon SP" or "Redgarden Wall" or "Redgarden - Lumpe to the top".</p>' +
				        			'</div>'+

				        			'<div class="form-group">' +
				            	'<label for="areatype">Area Type</label>' +
				        			'<select id="area-type-select" class="form-control" name="areatype">' +
	  									'<option value="AREA">General Area (ex: Yosemite Valley)</option>' +
	  									'<option value="CRAG">Crag (ex: Half Dome)</option>' +
									'</select>' +
				        			'</div>'+


				        			'<div class="form-group">' +
				            	'<input id="lat_'+randomId+'" class="location-input" type="hidden" class="form-control" name="lat">' +
				            	'<input id="lng_'+randomId+'" class="location-input" type="hidden" class="form-control" name="lng">' +
				            	'<input id="userid_'+randomId+'" class="location-input" type="hidden" class="form-control" name="userid" value="'+userId+'">' +
				        			'</div>'+

				        			'<button id="'+randomId+'_btn"  type="submit" class="btn btn-success btn-sm">Submit</button>' +
				    				'</form>';


						        layer.bindPopup(html);
						        layer.openPopup();
						    }
						});


						function createNewBasicLocation(geojson) {
							return new L.GeoJSON(geojson, {
								pointToLayer: function (response, latlng) {
				        			return L.circleMarker(latlng, allAreaPtsDefaultStyle );
				   				},
								onEachFeature: onEachBasicAreaFeature
							});
						}

						function addFeatureToAreaPts(newFeature) {
							areaPtsObj.addLayer(newFeature);
						}


						function disableEditModeInToolbar() {
							// manually disable edit mode
							var toolbar;
							for (var toolbarId in drawControl._toolbars) {
							    toolbar = drawControl._toolbars[toolbarId];
							    if (toolbar instanceof L.EditToolbar) {
							        toolbar._modes.edit.handler.disable();
							    }
							}
						}

						function enableEditModeInToolbar() {
							// manually enabling edit mode
							var toolbar;
							for (var toolbarId in drawControl._toolbars) {
							    toolbar = drawControl._toolbars[toolbarId];
							    if (toolbar instanceof L.EditToolbar) {
							        toolbar._modes.edit.handler.enable();
							    }
							}
						}

						function removeExistingEditMarkers() {
							 var editLayers = drawnItems.getLayers();
							 for(var i=0; i<editLayers.length; i++){
						 		var layer = editLayers[i];

						 		if(!layer.editing.enabled()){
						 			drawnItems.eachLayer(function(layer){
						 				drawnItems.removeLayer(layer)
						 			});
						 		}
							 }
						}

						map.on('draw:editstop', function (e) {

							///// cant call this because it posts the form a 2nd time
							//$("#submit-btn").click()
						});


						map.on('popupopen', function (e) {
							 var tempMarker = this;

							 enableEditModeInToolbar()

							// set coordinate fields on each popup form
							var latLngObj = e.popup.getLatLng();
							$.each($(".location-input"), function(index, val){
								if($(this).prop("name") === "lat"){
									$(this).val(latLngObj.lat);
								}
								else if($(this).prop("name") === "lng"){
									$(this).val(latLngObj.lng);
								}
							});

							// submit the form without a page refresh
							var submitButton = $(e.target._popup._wrapper).find('button');
							var $form = $(e.target._popup._wrapper).find('form');
							submitButton.unbind('click').bind('click',function() {
							   $form.unbind('submit').bind('submit',function() {
							      $.post($(this).attr('action'), $(this).serialize(), function(response){

							           	var tempAreaTodoPtsDefaultStyle = {
										    radius: 4,
										    fillColor: "red",
										    stroke: false,
										    weight: 1,
										    opacity: 1,
										    fillOpacity: 0.8
										};

							            if(response.actiontype === "NEW"){
								            var latlng = L.latLng(response.lat, response.lng);
								            var tempNewArea = L.circleMarker(latlng, tempAreaTodoPtsDefaultStyle);
								            tempNewArea.bindPopup('<h4>Thanks for contributing '+response.name+'!</h4>' + '<p>You will need to update your Mountain Project data from your <a href="/profile">profile</a> page to see your routes mapped against these new areas.</p>')

								            map.addLayer(tempNewArea);

								            tempNewArea.openPopup();

								            // updating the areaPts cache.
								            areaPts.features.push(response)
								         }
								         else if(response.actiontype === "UPDATE"){

								            var oldLayer;
								            map.eachLayer(function(layer){
								            	if(layer.feature){
								            		var thisId = layer.feature.properties.id;
								            		if(parseInt(thisId) === parseInt(response.properties.id) && !(layer instanceof L.Marker)){
								            			oldLayer = layer;
								            		}
								            	}
								            });

								            map.removeLayer(oldLayer);

								            // updating the areaPts cache.
								            for(var a=0; a<areaPts.features.length; a++){
								            	var area = areaPts.features[a]
								            	if(parseInt(area.properties.id) === parseInt(response.properties.id)){
								            			area = response;
								            	}
								            }

								            var newLayer = createNewBasicLocation(response);
								            addFeatureToAreaPts(newLayer);

												disableEditModeInToolbar();
								         }

							            drawnItems.eachLayer(function(layer){
							            	drawnItems.removeLayer(layer);
							            });

							      },'json');
							      return false;
							   });
							 });

							 var areaTypeSelEl = $(e.target._popup._wrapper).find('#area-type-select');
							 areaTypeSelEl.change(function () {

							 	if($("#parent-area-select").parent()){
							 		$("#parent-area-select").parent().remove();
							 	}

							    var optSelected = $( "select option:selected").val();
							    if(optSelected === "CRAG"){
							   	var parentAreaSelEl = '<div class="form-group">' +
				            	'<label for="areatype">Parent Area</label>' +
				            	'<select id="parent-area-select" class="form-control" name="parentarea">';

				            	var sortedAreaPts = areaPts.features.sort(function(a, b) {
									    var textA = a.properties.area.toUpperCase();
									    var textB = b.properties.area.toUpperCase();
									    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
									});

	  								for(var i=0; i<sortedAreaPts.length; i++){
	  									var area = areaPts.features[i];
	  									var parentState = area.properties.parentstate;
	  									if (parentState) {
	  										var label = parentState +" / "+ area.properties.area;
	  									}
	  									else {
	  										var label = area;
	  									}
	  									parentAreaSelEl += '<option value="'+ area.properties.id +'">'+ label +'</option>';
	  								}
									parentAreaSelEl += '</select></div>';

									$("#area-type-select").parent().after(parentAreaSelEl)
							    }
							  })
						})

						map.on('popupclose', function (e) {
							 var tempMarker = this;

							 //removeExistingEditMarkers();
						})


						map.on("draw:drawstop", function (e) {
							//console.log("stop")
						})

						map.on("draw:drawstart", function (e) {
							removeExistingEditMarkers();
						})


						map.on('draw:edited', function (e) {
						    var layers = e.layers;
						    layers.eachLayer(function (layer) {
						    	//console.log("test")

						    });
						});
					}

					// add overlays to the map object
					map.addLayer(areaTodoPtsObj);
					// map.addLayer(areaTickPtsObj);
					// map.addLayer(todoCragPtsObj);

					if(areaTodoPtsObj.getLayers().length > 0){
						map.fitBounds(areaTodoPtsObj.getBounds());
					}
					else{
						map.fitWorld();
					}


					// Putting ticks below todos
					// map.eachLayer(function(layer){
					// 	if(layer.feature){
					// 		if(layer.feature.properties.customTicksArr){
					// 			layer.bringToBack();
					// 		}
					// 	}
					// });

					// define the base layer switcher
					var baseMaps = {
						"Outdoors": outdoors,
						"Light": positron,
						"MapQuest OSM": mqosm,
						"MapQuest Aerial": mqaerial
					};

					// define the overlay layer switcher
					var overlays = {
						"To-Do Areas": areaTodoPtsObj,
						"To-Do Crags": todoCragPtsObj,
						"Tick Areas": areaTickPtsObj,
						"All Areas (editable)": areaPtsObj,
						"All Crags (editable)": cragPtsObj
					};


					map.on('layeradd', function(event) {
					    if(event.layer == areaTickPtsObj) {
					        $("#tick-slider").show();
					        resizeLocations(routeTypeFilter);
					    }
					    else if(event.layer == todoCragPtsObj) {
					    	resizeLocations(routeTypeFilter);
					    }
					});

					map.on('layerremove', function(event) {
					    if(event.layer == areaTickPtsObj) {
					        $("#tick-slider").hide();
					    }
					});


					// adds the layer switcher control
					map.addControl(new L.control.layers(baseMaps,overlays, {"collapsed":false}));

			}

			var that = this;


			// Initialize
			that.init();


		});

})();
