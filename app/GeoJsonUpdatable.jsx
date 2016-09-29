import React from "react";
import {GeoJson}  from "react-leaflet";

export default class GeoJsonUpdatable extends GeoJson {
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
    }
}

GeoJsonUpdatable.propTypes = {
    data: React.PropTypes.object.isRequired
};
