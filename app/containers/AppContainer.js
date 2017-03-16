import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { filterByRouteType } from '../actions/UserActions';

import AppContainerComponent from '../AppContainer.jsx';

const mapStateToProps = (state) => {
  return {
    //add props to pass to NavBarComponent
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    filterByType: (routeTypeSearchText) => {
      dispatch(filterByRouteType(routeTypeSearchText))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainerComponent)
