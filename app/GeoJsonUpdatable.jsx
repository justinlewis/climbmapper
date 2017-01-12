import React from "react";
import {GeoJSON}  from "react-leaflet";

export default class GeoJsonUpdatable extends GeoJSON {
    componentWillReceiveProps(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.leafletElement.clearLayers();
        }

    }

    componentDidUpdate(prevProps) {
      if (typeof this.props.style === 'function'){
      }
        if (prevProps.data !== this.props.data) {
            this.leafletElement.addData(this.props.data);
        }

        if (prevProps.style !== this.props.style) {
          console.log('style', this.props.style)
          console.log('getlocationsize', this.props.getLocationSizeBucket)
            this.leafletElement.setStyle(this.props.style);
        }

        // if (prevProps.data !== this.props.data) {
        //   map.eachLayer((layer) => {
        //     debugger;
        //     const newSize = this.props.getLocationSizeBucket(this.props.data.features[layer].properties.customTradCt)
        //     console.log('newsize', newSize)
        //     layer.setRadius(newSize)
        //   })
        // }
    }
}

GeoJsonUpdatable.propTypes = {
    data: React.PropTypes.object.isRequired
};
