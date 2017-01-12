import React from 'react';
var ReactDOM = require('react-dom');

import { Map,
  Marker,
  Popup,
  TileLayer,
  Circle,
  CircleMarker,
  LayersControl,
  FeatureGroup,
  GeoJSON,
  ZoomControl } from 'react-leaflet';
import GeoJsonUpdatable from "./GeoJsonUpdatable.jsx";
import toDoAreaPts from './utils/GeoJsonToDoArea.js';
import toDoCragPts from './utils/GeoJsonToDoCrag.js';
import tickAreaPts from './utils/GeoJsonTick.js';
import { setFeatureInfo, hoverFeatureInfo } from './actions/MapActions.js';


import BarChart from './BarChart.jsx';
// import LineChart from './charts/LineChart.js';
// import PieChart from './charts/PieChart.js';
// import RouteHeightPieChart from './charts/RouteHeightPieChart.js';



const TODOFILL = "#0a4958";
const CRAGFILL = "orange";
const TICKFILL = "#505050";
const SIMPLEAREAFILL = "red";
const SIMPLECRAGFILL = "orange";
const TODOFILLHOVER = "#138DA9";
const CRAGFILLHOVER = "#878787";
const TICKFILLHOVER = "#878787";
const TICKROUTETYPE = "TICK";
const TODOROUTETYPE = "TODO";

var routeTypeFilter = 'ALL'

var areaTodoPtsDefaultStyle = {
    radius: 0,
    fillColor: TODOFILL,
    stroke: false,
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
}

const areaTickPtsDefaultStyle = {
    radius: 0,
    fillColor: TICKFILL,
    stroke: false,
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
}

const allAreaPtsDefaultStyle = {
    radius: 4,
    fillColor: SIMPLEAREAFILL,
    stroke: false,
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

const allCragPtsDefaultStyle = {
    radius: 4,
    fillColor: SIMPLECRAGFILL,
    stroke: false,
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

class MapComponent extends React.Component {
    constructor(props){
		    super(props);

        this.todoAreaPtsCache = null;
        this.todoCragPtsCache = null;
        this.tickAreaPtsCache = null;

        this.state = {
          lat : 39.73,
          lng : -105,
          zoom : 3,
          todoAreaPts : toDoAreaPts,
          todoCragPts : toDoCragPts,
          tickAreaPts : tickAreaPts,
          crags : null,
          areas : null,
          ticks : null,
          todos : null,
          todoLayerStyle : areaTodoPtsDefaultStyle,
          tickLayerStyle : areaTickPtsDefaultStyle
        };

        this.setTodoAreaPtsCache = function(areas) {
          this.todoAreaPtsCache = areas;
        }

        this.getTodoAreaPtsCache = function() {
          return this.todoAreaPtsCache;
        }

        this.setTickAreaPtsCache = function(areas) {
          this.tickAreaPtsCache = areas;
        }

        this.getTickAreaPtsCache = function() {
          return this.tickAreaPtsCache;
        }
    }

    componentWillReceiveProps() {

    }

    componentDidMount() {
    		this.toDoAreaReq = $.get("todoareas", function (result) {
    			this.setTodoAreaPtsCache(result);
    		}.bind(this), "json");


    		this.toDoCragReq = $.get("todocrags", function (result) {
    			this.setState({
    				todoCragPts: result
    			});
    		}.bind(this), "json");


    		this.tickAreaReq = $.get("tickareas", function (result) {
    			this.setTickAreaPtsCache(result);
    			this.setTimeSlider();
    		}.bind(this), "json");


    		this.cragsReq = $.get("crags", function (result) {
    			this.setState({
    				crags: result
    			});
    		}.bind(this), "json");


    		this.areasReq = $.get("areas", function (result) {
    			this.setState({
    				areas: result
    			});

    			this.setSearchBar(this.state.areas.features);
    		}.bind(this), "json");


    		this.ticksReq = $.get("ticks", function (result) {
    			this.setState({
    				    ticks: result
    			});

          this.processRoutes(this.state.ticks["routes"], TICKROUTETYPE);
    		}.bind(this), "json");


    		this.todosReq = $.get("todos", function (result) {
    				this.setState({
    				      todos: result
    				});

            this.processRoutes(this.state.todos["routes"], TODOROUTETYPE);
    		}.bind(this), "json");


    		// this.missingAreasReq = $.get("missingareas", function (result) {
        //
    		// 	this.setState({
    		// 		missingareas: result
    		// 	});
        //
    		// 	reportMissingAreas(this.state.missingareas);
        //
    		// }.bind(this), "json");


        // var areaTodoPtsDefaultStyle = this.getTodoStyle(feature);

        // var getTodoStyle = function(test, test2) {
        //   return {
        //       radius: getLocationSizeBucket(layer),
        //       fillColor: "#0a4958",
        //       stroke: false,
        //       weight: 1,
        //       opacity: 1,
        //       fillOpacity: 0.8
        //   }
        // }

    		////
    		// Process route data
    		// content type can be 'TODO' or 'TICK'
    		////
    		this.processRoutes = function(routesArr, contentType) {
    				for(var rtI=0; rtI<routesArr.length; rtI++){
    					var route = routesArr[rtI];

    					if(contentType === TODOROUTETYPE){
    						route.routeCategory = TODOROUTETYPE;
    						this.setToDoLocationRouteAttributes(route);
    						this.setCragLocationRouteAttributes(route);
    					}
    					else if(contentType === TICKROUTETYPE){
    						route.routeCategory = TICKROUTETYPE;
    						this.setTickLocationRouteAttributes(route);
    					}
    				}

    				this.setToDoLocationRouteFrequency();
    				this.setCragLocationRouteFrequency();
    				this.setTickLocationRouteFrequency();
    		}


    		////
    		// Set the types (trad, sport, boulder, etc...) and the route tracking array on the location objects
    		//
    		////
    		this.setToDoLocationRouteAttributes = function(route) {

    			// @todoAreaPts
          let todoAreaPts = this.getTodoAreaPtsCache();
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
    		// Set the types (trad, sport, boulder, etc...) and the route tracking array on the location objects
    		//
    		////
    		this.setCragLocationRouteAttributes = function(route) {

    			if(route.crag){
    				// @todoCragPts
            let todoCragPts = this.state.todoCragPts;
    				for(let n=0; n<todoCragPts.features.length; n++){
    					var currAreaId = todoCragPts.features[n].properties.id;

    					if(!todoCragPts.features[n].properties.customRouteArr){
    						todoCragPts.features[n].properties.customRouteArr = [];
    					}
    					if(!todoCragPts.features[n].properties.customTradCt){
    						todoCragPts.features[n].properties.customTradCt = 0;
    					}
    					if(!todoCragPts.features[n].properties.customSportCt){
    						todoCragPts.features[n].properties.customSportCt = 0;
    					}
    					if(!todoCragPts.features[n].properties.customBoulderCt){
    						todoCragPts.features[n].properties.customBoulderCt = 0;
    					}
    					if(!todoCragPts.features[n].properties.customAlpineCt){
    						todoCragPts.features[n].properties.customAlpineCt = 0;
    					}

    					if(currAreaId === route.crag){
    						todoCragPts.features[n].properties.customRouteArr.push(route);

    						var type = String(route.type ? String(route.type) : 'n/a').trim();

    						if(type.toLowerCase() === "trad"){
    							todoCragPts.features[n].properties.customTradCt = todoCragPts.features[n].properties.customTradCt + 1;
    						}
    						else if(type.toLowerCase() === "sport"){
    							todoCragPts.features[n].properties.customSportCt = todoCragPts.features[n].properties.customSportCt + 1;
    						}
    						else if(type.toLowerCase() === "boulder"){
    							todoCragPts.features[n].properties.customBoulderCt = todoCragPts.features[n].properties.customBoulderCt + 1;
    						}
    						else if(type.toLowerCase() === "alpine"){
    							todoCragPts.features[n].properties.customAlpineCt = todoCragPts.features[n].properties.customAlpineCt + 1;
    						}
    					}
    				}
    			}
    		}


    		////
    		// Sets custom attributes of ticks on locations.
    		//
    		// @route - a route representing either a tick or a todo
    		////
    		this.setTickLocationRouteAttributes = function(route) {

    			// @tickAreaPts
          let tickAreaPts = this.getTickAreaPtsCache();
    			for(let n=0; n<tickAreaPts.features.length; n++){
    				var currAreaId = tickAreaPts.features[n].properties.id;

    				if(!tickAreaPts.features[n].properties.customTicksArr){
    					tickAreaPts.features[n].properties.customTicksArr = [];
    				}
    				if(!tickAreaPts.features[n].properties.customTradCt){
    					tickAreaPts.features[n].properties.customTradCt = 0;
    				}
    				if(!tickAreaPts.features[n].properties.customSportCt){
    					tickAreaPts.features[n].properties.customSportCt = 0;
    				}
    				if(!tickAreaPts.features[n].properties.customBoulderCt){
    					tickAreaPts.features[n].properties.customBoulderCt = 0;
    				}
    				if(!tickAreaPts.features[n].properties.customAlpineCt){
    					tickAreaPts.features[n].properties.customAlpineCt = 0;
    				}

    				if(currAreaId === route.area){
    					var type = String(route.type ? String(route.type) : 'n/a').trim();
    					if(type.toLowerCase() === "trad"){
    						tickAreaPts.features[n].properties.customTradCt = tickAreaPts.features[n].properties.customTradCt + 1;
    					}
    					else if(type.toLowerCase() === "sport"){
    						tickAreaPts.features[n].properties.customSportCt = tickAreaPts.features[n].properties.customSportCt + 1;
    					}
    					else if(type.toLowerCase() === "boulder"){
    						tickAreaPts.features[n].properties.customBoulderCt = tickAreaPts.features[n].properties.customBoulderCt + 1;
    					}
    					else if(type.toLowerCase() === "alpine"){
    						tickAreaPts.features[n].properties.customAlpineCt = tickAreaPts.features[n].properties.customAlpineCt + 1;
    					}
    				}


    				if(currAreaId === route.area){
    					tickAreaPts.features[n].properties.customTicksArr.push(route);
    				}
    			}
    		}

    		////
    		// Set the frequency of ticks on locations that will dictate the point size.
    		//
    		////
    		this.setTickLocationRouteFrequency = function() {

    			// @tickAreaPts
          let cachedTickAreaPts = this.getTickAreaPtsCache();
    			for(let n=0; n<cachedTickAreaPts.features.length; n++){
    				var currAreaId = cachedTickAreaPts.features[n].properties.id;

    				cachedTickAreaPts.features[n].properties.customTicksCt = 0;

    				cachedTickAreaPts.features[n].properties.customTicksCt = cachedTickAreaPts.features[n].properties.count;
    			}

          this.setState({
            tickAreaPts: cachedTickAreaPts,
            tickLayerStyle : getModifiedStyle.bind(this, 'ALL', areaTickPtsDefaultStyle)
          });
    		}


    		////
    		// Set the frequency of todos on locations that will dictate the point size.
    		//
    		////
    		this.setToDoLocationRouteFrequency = function() {

          var cachedTodoAreaPts = this.getTodoAreaPtsCache();
    			for(var n=0; n<cachedTodoAreaPts.features.length; n++){
    				var currAreaId = cachedTodoAreaPts.features[n].properties.id;

    				// create or reset var to ensure a clean ct
    				cachedTodoAreaPts.features[n].properties.customRouteCt = 0;

    				cachedTodoAreaPts.features[n].properties.customRouteCt = cachedTodoAreaPts.features[n].properties.count;
    			}
          this.setState({
            todoAreaPts: cachedTodoAreaPts,
            todoLayerStyle : getModifiedStyle.bind('ALL', areaTodoPtsDefaultStyle)
          });
    		}


        // getModifiedStyle.bind(null, this, 'ALL')
        function getModifiedStyle(filter, currentStyleObj, feature) {
            var radiusForType = 10;
            switch (filter) {
              case 'ALL':
                // customRouteCt is currently ToDo frequency and will take priority over existing area points
                if(feature.properties.customRouteCt > 0){
                  radiusForType = this.getLocationSizeBucket(feature.properties.customRouteCt);
                }

                if(feature.properties.customTicksCt > 0){
                  radiusForType = this.getLocationSizeBucket(feature.properties.customTicksCt);
                }
                break;
              case 'TRAD':
                if(feature.properties.customTradCt > 0){
                  radiusForType = this.getLocationSizeBucket(feature.properties.customTradCt);
                }
                break;
              case 'SPORT':
                if(layer.feature.properties.customSportCt > 0){
                  radiusForType = this.getLocationSizeBucket(feature.properties.customSportCt);
                }
                break;
              case 'BOULDER':
                if(layer.feature.properties.customBoulderCt > 0){
                  radiusForType = this.getLocationSizeBucket(feature.properties.customBoulderCt);
                }
                break;
              case 'ALPINE':
                if(layer.feature.properties.customAlpineCt > 0){
                  radiusForType = this.getLocationSizeBucket(feature.properties.customAlpineCt);
                }
                break;
            }
            currentStyleObj.radius = radiusForType;

            return currentStyleObj;
        }


    		////
    		// Set the frequency of crags on locations that will dictate the point size.
    		//
    		////
    		this.setCragLocationRouteFrequency = function() {

    			// @todoCragPts
          let todoCragPts = this.state.todoCragPts;
    			for(let n=0; n<todoCragPts.features.length; n++){
    				var currAreaId = todoCragPts.features[n].properties.id;

    				// create or reset var to ensure a clean ct
    				todoCragPts.features[n].properties.customRouteCt = 0;

    				todoCragPts.features[n].properties.customRouteCt = todoCragPts.features[n].properties.count;
    			}
    		}


        ////
        // Sets the size of the location points respective to the amount of climbs in that area
        // TODO: better check for ticks vs. todos
        //
        // NOTE: only resizes areas that are currently added to the map.
        //
        // @param filter - a filter keyword that filters the radius by route type.
        ////




        this.setTimeSlider = function() {
          var allTickArr = [];
          for(var n=0; n<this.state.tickAreaPts.features.length; n++){
            var tickArr = this.state.tickAreaPts.features[n].properties.customTicksArr;

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
              max: allTickArr.length-1,
              create: function( event, ui ) {
                  // A silly hack because the slider is appending a ghostly empty <p> element to my label. No time to look deeper now.
                  if($("#time-slider-label").next("p").text().trim().length === 0){
                    $("#time-slider-label").next("p").remove();
                  }
              },
              slide: function( event, ui ) {
                var sliderPos = ui.value;
                var selectedDate = sortedAllTickArr[sliderPos];

                if($("#tick-time-chart")){
                  $("#tick-time-chart").remove()
                }

                if(selectedDate){

                  if(!$("#chart-row-1").is(':visible')){
                $("#chart-row-1").show();
              }

                $("#chart-row-1").append('<div id="tick-time-chart" ></div>');
                var lineChart = new LineChart(tickAreaPts.features, selectedDate, "#tick-time-chart", $("#tick-time-chart").parent().width());
                lineChart.build();

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

                  var newRadius = this.getLocationSizeBucket(thisLocTicks.length - laterThanTicksCt);

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
              },
              stop: function( event, ui ) {
                setTimeout(function(){
                  $("#time-slider-label").fadeOut(400);
                  if($("#tick-time-chart:visible").length > 0){
                    $("#chart-row-1").fadeOut(400);
                    $("#time-time-chart").remove();
                  }
                }, 30000);

              }
           });
        }


        this.setSearchBar = function(areas) {
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
            for(var i=0; i<areas.length; i++){
              var areaName = areas[i].properties.area;
              var geom = areas[i].geometry.coordinates;
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

      }

     componentWillUnmount() {
     	  this.toDoAreaReq.abort();
     	  this.toDoCragReq.abort();
     	  this.tickAreaReq.abort();
     	  this.cragsReq.abort();
     	  this.areasReq.abort();
     	  this.ticksReq.abort();
     	  this.todosReq.abort();
     	  this.missingAreasReq.abort();

        // this.map.off('click', this.onMapClick);
        // this.map = null;
     }

     onMapClick() {
         // Clear the info box
        //  if($("#info-box-content").text().length > 0){
        //    $("#info-box-content").html("");
        //  }
        //  if($(".info-area-title").text().length > 0){
        //    $(".info-area-title").text("");
        //  }
        //  if($("#info-container").is(':visible')){
        //    $("#info-container").hide();
        //  }
         //
        //  if(drawnItems){
        //    drawnItems.eachLayer(function(layer){drawnItems.removeLayer(layer)});
         //
        //    disableEditModeInToolbar();
        //  }
     }
     getLocationSizeBucket(rtCount) {
       if(rtCount < 1){
         return 0
       }
       else if(rtCount < 3){
         return 3
       }
       else if(rtCount >= 3 && rtCount < 5){
         return 4
       }
       else if(rtCount >= 5 && rtCount < 7){
         return 6
       }
       else if(rtCount >= 7 && rtCount < 10){
         return 9
       }
       else if(rtCount >= 10 && rtCount < 20){
         return 15
       }
       else if(rtCount >= 20 && rtCount < 30){
         return 20
       }
       else if(rtCount >= 30 && rtCount < 40){
         return 25
       }
       else if(rtCount >= 40 && rtCount < 50){
         return 30
       }
       else if(rtCount >= 50 && rtCount < 60){
         return 35
       }
       else if(rtCount >= 60 && rtCount < 70){
         return 40
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


    render () {
        const { store } = this.context;
        var that = this;
        const position = [this.state.lat, this.state.lng];

        function onEachTodoFeature(thisRef, feature, layer) {
      	   layer.on({
              mouseover: todoHoverAction,
              mouseout: resetAreaHover,
              click: featureClickEvent
            });
        }

        function onEachTickFeature(thisRef, feature, layer) {
           layer.on({
              mouseover: tickHoverAction,
              mouseout: resetAreaHover,
              click: featureClickEvent
            });
        }

        function resetAreaHover(e) {
          var layer = e.target;
          resetFeatureColor(layer);
          // removeAllCharts();
        }

        function resetFeatureColor(layer) {
          if(layer.feature.properties.areatype === "TODO") {
              layer.setStyle({"fillColor": TODOFILL});
            }
            else if(layer.feature.properties.areatype === "CRAG"){
              layer.setStyle({"fillColor": CRAGFILL});
            }
            else if(layer.feature.properties.areatype === "TICK"){
              layer.setStyle({"fillColor": TICKFILL});
            }
        }


        ////
        // click event for areas
        ////
        function featureClickEvent(e) {

          var layer = e.target;

          // if(!$("#info-container").is(':visible')){
          //   $("#info-container").show();
          // }
          //
          // if($(".info-ul").length > 0){
          //   $(".info-ul").remove();
          // }
          //
          // if($(".info-area-title").text().length > 0){
          //   $(".info-area-title").remove();
          // }
          //
          // // This is a really weak check. we need to make sure this is
          // var subHeading = "";
          // if(layer.feature.properties.customTicksArr){
          //   var layers = layer.feature.properties.customTicksArr;
          //   subHeading = "Ticks";
          // }
          // else {
          //   var layers = layer.feature.properties.customRouteArr;
          //   subHeading = "ToDo";
          // }
          //
          // // Sort the array by the orderIndex property
          // function compare(a,b) {
          //   if (a.difficultyindex < b.difficultyindex)
          //      return -1;
          //   if (a.difficultyindex > b.difficultyindex)
          //     return 1;
          //   return 0;
          // }
          // layers.sort(compare);
          //
          // $("#info-area-title").text(subHeading+": "+layer.feature.properties.area);
          //
          // for(var l=0; l<layers.length; l++){
          //
          //     if(routeTypeFilter === "ALL" || layers[l].type.toUpperCase() === routeTypeFilter ){
          //     var name = String(layers[l].name ? layers[l].name : 'n/a');
          //     var type = String(layers[l].type ? layers[l].type :"n/a");
          //     if(type.toUpperCase() === "TRAD" || type.toUpperCase() === "SPORT" || type.toUpperCase() === "ALPINE"){
          //       var rating = String(layers[l].ropegrade ? layers[l].ropegrade : 'n/a');
          //     }
          //     else{
          //       var rating = String(layers[l].bouldergrade ? layers[l].bouldergrade : 'n/a');
          //     }
          //     var pitches = String(layers[l].pitches ? layers[l].pitches :"n/a");
          //     var stars = String(layers[l].stars ? layers[l].stars :"n/a");
          //     var starVotes = String(layers[l].starVotes ? layers[l].starVotes :"n/a");
          //     var url = String(layers[l].url ? layers[l].url :"n/a");
          //     var geoLoc = String(layers[l].location ? layers[l].location :"n/a");
          //     var crag = getLocationName(layers[l].area) ;
          //     var imgMed = String(layers[l].imgMed ? layers[l].imgMed :"n/a");
          //     var imgMed = String(layers[l].imgMed ? layers[l].imgMed :"n/a");
          //
          //     var routeHTMLStr = "<ul class='info-ul'>";
          //     routeHTMLStr += "<li class='info-text'><h3 class='info-header'><u>" +  name + "</u></h3></li>";
          //     routeHTMLStr += "<li class='info-text'><i>Rating:  </i>" +  rating + "</li>";
          //     routeHTMLStr += "<li class='info-text'><i>Type:  </i>" +  type + "</li>";
          //     routeHTMLStr += "<li class='info-text'><i>Pitches:  </i>" +  pitches + "</li>";
          //     routeHTMLStr += "<li class='info-text'><i>Stars:  </i>" +  stars + " out of "+ starVotes + " votes</li>";
          //     routeHTMLStr += "<li class='info-text'><i>Crag:  </i>" +  crag + "</li>";
          //     routeHTMLStr += "<li class='info-text'><a class='info-link' target='_blank' href='"+  url + "'>See it on Mountain Project</a></li>";
          //     // routeHTMLStr += "<li class='info-link'> <img class='info-image' src=http://mountainproject.com"+ imgMed +" alt='Climbing Img'> </li>";
          //     routeHTMLStr += "</ul>";
          //
          //     $("#info-box").append(routeHTMLStr);
          //   }
          //
          // }

          // function getLocationName(areaId) {
          //   var areaName = "";
          //   for(var n=0; n<todoAreaPts.features.length; n++){
          //     var thisAreaId = todoAreaPts.features[n].properties.id;
          //     if(areaId === thisAreaId){
          //       areaName = todoAreaPts.features[n].properties.area;
          //     }
          //   }
          //
          //   return areaName;
          // }
        }


        function tickHoverAction(e) {
              var layer = e.target;

              // if($("#tick-time-chart")){
              //   $("#tick-time-chart").remove()
              // }

              layer.setStyle({"fillColor":TICKFILLHOVER});

              // $("#left-sidebar-heading-info-container").show();
              // $("#left-sidebar-heading").text(layer.feature.properties.area);
              //
              // //////
              // /// TODO: this is really boring. Make this rout info more interesting
              // /////
              // if(layer.feature.properties.customTicksArr){
              //   var html = '<div class="tick-info-container">';
              // for(var i=0; i<layer.feature.properties.customTicksArr.length; i++){
              //   var rt = layer.feature.properties.customTicksArr[i];
              //   var date = new Date(rt.date);
              //   var dateStr = date.getMonth() + "/" + date.getDay() + "/" + date.getFullYear();
              //
              //   var newTickInfo = '<div class="info-content"><b>' + rt.name + '</b> : ' + rt.notes + ' ' + dateStr + '</div>'
              //   html += newTickInfo;
              // }
              // html += "</div>";
              //
              //  $("#hover-text-info-container").html('<p class="info-content"><b>' + layer.feature.properties.customTicksCt + '</b> Ticks</p>')
              //
              //  if(!$("#chart-row-1").is(':visible')){
              //   $("#chart-row-1").show();
              // }
              // if(!$("#chart-row-2").is(':visible')){
              //   $("#chart-row-2").show();
              // }
              //
              //  $("#chart-row-1").append('<div id="tick-grade-chart" ></div>');
              // var hoverBarChart = new BarChart(getRouteArrayByType(layer.feature.properties.customTicksArr, routeTypeFilter), "#tick-grade-chart", $("#tick-grade-chart").parent().width());
              // hoverBarChart.build();
              //
              // $("#chart-row-2").append('<div id="tick-type-chart" ></div> <div id="tick-height-chart" ></div>');
              // new PieChart(layer.feature, "#tick-type-chart", $("#tick-type-chart").parent().width()/2, routeTypeFilter);
              // new RouteHeightPieChart(getRouteArrayByType(layer.feature.properties.customTicksArr, routeTypeFilter), "#tick-height-chart", $("#tick-height-chart").parent().width()/2);

            // TODO: Add some more fun hover actions like a chart of all the comments from ticked routes
          // }
        }


        // action to perform when mousing over a feature
        function todoHoverAction(e) {
            var layer = e.target;
            store.dispatch(hoverFeatureInfo(layer))
            // removeAllCharts();

          //   if($("#tick-time-chart")){
          //       $("#tick-time-chart").remove()
          //     }
          //
            if(layer.feature.properties.areatype === "TODO") {
              layer.setStyle({"fillColor": TODOFILLHOVER});
            }
            else if(layer.feature.properties.areatype === "CRAG"){
              layer.setStyle({"fillColor": CRAGFILLHOVER});
            }
          //
          // $("#left-sidebar-heading-info-container").show();
          //   $("#left-sidebar-heading").text(layer.feature.properties.area);
          //
          //   var routeCountPropertyName = "customRouteCt"; // Default
          //   if(routeTypeFilter === "ALL"){
          //     routeCountPropertyName = "customRouteCt";
          //   }
          //   else if(routeTypeFilter === "TRAD"){
          //     routeCountPropertyName = "                       Ct";
          //   }
          //   else if(routeTypeFilter === "SPORT"){
          //     routeCountPropertyName = "customSportCt";
          //   }
          //   else if(routeTypeFilter === "BOULDER"){
          //     routeCountPropertyName = "customBoulderCt";
          //   }
          //   else if(routeTypeFilter === "ALPINE"){
          //     routeCountPropertyName = "customAlpineCt";
          //   }
          //
          //   if( layer.feature.properties[routeCountPropertyName] ){
          //     $("#hover-text-info-container").html('<p class="info-content"><b>' + layer.feature.properties[routeCountPropertyName] + '</b> ToDos</p>');
          //
          //   if(!$("#chart-row-1").is(':visible')){
          //     $("#chart-row-1").show();
          //   }
          //   if(!$("#chart-row-2").is(':visible')){
          //     $("#chart-row-2").show();
          //   }
          //
          //   $("#chart-row-1").append('<div id="todo-grade-chart" ></div>');
              // var todoBarChart = new BarChart(that.getRouteArrayByType(layer.feature.properties.customRouteArr, routeTypeFilter), "#todo-grade-chart", $("#todo-grade-chart").parent().width());
              // todoBarChart.build();
          //
          //     $("#chart-row-2").append('<div id="todo-type-chart" ></div> <div id="todo-height-chart" ></div>');
          //   new PieChart(layer.feature, "#todo-type-chart", $("#todo-type-chart").parent().width()/2, routeTypeFilter);
          //   new RouteHeightPieChart(getRouteArrayByType(layer.feature.properties.customRouteArr, routeTypeFilter), "#todo-height-chart", $("#todo-height-chart").parent().width()/2);
          // }
        }

        function areaTodoPtsPointToLayer (feature, latlng) {
            return L.circleMarker(latlng, allAreaPtsDefaultStyle);
        }

        function cragTodoPtsPointToLayer (feature, latlng) {
            return L.circleMarker(latlng, allCragPtsDefaultStyle);
        }

        function areaTickPtsPointToLayer (feature, latlng) {
            return L.circleMarker(latlng, areaTickPtsDefaultStyle);
        }

        function areaPtsPointToLayer (feature, latlng) {
            return L.circleMarker(latlng, allAreaPtsDefaultStyle);
        }

        function cragPtsPointToLayer (feature, latlng) {
            return L.circleMarker(latlng, allCragPtsDefaultStyle);
        }
         function filterByRouteType(feature) {
           if (feature.properties.customTradCt === 0) {
             return false
           } else if (feature.properties.customTradCt > 0) {
             return true
           }
         }

        // let toDoAreaPts = this.state.todoAreaPts
        // if (this.props.routeType.routeType === 'ALL') {
        //   toDoAreaPts = this.state.todoAreaPts
        // } else if (this.props.routeType.routeType === 'TRAD') {
        //   let tradRouteCount = { features: this.state.todoAreaPts.features.filter(filterByRouteType) }
        //   toDoAreaPts = Object.assign(toDoAreaPts, tradRouteCount)
        // }

  		return(
        <Map center={position} zoom={this.state.zoom} zoomControl={false} >

          <ZoomControl position={"topright"}></ZoomControl>

          <LayersControl position='topright'>
            <LayersControl.BaseLayer name='OSM Light' checked={true}>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url='http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name='OSM'>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
              />
            </LayersControl.BaseLayer>

            <LayersControl.Overlay name='To-Do Areas' checked={true}>
              <GeoJsonUpdatable
                ref={'map'} //TODO: remove if we use props
                data={this.state.todoAreaPts}
                style={this.state.todoLayerStyle}
                routeType={this.props.routeType}
                resizeLocation={() =>this.resizeLocations().bind(this)}
                getLocationSizeBucket={(filter) => this.getLocationSizeBucket(filter)}
                onEachFeature={onEachTodoFeature.bind(null, this)}
                pointToLayer={areaTodoPtsPointToLayer}
              >
              </GeoJsonUpdatable>
            </LayersControl.Overlay>

            {/* <LayersControl.Overlay name='To-Do Crags' checked={false}>
              <GeoJsonUpdatable data={this.state.todoCragPts} style={allCragPtsDefaultStyle} onEachFeature={onEachFeature.bind(null, this)} ></GeoJsonUpdatable>
            </LayersControl.Overlay> */}

            <LayersControl.Overlay name='Tick Areas' checked={false}>
              <GeoJsonUpdatable
                data={this.state.tickAreaPts}
                style={this.state.tickLayerStyle}
                routeType={this.props.routeType}
                resizeLocation={() =>this.resizeLocations().bind(this)}
                getLocationSizeBucket={(filter) => this.getLocationSizeBucket(filter)}
                onEachFeature={onEachTickFeature.bind(null, this)}
                pointToLayer={areaTickPtsPointToLayer} >
              </GeoJsonUpdatable>
            </LayersControl.Overlay>

            {/* <LayersControl.Overlay name='All Areas (editable)' checked={false}>
              <GeoJsonUpdatable data={this.state.areas} style={areaTodoPtsDefaultStyle} onEachFeature={onEachFeature.bind(null, this)} ></GeoJsonUpdatable>
            </LayersControl.Overlay>

            <LayersControl.Overlay name='All Crags (editable)' checked={false}>
              <GeoJsonUpdatable data={this.state.crags} style={allAreaPtsDefaultStyle} onEachFeature={onEachFeature.bind(null, this)} ></GeoJsonUpdatable>
            </LayersControl.Overlay> */}

          </LayersControl>

        </Map>
  		);
    }
}
MapComponent.contextTypes = {
  store: React.PropTypes.object
}

// window.ReactDOM.render(<SimpleExample />, document.getElementById('map'));
export default MapComponent;
