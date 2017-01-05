import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MapComponent from './MainMap.jsx';
import AboutModalComponent from './AboutModal.jsx';
import IssuesModalComponent from './IssuesModal.jsx';
import WelcomeModalComponent from './WelcomeModal.jsx';
import FeatureInfoComponent from './FeatureInfo.jsx';
import BarChart from './BarChart.jsx';


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
    				  	<div className="col-xs-6 col-lg-4" id="left-sidebar">
    				    	<div id="left-sidebar-heading-info-container">
    				      		<h2 id="left-sidebar-heading" className="text-center"></h2>

    				      		<div id="hover-text-info-container"></div>
    				      </div>

                  <BarChart  ></BarChart>
      						{/* <div id="chart-row-2" className="row chart-row" style={hideStyle}></div>
      						<div id="chart-row-1" className="row chart-row" style={hideStyle}></div> */}

      						<div className="row slider-row">
      							<div id="tick-slider">
      								<div id="time-slider-label-container">
      									<p id="time-slider-label"></p>
      								</div>
      							</div>
      						</div>
    				    </div>
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
  debugger
  return state
}

export default connect(mapStateToProps)(MapContainerComponent);
