      
(function(){

	$(document).ready(function () { 
			var map;	
			var popup;
			var orphanRouteArr = [];
			var todoAreaPts;
			var tickAreaPts;
			var cragPts;
	 				
	 		var outdoors = new L.tileLayer.provider('Thunderforest.Outdoors');		
	 		var mqosm = new L.tileLayer.provider('MapQuestOpen');		
	 		var mqaerial = new L.tileLayer.provider('MapQuestOpen.Aerial');	
	 		var darkmater = new L.tileLayer.provider('CartoDB.DarkMatter');
	 		var positron = new L.tileLayer.provider('CartoDB.Positron');
	 		
	 		
	 		// Initialize 
	 		this.init = function () { 			
	 			
	 			////
	 			// Make all data requests and execute a single callback when they all finish... It's amazing
	 			////
	 			$.when(
	 				getMPToDoData(),
	 				getMPTicksData(),
	 				getTodoAreaPts(),
	 				getTickAreaPts(),
	 				getCragPts(),
	 				getMissingAreas()
	 			).done(function (toDoResponse, tickResponse, areaTodoPtResponse, areaTickPtResponse, cragPtResponse, missingAreasResponse) {
					todoAreaPts = areaTodoPtResponse[0];	
					tickAreaPts = areaTickPtResponse[0];
					cragPts = cragPtResponse[0];	
					processRoutes(tickResponse[0]["routes"], 'tick');				
					processRoutes(toDoResponse[0]["routes"], 'todo');
					reportMissingAreas(missingAreasResponse);
					
					setSearchBar(todoAreaPts);
					
					renderMap();
					resizeLocations("tick");
					resizeLocations("todo");
					setTimeSlider();			
	 			});	
	 		} 		
	 		
	 		function setSearchBar(areas) {
	 				var substringMatcher = function(strs) {
					  return function findMatches(q, cb) {
					    var matches, substringRegex;
					
					    // an array that will be populated with substring matches
					    matches = [];
					
					    // regex used to determine if a string contains the substring `q`
					    substrRegex = new RegExp(q, 'i');
					
					    // iterate through the pool of strings and for any string that
					    // contains the substring `q`, add it to the `matches` array
					    $.each(strs, function(i, str) {
					      if (substrRegex.test(str)) {
					        matches.push(str);
					      }
					    });
					
					    cb(matches);
					  };
					};
					
					var areasArr = [];
					for(var i=0; i<areas.features.length; i++){
						var areaName = areas.features[i].properties.area;
						var geom = areas.features[i].geometry.coordinates;
						areasArr.push(JSON.stringify({"areaName":areaName, "geom":geom}));
					}
					
					
					$('#area-search .typeahead').typeahead({
					  hint: true,
					  highlight: true,
					  minLength: 1
					},
					{
					  name: 'areas',
					  source: substringMatcher(areasArr),
					  display:function(area) {
							return JSON.parse(area).areaName;
					  },
					}).bind('typeahead:select', function(e, suggestion) {
  						var sugObj = JSON.parse(suggestion);
  						map.setView(L.latLng(sugObj.geom[1],sugObj.geom[0]), 14);
					});
	 		}
	 		
	 		function setTimeSlider() {
	 			var allTickArr = [];
	 			for(var n=0; n<tickAreaPts.features.length; n++){
					var tickArr = tickAreaPts.features[n].properties.customTicksArr;
					
					if(tickArr){
						for(var d=0; d<tickArr.length; d++){
							allTickArr.push(new Date(tickArr[d].date));
						}			
					}
				}
				
				var sortDatesAscending = function (date1, date2) {
				  // This is a comparison function that will result in dates being sorted in
				  // ASCENDING order. 
				  if (date1 > date2) return 1;
				  if (date1 < date2) return -1;
				  return 0;
				};
				
				var sortedAllTickArr = allTickArr.sort(sortDatesAscending);
				
				$("#tick-slider").slider({
			      range: "min",
			      value: allTickArr.length,
			      min: 0,
			      max: allTickArr.length,
			      slide: function( event, ui ) {
			      	var sliderPos = ui.value;
			      	var selectedDate = sortedAllTickArr[sliderPos];
			     		
			     		if(selectedDate){
				     		var tickLocs = tickAreaPts.features;
				     		var rtsCt = 0;
				     		for(var t=0; t<tickLocs.length; t++){
				     			var thisLoc = tickLocs[t];
				     			var thisLocTicks = thisLoc.properties.customTicksArr;
				     			var laterThanTicksCt = 0;
				     			
				     			for(var i=0; i<thisLocTicks.length; i++){
				     				if(new Date(thisLocTicks[i].date) > selectedDate){
				     					laterThanTicksCt = laterThanTicksCt + 1;
				     				}
				     				else{
				     					rtsCt = rtsCt + 1;
				     				}
				     			}
				     			
				     			var newRadius = getLocationSizeBucket(thisLocTicks.length - laterThanTicksCt);
				     			
				     			map.eachLayer(function (layer) {
				     				if(layer.feature && layer.feature.properties.customTicksCt){
									    var mapLayerId = layer.feature.properties.id;
									    if(thisLoc.properties.id === mapLayerId){
									    	 layer.setRadius(newRadius);	
									    }
									 }
								});
				     				
				     		}
				     		
				     		if( ! $("#time-slider-label").is(":visible")){
				     			$("#time-slider-label").show();
				     		}
				     		$("#time-slider-label").text( selectedDate.getMonth() + " / " + selectedDate.getDay() + " / " + selectedDate.getFullYear()  + " | " + rtsCt + " Ticks");
			     		}
			     		else {
							// no value 			     		
			     		}
			      },
			      stop: function( event, ui ) {
			      	setTimeout(function(){ 
			      		$("#time-slider-label").fadeOut(400);
			      	}, 30000);
			      	
			      }
			   }); 		
	 		}
	 		 		
	 		////
	 		// Area points are the climbing area locations
	 		////
	 		function getTodoAreaPts() {	
	 			return $.ajax({
	  				url: "todoareas",
	  				context: document.body,
	  				type: "GET",
	  				crossDomain: false,
	  				dataType: "json"
				})
	 		}
	 		
	 		////
	 		// Area points are the climbing area locations
	 		////
	 		function getTickAreaPts() {	
	 			return $.ajax({
	  				url: "tickareas",
	  				context: document.body,
	  				type: "GET",
	  				crossDomain: false,
	  				dataType: "json"
				})
	 		}
	 		
	 		////
	 		// Area points are the climbing area locations
	 		////
	 		function getCragPts() {	
	 			return $.ajax({
	  				url: "crags",
	  				context: document.body,
	  				type: "GET",
	  				crossDomain: false,
	  				dataType: "json"
				})
	 		}
	 		
	 		////
	 		// Ticks include routes that have been done
	 		////
	 		function getMPTicksData() { 			
	 			return $.ajax({
	  				url: "ticks",
	  				context: document.body,
	  				type: "GET",
	  				crossDomain: false,
	  				dataType: "json"		
				})
			}

	 		////
	 		// ToDos include routes that are yet to be done
	 		////	
	 		function getMPToDoData() { 			
	 			var that = this;
	 			return $.ajax({
	  				url: "todos",
	  				context: document.body,
	  				type: "GET",
	  				crossDomain: false,
	  				dataType: "json"
				})
			}
			
			function getMissingAreas() {
				return $.ajax({
	  				url: "missingareas",
	  				context: document.body,
	  				type: "GET",
	  				crossDomain: false,
	  				dataType: "json"
				})
			}
			
			////
			// Process route data
			// content type can be 'todo' or 'tick'
			////
			function processRoutes(routesArr, contentType) {
					for(var rtI=0; rtI<routesArr.length; rtI++){
						var route = routesArr[rtI];											
						
						// This will not work if checked against state level geographies because geoLoc includes the state as a root commonly
						// a better approach is to parse the location string in a better way. 
						if(contentType === 'todo'){
							route.routeCategory = "TODO";
							setToDoLocationRouteFrequency();
							setToDoLocationRouteAttributes(route);
						}
						else if(contentType === 'tick'){
							route.routeCategory = "TICK";
							setTickLocationRouteFrequency();
							setTickLocationRouteAttributes(route);
						}
				}
			}
			
			function reportMissingAreas(data) {
				var areas = data[0].missingAreas;
				for(var i=0; i<areas.length; i++){
					var area = areas[i];
					$("#issue-box").dialog({
							  title: "Current Data Issues",
					  		  width: $(window).width()/1.5, 
				  			  height: $(window).height()/1.5,
							  resizable: true,
							  dialogClass: 'issue-modal',
							  buttons: [
							    {
							      text: "Got It",
							      click: function() {
							        $( this ).dialog( "close" );
							      }
							    }
							  ]
							});
						
						$("#issue-box").append("<h4 class='info-content'><b>Missing location for the route: "+ area.name +"</b><a class='error-link' href="+ area.mpurl+" target='_blank'>See it on Mountain Project!</a></h4>");				
				}
			
			}
			
			////
			// Set the frequency of ticks on locations that will dictate the point size.
			//
			////
			function setTickLocationRouteFrequency() {	
					
				// @tickAreaPts 
				for(var n=0; n<tickAreaPts.features.length; n++){
					var currAreaId = tickAreaPts.features[n].properties.id;

					if(!tickAreaPts.features[n].properties.customTicksCt){
						tickAreaPts.features[n].properties.customTicksCt = 0;
					}			
					
					tickAreaPts.features[n].properties.customTicksCt = tickAreaPts.features[n].properties.count;
				}
			}

			
			////
			// Set the frequency of todos on locations that will dictate the point size.
			//
			////
			function setToDoLocationRouteFrequency() {	
					
				// @todoAreaPts - globally imported in HTML head imports
				for(var n=0; n<todoAreaPts.features.length; n++){
					var currAreaId = todoAreaPts.features[n].properties.id;

					if(!todoAreaPts.features[n].properties.customRouteCt){
						todoAreaPts.features[n].properties.customRouteCt = 0;
					}
					
					todoAreaPts.features[n].properties.customRouteCt = todoAreaPts.features[n].properties.count;
				}								
			}
			
			////
			// Sets custom attributes of ticks on locations.
			//
			// @route - a route representing either a tick or a todo 
			////
			function setTickLocationRouteAttributes(route) {	
					
				// @tickAreaPts 
				for(var n=0; n<tickAreaPts.features.length; n++){
					var currAreaId = tickAreaPts.features[n].properties.id;

					if(!tickAreaPts.features[n].properties.customTicksArr){
						tickAreaPts.features[n].properties.customTicksArr = [];
					}	
					
					if(currAreaId === route.area){						
						tickAreaPts.features[n].properties.customTicksArr.push(route);
					}
				}
			}
			
			////
			// Set the types (trad, sport, boulder, etc...) and the route tracking array on the location objects
			//
			////
			function setToDoLocationRouteAttributes(route) {
				
				// @todoAreaPts - globally imported in HTML head imports
				for(var n=0; n<todoAreaPts.features.length; n++){
					var currAreaId = todoAreaPts.features[n].properties.id;
					
					if(!todoAreaPts.features[n].properties.customRouteArr){
						todoAreaPts.features[n].properties.customRouteArr = [];
					}
					if(!todoAreaPts.features[n].properties.customTradCt){
						todoAreaPts.features[n].properties.customTradCt = 0;
					}
					if(!todoAreaPts.features[n].properties.customSportCt){
						todoAreaPts.features[n].properties.customSportCt = 0;
					}
					if(!todoAreaPts.features[n].properties.customBoulderCt){
						todoAreaPts.features[n].properties.customBoulderCt = 0;
					}
					if(!todoAreaPts.features[n].properties.customAlpineCt){
						todoAreaPts.features[n].properties.customAlpineCt = 0;
					}	
					
					if(currAreaId === route.area){						
						todoAreaPts.features[n].properties.customRouteArr.push(route);
						
						var type = String(route.type ? String(route.type) : 'n/a').trim();
						if(type.toLowerCase() === "trad"){
							todoAreaPts.features[n].properties.customTradCt = todoAreaPts.features[n].properties.customTradCt + 1;
						}
						else if(type.toLowerCase() === "sport"){
							todoAreaPts.features[n].properties.customSportCt = todoAreaPts.features[n].properties.customSportCt + 1;
						}
						else if(type.toLowerCase() === "boulder"){
							todoAreaPts.features[n].properties.customBoulderCt = todoAreaPts.features[n].properties.customBoulderCt + 1;
						}
						else if(type.toLowerCase() === "alpine"){
							todoAreaPts.features[n].properties.customAlpineCt = todoAreaPts.features[n].properties.customAlpineCt + 1;
						}
					}
				}
			}
			
			////
			// Simple way to control the size of the location points
			//
			////
			function getLocationSizeBucket(rtCount) {
				if(rtCount < 1){
					return 0
				}
				else if(rtCount < 5){
					return 5
				}
				else if(rtCount >= 5 && rtCount < 10){
					return 10
				}
				else if(rtCount >= 10 && rtCount < 30){
					return 15
				}
				else if(rtCount >= 30 && rtCount < 50){
					return 25
				}
				else if(rtCount >= 50 && rtCount < 70){
					return 35
				}
				else if(rtCount >= 70 && rtCount < 100){
					return 45
				}
				else if(rtCount >= 100 && rtCount < 150){
					return 60
				}
				else if(rtCount >= 150){
					return 80
				}
			}
			
			
			////
			// Sets the size of the location points respective to the amount of climbs in that area
			// TODO: better check for ticks vs. todos
			////
			function resizeLocations(contentType) {	
					map.eachLayer(function(layer){
						if(layer.feature){
							// customRouteCt is currently ToDo frequency and will take priority over existing area points
							if(layer.feature.properties.customRouteCt > 0){
								var routeCt = getLocationSizeBucket(layer.feature.properties.customRouteCt);
								layer.setRadius(routeCt);
							}
							if(layer.feature.properties.customTicksCt > 0){
								var ticksCt = getLocationSizeBucket(layer.feature.properties.customTicksCt);
								layer.setRadius(ticksCt);
							}
						}	
					});			     
			}
				
			
			function renderMap() {
					
					// properties set on each feature of a Leaflet layer object
					function onEachTodoFeature(feature, layer) {
						layer.on({
			            mouseover: todoHoverAction,
			            mouseout: resetTodoHover,
			            click: featureClickEvent
			            });
					}	
					
					function onEachTickFeature(feature, layer) {
						layer.on({
			            mouseover: tickHoverAction,
			            mouseout: resetTickHover
			            });
					}	
					
					function tickHoverAction(e) {
      				var layer = e.target;
      				
      				//////
      				/// TODO: this is really boring. Make this rout info more interesting
      				/////
      				var html = '<div class="tick-info-container">';
						for(var i=0; i<layer.feature.properties.customTicksArr.length; i++){
							var rt = layer.feature.properties.customTicksArr[i];
							var date = new Date(rt.date);
							var dateStr = date.getMonth() + "/" + date.getDay() + "/" + date.getFullYear();
							
							var newTickInfo = '<div class="info-content"><b>' + rt.name + '</b> : ' + rt.notes + ' ' + dateStr + '</div>'
							html += newTickInfo;		
						}
						html += "</div>";

					   layer.setStyle({"fillColor":"#3F3F3F"})
					    			    	
				      //open popup;
					  	popup = L.popup({offset:new L.Point(0,0)})
					   .setLatLng(e.latlng) 
					   .setContent(
					   	'<div class="info-header">' + '<b>' + layer.feature.properties.area + '</b></div>' +
							'<div class="info-content">' + 'You have climbed  ' + '<b>' + layer.feature.properties.customTicksCt + '</b> routes here!' + '</div>' +
							'<br/>' + 															
							'<div id="hover-grade-chart"></div>' + html
						)
					   .openOn(map);	
					   
					   // Render charts
			   		var clickBarChart = new BarChart(layer.feature.properties.customTicksArr, "#hover-grade-chart");	
			   		clickBarChart.build();
			   		
			   		// Fixing the annoying issue when the popup is pushed right after the chart is dynamically added
			   		var popWidth = $(".leaflet-popup").width();
			   		$(".leaflet-popup").css({left: "-"+(popWidth/2)+"px"});

						
						// TODO: Add some more fun hover actions like a chart of all the comments from ticked routes	       					 
					}
					
					// action to perform when mousing over a feature
					function todoHoverAction(e) {
					    	var layer = e.target;
					    	
					    	layer.setStyle({"fillColor":"#083C49"})
					    			    	
					      //open popup;
						  	popup = L.popup({offset:new L.Point(0,0)})
						   .setLatLng(e.latlng) 
						   .setContent(
						   	'<div class="info-header">' + '<b>' + layer.feature.properties.area + '</b>' +
								'</div><div class="info-content">' + 'There are  ' + '<b>' + layer.feature.properties.customRouteCt + '</b> ToDos here. <b>Go get em!!!</b>' +
								'<br/>' + 																
								'<div id="pie"></div>'
							)
						   .openOn(map);	
							
							var svg = new PieChart(layer.feature);
					}
					
					function resetTickHover(e) {
						var feature = e.target;
						feature.setStyle({"fillColor":"#505050"});
						 if(popup){			    
 						 	map.closePopup(popup);
 						 	pupup = null;
 						 }
 					 }
					
					// action to perform when mousing off of a feature 
					function resetTodoHover(e) {  
						var layer = e.target;
						
						layer.setStyle({"fillColor": "#0a4958"});
					    if(popup){			    
 						 	map.closePopup(popup);
 						 	pupup = null;
 						 }
					}		
					
					function featureClickEvent(e) {	
					 	var layer = e.target;
						//map.setView(layer.getLatLng(), 14);
						
						if(!$("#info-container").is(':visible')){
							$("#info-container").show();
							$("#tick-slider").css("bottom", "275px");
						}
						
						if($(".info-ul").length > 0){
							$(".info-ul").remove();
						}
						
						if($(".info-area-title").text().length > 0){
							$(".info-area-title").remove();
						}
						
					   // Render charts
					   var clickBarChart = new BarChart(layer.feature.properties.customRouteArr, "#click-chart-panel");	
					   clickBarChart.build();	   			   
						
						$("#info-area-title").text(layer.feature.properties.area + " ToDo Routes");
//						$("#info-box").append("<h3 class='info-area-title'>" + layer.feature.properties.area + "</h3>");
						
						var layers = layer.feature.properties.customRouteArr;
						for(var l=0; l<layers.length; l++){						
							var name = String(layers[l].name ? layers[l].name : 'n/a');
							var type = String(layers[l].type ? layers[l].type :"n/a");
							if(type.toLowerCase() === "trad" || type.toLowerCase() === "sport"){
								var rating = String(layers[l].ropegrade ? layers[l].ropegrade : 'n/a');
							}
							else{
								var rating = String(layers[l].bouldergrade ? layers[l].bouldergrade : 'n/a');							
							}
							var pitches = String(layers[l].pitches ? layers[l].pitches :"n/a");
							var stars = String(layers[l].stars ? layers[l].stars :"n/a");
							var starVotes = String(layers[l].starVotes ? layers[l].starVotes :"n/a");
							var url = String(layers[l].url ? layers[l].url :"n/a");
							var geoLoc = String(layers[l].location ? layers[l].location :"n/a");
							var crag = getLocationName(layers[l].area) ;
							var imgMed = String(layers[l].imgMed ? layers[l].imgMed :"n/a");
							var imgSmall = String(layers[l].imgSmall ? layers[l].imgSmall :"n/a");
							  
							var routeHTMLStr = "<ul class='info-ul'>";
							routeHTMLStr += "<li class='info-text'><h3 class='info-header'>" +  name + "</h3></li>";
							routeHTMLStr += "<li class='info-text'><i>Rating:  </i>" +  rating + "</li>";
							routeHTMLStr += "<li class='info-text'><i>Type:  </i>" +  type + "</li>";
							routeHTMLStr += "<li class='info-text'><i>Pitches:  </i>" +  pitches + "</li>";
							routeHTMLStr += "<li class='info-text'><i>Stars:  </i>" +  stars + " out of "+ starVotes + " votes</li>";
							routeHTMLStr += "<li class='info-text'><i>Crag:  </i>" +  crag + "</li>";
							routeHTMLStr += "<li><a class='info-link' target='_blank' href='"+  url + "'>See it on Mountain Project</a></li>";	
							routeHTMLStr += "<li class='info-link'> <img class='info-image' src="+ imgSmall +" alt='Climbing Img'> </li>";						
							routeHTMLStr += "</ul>";
							
							$("#info-box").append(routeHTMLStr);

						}
						
						function getLocationName(areaId) {
							var areaName = "";
							for(var n=0; n<todoAreaPts.features.length; n++){
								var thisAreaId = todoAreaPts.features[n].properties.id;
								if(areaId === thisAreaId){
									areaName = todoAreaPts.features[n].properties.area;
								}
							}
							
							return areaName;
						}
					}
					
					// define the default feature style		
					var areaTodoPtsDefaultStyle = {
					    radius: 0,
					    fillColor: "#0a4958",
					    stroke: false,
					    weight: 1,
					    opacity: 1,
					    fillOpacity: 0.8
					};	
					
					var areaTickPtsDefaultStyle = {
			    		radius: 0,
			    		fillColor: "#505050",
			    		stroke: false,
			    		weight: 1,
			    		opacity: 1,
			    		fillOpacity: 0.8,
					}			
				
					// add todo pts to map
					var areaTodoPtsObj = new L.GeoJSON(todoAreaPts, {
							pointToLayer: function (feature, latlng) {
		        				return L.circleMarker(latlng, areaTodoPtsDefaultStyle);
		   				},
							onEachFeature: onEachTodoFeature		
					});		
					
					// add tick pts to map
					var areaTickPtsObj = new L.GeoJSON(tickAreaPts, {
							pointToLayer: function (feature, latlng) {
		        				return L.circleMarker(latlng, areaTickPtsDefaultStyle);
		   				},
							onEachFeature: onEachTickFeature		
					});	
					
					
					// initialize the Leaflet map object
					map = new L.Map('map', {
						//center: new L.LatLng(39.7789912112384, -465.47149658203125), 
						zoom: 9,
						zoomAnimation: false,
						layers: [positron],
						zoomControl: true
					});
					
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
							$("#tick-slider").css("bottom", "25px");
						}
						
						// Clear the chart
						if($("#click-chart-panel")){
							$("#click-chart-panel").html("");
						}
					}
					
					// add overlays to the map object	
					map.addLayer(areaTodoPtsObj);
					map.addLayer(areaTickPtsObj);
					
					
					map.fitBounds(areaTodoPtsObj.getBounds());
								
						
					// define the base layer switcher
					var baseMaps = {
						"Outdoors": outdoors,
						"Light": positron,						
						"MapQuest OSM": mqosm,
						"MapQuest Aerial": mqaerial
						};
						
					// define the overlay layer switcher
					var overlays = {
						"ToDos": areaTodoPtsObj,
						"Ticks": areaTickPtsObj
						}; 
						
					// adds the layer switcher control
					map.addControl(new L.control.layers(baseMaps,overlays, {"collapsed":true}));
			}

			var that = this;
			$("#welcome-modal").dialog({
				  title: "About This Project",
				  width: $(window).width()/1.25, 
				  height: $(window).height()/1.25,
				  resizable: true,
				  dialogClass: 'welcome-modal',
				  closeOnEscape: false,
				  open: function(event, ui) { 
				  	$(".ui-dialog-titlebar-close", ui.dialog | ui).hide(); 
				  	$(".ui-dialog-titlebar.ui-widget-header.ui-corner-all.ui-helper-clearfix.ui-draggable-handle").hide();
				  },
				  buttons: [
				    {
				      text: "Got It",
				      click: function() {
				        $( this ).dialog( "close" );						        
				      }
				    }
				  ]
			});
									

			// Initialize
			that.init();
			
		
		});	
		
})();