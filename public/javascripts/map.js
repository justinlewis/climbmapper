      
(function(){

	$(document).ready(function () { 
			var map;	
			var popup;
			var orphanRouteArr = [];
			var areaPts;
			var tickLocations = L.featureGroup();
	 				
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
	 				getAreaPts(),
	 				getMissingAreas()
	 			).done(function (toDoResponse, tickResponse, arePtResponse, missingAreasResponse) {
					areaPts = arePtResponse[0];		
					processRoutes(tickResponse[0]["routes"], 'tick');				
					processRoutes(toDoResponse[0]["routes"], 'todo');
					reportMissingAreas(missingAreasResponse);
					
					renderMap();
					resizeLocations("tick");
					resizeLocations("todo");
					setTimeSlider();			
	 			});	
	 		} 		
	 		
	 		function setTimeSlider() {
	 			var allTickArr = [];
	 			for(var n=0; n<tickLocations.getLayers().length; n++){
					var tickArr = tickLocations.getLayers()[n].options.customTickArr;
					
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
			      min: 1,
			      max: allTickArr.length,
			      slide: function( event, ui ) {
			      	var sliderPos = ui.value;
			      	var selectedDate = sortedAllTickArr[sliderPos];
			     		
			     		var tickLocs = tickLocations.getLayers();
			     		var rtsCt = 0;
			     		junk = []
			     		for(var t=0; t<tickLocs.length; t++){
			     			var thisLoc = tickLocs[t];
			     			var thisLocTicks = thisLoc.options.customTickArr;
			     			var laterThanTicksCt = 0;
			     			for(var i=0; i<thisLocTicks.length; i++){
			     				if(new Date(thisLocTicks[i].date) > selectedDate){
			     					laterThanTicksCt = laterThanTicksCt + 1;
			     				}
			     				else{
			     					rtsCt = rtsCt + 1;
			     					junk.push(thisLocTicks[i])
			     				}
			     			}
			     			var newRadius = thisLocTicks.length - laterThanTicksCt;
			     			$("#time-slider-label").text( selectedDate.getMonth() + " / " + selectedDate.getDay() + " / " + selectedDate.getFullYear()  + " | " + rtsCt + " Ticks")
			     			thisLoc.setRadius(newRadius);	

			     		}
			      }
			   }); 		
	 		}
	 		 		
	 		////
	 		// Area points are the climbing area locations
	 		////
	 		function getAreaPts() {	
	 			return $.ajax({
	  				url: "areas",
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
							setToDoLocationRouteFrequency(route);
						}
						else if(contentType === 'tick'){
							route.routeCategory = "TICK";
							setTickLocationRouteFrequency(route)
						}
				}
			}
			
			function reportMissingAreas(data) {
				var areas = data[0].missingAreas;
				for(var i=0; i<areas.length; i++){
					var area = areas[i];
					$("#issue-box").dialog({
							  title: "Current Data Issues",
							  width: 700, 
							  height: 400,
							  resizable: true,
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
			// @route - a route representing either a tick or a todo 
			////
			function setTickLocationRouteFrequency(route) {	
				var found = false;
					
				// @areaPts 
				for(var n=0; n<areaPts.features.length; n++){
					var currAreaId = areaPts.features[n].properties.id;
					
					// ticks
					if(!areaPts.features[n].properties.customTicksCt){
						areaPts.features[n].properties.customTicksCt = 0;
					}			
					if(!areaPts.features[n].properties.customTicksArr){
						areaPts.features[n].properties.customTicksArr = [];
					}	
					
					if(currAreaId === route.area){						
						areaPts.features[n].properties.customTicksCt = areaPts.features[n].properties.customTicksCt + 1;
						areaPts.features[n].properties.customTicksArr.push(route);
						found = true;
					}
				}
			}

			
			////
			// Set the frequency of todos on locations that will dictate the point size.
			//
			// @route - a route object
			////
			function setToDoLocationRouteFrequency(route) {	
			
				var found = false;
					
				// @areaPts - globally imported in HTML head imports
				for(var n=0; n<areaPts.features.length; n++){
					var currAreaId = areaPts.features[n].properties.id;
					
					// routes
					if(!areaPts.features[n].properties.customRouteArr){
						areaPts.features[n].properties.customRouteArr = [];
					}
					if(!areaPts.features[n].properties.customRouteCt){
						areaPts.features[n].properties.customRouteCt = 0;
					}
					if(!areaPts.features[n].properties.customTradCt){
						areaPts.features[n].properties.customTradCt = 0;
					}
					if(!areaPts.features[n].properties.customSportCt){
						areaPts.features[n].properties.customSportCt = 0;
					}
					if(!areaPts.features[n].properties.customBoulderCt){
						areaPts.features[n].properties.customBoulderCt = 0;
					}
					if(!areaPts.features[n].properties.customAlpineCt){
						areaPts.features[n].properties.customAlpineCt = 0;
					}					
					
					if(currAreaId === route.area){						
						areaPts.features[n].properties.customRouteArr.push(route);
						areaPts.features[n].properties.customRouteCt = areaPts.features[n].properties.customRouteCt + 1;
						
						var type = String(route.type ? String(route.type) : 'n/a').trim();
						if(type.toLowerCase() === "trad"){
							areaPts.features[n].properties.customTradCt = areaPts.features[n].properties.customTradCt + 1;
						}
						else if(type.toLowerCase() === "sport"){
							areaPts.features[n].properties.customSportCt = areaPts.features[n].properties.customSportCt + 1;
						}
						else if(type.toLowerCase() === "boulder"){
							areaPts.features[n].properties.customBoulderCt = areaPts.features[n].properties.customBoulderCt + 1;
						}
						else if(type.toLowerCase() === "alpine"){
							areaPts.features[n].properties.customAlpineCt = areaPts.features[n].properties.customAlpineCt + 1;
						}
						
						found = true;
					}
				}								
			}
			
			////
			// Sets the size of the location points respective to the amount of climbs in that area
			//
			////
			function resizeLocations(contentType) {	
				
				map.eachLayer(function(layer){
					if(layer.feature){
						// customRouteCt is currently ToDo frequency and will take priority over existing area points
						if(layer.feature.properties.customRouteCt > 0){
							var routeCt = layer.feature.properties.customRouteCt;
							layer.setRadius(4 + routeCt);
						}
						//However, if there are also ticks for this area we will duplicate the area point to represent both 
						else if(layer.feature.properties.customTicksCt > 0){
							var tickCt = layer.feature.properties.customTicksCt;
							var tickArr = layer.feature.properties.customTicksArr;
							
							var tickStyle = {
					    		radius: tickCt + 4,
					    		fillColor: "yellow",
					    		stroke: false,
					    		weight: 1,
					    		opacity: 1,
					    		fillOpacity: 0.5,
					    		customTicksCt: layer.feature.properties.customTicksCt,
					    		customTickArr: tickArr
							}
							
							var customCircleMarker = L.CircleMarker.extend({
							   options: { 
							      customTicksCt: 0, 
							      customTickArr: []
							   }
							});
							// The duplication step
							var newFeature = new customCircleMarker(layer.getLatLng(), tickStyle);
        
							tickLocations.addLayer(newFeature);		
							
							// Hover events for new tick location features
							newFeature.on('mouseover', function (e) {
            				var feature = e.target;
            				
            				//////
            				/// TODO: this is really boring. Make this rout info more interesting
            				/////
            				var html = '<div class="tick-info-container">';
								for(var i=0; i<tickArr.length; i++){
									var rt = tickArr[i];
									var date = new Date(rt.date);
									var dateStr = date.getMonth() + "/" + date.getDay() + "/" + date.getFullYear();
									
									var newTickInfo = '<div class="info-content"><b>' + rt.name + '</b> : ' + rt.notes + ' ' + dateStr + '</div>'
									html += newTickInfo;		
								}
								html += "</div>";

							   feature.setStyle({"fillColor":"#E6E600"})
							    			    	
						      //open popup;
							  	popup = L.popup({offset:new L.Point(0,0)})
							   .setLatLng(e.latlng) 
							   .setContent(
							   	'<div class="info-header">' + '<b>' + layer.feature.properties.area + '</b></div>' +
									'<div class="info-content">' + 'You have climbed  ' + '<b>' + feature.options.customTicksCt + '</b> routes here!' + '</div>' +
									'<br/>' + 															
									'<div id="hover-grade-chart"></div>' + html
								)
							   .openOn(map);	
							   
							   // Render charts
					   		var clickBarChart = new BarChart(feature.options.customTickArr, "#hover-grade-chart");	
					   		clickBarChart.build();
					   		
					   		// Fixing the annoying issue when the popup is pushed right after the chart is dynamically added
					   		var popWidth = $(".leaflet-popup").width();
					   		$(".leaflet-popup").css({left: "-"+(popWidth/2)+"px"});

								
								// TODO: Add some more fun hover actions like a chart of all the comments from ticked routes

       					 });
       					 newFeature.on('mouseout', function (e) {
								var feature = e.target;
								feature.setStyle({"fillColor":"yellow"});
       					 });
										
						}
					}	
				});
				
				// Add the new tick features to the map
				if(tickLocations.getLayers().length > 0){
					map.addLayer(tickLocations);
					tickLocations.bringToBack();
				}
			      
			}
				
			
			function renderMap() {
					
					// properties set on each feature of a Leaflet layer object
					function onEachFeature(feature, layer) {
						layer.on({
			            mouseover: hoverAction,
			            mouseout: resetHover,
			            click: featureClickEvent
			            });
					}	
					
					// action to perform when mousing over a feature
					function hoverAction(e) {
					    	var layer = e.target;
					    	
					    	layer.setStyle({"fillColor":"#1A425E"})
					    			    	
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
					
					
					// action to perform when mousing off of a feature 
					function resetHover(e) {  
						var layer = e.target;
						
						layer.setStyle({"fillColor": "#205375"});
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
						}
						if($("#info-box").html().length > 0){
							$("#info-box").html("");
						}
						if($(".info-area-title").text().length > 0){
							$(".info-area-title").remove();
						}
						
					   // Render charts
					   var clickBarChart = new BarChart(layer.feature.properties.customRouteArr, "#click-chart-panel");	
					   clickBarChart.build();	   			   
						
						$("#info-area-title").text(layer.feature.properties.area);
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
							for(var n=0; n<areaPts.features.length; n++){
								var thisAreaId = areaPts.features[n].properties.id;
								if(areaId === thisAreaId){
									areaName = areaPts.features[n].properties.area;
								}
							}
							
							return areaName;
						}
					}
					
					// define the default feature style		
					var areaPtsDefaultStyle = {
					    radius: 0,
					    fillColor: "#205375",
					    stroke: false,
					    weight: 1,
					    opacity: 1,
					    fillOpacity: 0.8
					};				
				
					//add geojson lines with popup and style
					var areaPtsObj = new L.GeoJSON(areaPts, {
							pointToLayer: function (feature, latlng) {
		        				return L.circleMarker(latlng, areaPtsDefaultStyle);
		   				},
							onEachFeature: onEachFeature		
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
						}
						
						// Clear the chart
						if($("#click-chart-panel")){
							$("#click-chart-panel").html("");
						}
					}
					
					// add overlays to the map object	
					map.addLayer(areaPtsObj);
					
					map.fitBounds(areaPtsObj.getBounds());
								
						
					// define the base layer switcher
					var baseMaps = {
						"Outdoors": outdoors,
						"Light": positron,						
						"MapQuest OSM": mqosm,
						"MapQuest Aerial": mqaerial
						};
						
					// define the overlay layer switcher
					var overlays = {
						"To-Do": areaPtsObj,
						"Ticks": tickLocations
						}; 
						
					// adds the layer switcher control
					map.addControl(new L.control.layers(baseMaps,overlays, {"collapsed":false}));
			}

		
			// Initialize
			this.init();
		
		});	
		
})();