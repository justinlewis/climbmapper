import React from 'react';
var ReactDOM = require('react-dom');

class MapComponent extends React.Component {
    constructor(props){
		    super(props);

        this.baseMaps = {
          positron : new L.tileLayer.provider('CartoDB.Positron'),
          outdoors : new L.tileLayer.provider('Thunderforest.Outdoors'),
          mqosm : new L.tileLayer.provider('MapQuestOpen'),
          mqaerial : new L.tileLayer.provider('MapQuestOpen.Aerial'),
          darkmater : new L.tileLayer.provider('CartoDB.DarkMatter')
        };
    }

    componentDidMount() {

         var map = this.map = L.map(ReactDOM.findDOMNode(this), {
           //center: new L.LatLng(39.7789912112384, -465.47149658203125),
           zoom: 9,
           zoomAnimation: false,
           layers: [this.baseMaps.positron],
           zoomControl: false
         });

         new L.Control.Zoom({ position: 'topright' }).addTo(map);

         map.on('click', this.onMapClick);
         map.fitWorld();  // TODO: Remove me later
     }

     componentWillUnmount() {
         this.map.off('click', this.onMapClick);
         this.map = null;
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

        console.log("map has been clicked")
     }

    render () {
  		return(
  	    	<div id="map"></div>
  		);
    }
}

export default MapComponent;
