import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import NavBarComponent from '../NavBar.jsx';

const mapStateToProps = (state) => {
  return {
    info: "test"
  }
}

const NavBarContainer = connect(
  mapStateToProps
)(NavBarComponent)

export default NavBarContainer;
