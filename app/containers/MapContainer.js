import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MapContainerComponent from '../MapContainer.jsx';

const mapStateToProps = (state) => {
  return {
    info: "test"
  }
}

const MapContainer = connect(
  mapStateToProps
)(MapContainerComponent)

export default MapContainer;
