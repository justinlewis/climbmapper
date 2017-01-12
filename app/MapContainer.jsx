import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MapComponent from './MainMap.jsx';
import AboutModalComponent from './AboutModal.jsx';
import IssuesModalComponent from './IssuesModal.jsx';
import WelcomeModalComponent from './WelcomeModal.jsx';
import FeatureInfoComponent from './FeatureInfo.jsx';
import BarChart from './BarChart.jsx';
import LeftSidebarContainer from './containers/LeftSideBarContainer.js'


class MapContainerComponent extends React.Component {
    constructor(props){
		    super(props);
    }
    render () {
      const { store } = this.context;

      var hideStyle = {display:'none'};
  		return(
  	    	<div className="container" id="main">
    		  	<div className="row">
    	         <LeftSidebarContainer />
    				    <div className="col-xs-12 col-sm-6 col-lg-8 right-main-panel">
    				    <div className="row">
    					    <FeatureInfoComponent />
    						</div>
    				    </div>
    				</div>
  			  	<MapComponent routeType={this.props.routeType}/>
  			  	<AboutModalComponent />
            <IssuesModalComponent />
            <WelcomeModalComponent />
  		  </div>
  		);
    }

}
MapContainerComponent.contextTypes = {
  store: React.PropTypes.object
}
const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(MapContainerComponent);
