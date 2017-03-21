import React from "react";
import {GeoJSON}  from "react-leaflet";

export default class GeoJsonUpdatable extends GeoJSON {
    componentWillReceiveProps(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.leafletElement.clearLayers();
        }

    }

    componentDidUpdate(prevProps) {
      var map = this.leafletElement;

      if (prevProps.data !== this.props.data) {
          map.addData(this.props.data);
      }

      if (prevProps.style !== this.props.style) {
          map.setStyle(this.props.style);
      }

      // if prev and new routeType === "ALL" we will assume it's the initial map load
      if(prevProps.routeType.routeType === "ALL" && this.props.routeType.routeType === "ALL"){
        this.resizeLocations(this.props.routeType.routeType)
      }
      else if (prevProps.routeType !== this.props.routeType) {
        this.resizeLocations(this.props.routeType.routeType)
      }
    }

    resizeLocations(filter) {
       this.leafletElement.eachLayer((layer) => {
         if(layer.feature){
           layer.setRadius(0);
           if(filter === 'ALL'){
             if(layer.feature.properties.customRouteCt > 0){
               var routeCt = this.props.getLocationSizeBucket(layer.feature.properties.customRouteCt);
               layer.setRadius(routeCt);
             }

             if(layer.feature.properties.customTicksCt > 0){
               var ticksCt = this.props.getLocationSizeBucket(layer.feature.properties.customTicksCt);
               layer.setRadius(ticksCt);
             }

           }
           else if(filter === 'TRAD'){
             if(layer.feature.properties.customTradCt > 0){
               var routeCt = this.props.getLocationSizeBucket(layer.feature.properties.customTradCt);
               layer.setRadius(routeCt);
             }
           }
           else if(filter === 'SPORT'){
             if(layer.feature.properties.customSportCt > 0){
               var routeCt = this.props.getLocationSizeBucket(layer.feature.properties.customSportCt);
               layer.setRadius(routeCt);
             }
           }
           else if(filter === 'BOULDER'){
             if(layer.feature.properties.customBoulderCt > 0){
               var routeCt = this.props.getLocationSizeBucket(layer.feature.properties.customBoulderCt);
               layer.setRadius(routeCt);
             }
           }
           else if(filter === 'ALPINE'){
             if(layer.feature.properties.customAlpineCt > 0){
               var routeCt = this.props.getLocationSizeBucket(layer.feature.properties.customAlpineCt);
               layer.setRadius(routeCt);
             }
           }
         }
       })
     }
}

GeoJsonUpdatable.propTypes = {
    data: React.PropTypes.object.isRequired
};
