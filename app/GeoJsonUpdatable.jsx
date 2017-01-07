import React from "react";
import {GeoJSON}  from "react-leaflet";

export default class GeoJsonUpdatable extends GeoJSON {
    componentWillReceiveProps(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.leafletElement.clearLayers();
        }

    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.leafletElement.addData(this.props.data);
        }

        if (prevProps.style !== this.props.style) {
            this.leafletElement.setStyle(this.props.style);
        }

        // if (prevProps.data !== this.props.data) {
        //   console.log('newprops',this.props.data)
        //   map.eachLayer((layer) => {
        //     const newSize = this.props.getLocationSizeBucket(this.props.data.features.properties.customTradCt)
        //     console.log('newsize', newSize)
        //     layer.setRadius(newSize)
          // })
        // }
    }
}

GeoJsonUpdatable.propTypes = {
    data: React.PropTypes.object.isRequired
};
