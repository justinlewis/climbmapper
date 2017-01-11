import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import LeftSidebar from '../LeftSidebar.jsx';

const mapStateToProps = (state) => {
  return {
    info: "test"
  }
}



const LeftSideBarContainer = connect(
  mapStateToProps
)(LeftSidebar)

export default LeftSideBarContainer;
