import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { filterByRouteType } from '../actions/UserActions';

import NavBarComponent from '../NavBar.jsx';

const mapStateToProps = (state) => {
  return {
    info: "test"
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    filterByType: (routeTypeSearchText) => {
      dispatch(filterByRouteType(routeTypeSearchText))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBarComponent)
