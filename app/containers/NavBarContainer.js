import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { filterByRouteType } from '../actions/UserActions';

import NavBarComponent from '../NavBarContainer.jsx';

const mapStateToProps = (state) => {
  return {
    //add props to pass to NavBarComponent
  }
}

export default connect(mapStateToProps)(NavBarComponent)
