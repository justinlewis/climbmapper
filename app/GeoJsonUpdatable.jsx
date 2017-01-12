import React from "react";
import {GeoJSON}  from "react-leaflet";

export default class GeoJsonUpdatable extends GeoJSON {
    componentWillReceiveProps(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.leafletElement.clearLayers();
        }

    }

    componentDidUpdate(prevProps) {
      // debugger;
      var that = this;

      var map = this.leafletElement;

      if (typeof this.props.style === 'function'){
      }
        if (prevProps.data !== this.props.data) {
            map.addData(this.props.data);
        }

        if (prevProps.style !== this.props.style) {
          console.log('style', this.props.style)
          console.log('getlocationsize', this.props.getLocationSizeBucket)
            map.setStyle(this.props.style);
        }

        if (prevProps.data !== this.props.data) {
          if(map){
            map.eachLayer((layer) => {
              // debugger;
              if(layer.feature){
                const newSize = that.props.getLocationSizeBucket(layer.feature.properties.customTradCt)
                console.log('newsize', newSize)
                layer.setRadius(newSize)
              }
            });
          }
        }
    }
}

GeoJsonUpdatable.propTypes = {
    data: React.PropTypes.object.isRequired
};
