import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import LeftSidebar from '../LeftSideBar.jsx';

const mapStateToProps = (state) => {
  return {
    header: state.featureInfo.heading,
    areaInfo: state.featureInfo.areaInfo
  }
}

const LeftSideBarContainer = connect(
  mapStateToProps
)(LeftSidebar)

export default LeftSideBarContainer;
