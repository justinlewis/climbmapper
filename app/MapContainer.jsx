import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MapComponent from './MainMap.jsx';
import AboutModalComponent from './AboutModal.jsx';
import IssuesModalComponent from './IssuesModal.jsx';
import WelcomeModalComponent from './WelcomeModal.jsx';
import FeatureInfoComponent from './FeatureInfo.jsx';
import AreaRoutesPreviewPanelComponent from './AreaRoutesPreviewPanel.jsx'
import BarChart from './BarChart.jsx';
import LeftSidebarContainer from './containers/LeftSideBarContainer.js'


class MapContainerComponent extends React.Component {
    constructor(props){
		    super(props);

        this.state = {
          showAreaRoutesPreviewPanel : false
        }

        this.onFeatureClick = this.onFeatureClick.bind(this)
    }

    onFeatureClick(feature){
      var showPanel = false;
      if(feature){
        showPanel = true;
      }
      this.setState({showAreaRoutesPreviewPanel : showPanel});
    }

    render () {
      const { store } = this.context;

      // var hideStyle = {display:'none'};
  		return(
  	    	<div className="container" id="main">
    		  	<div className="row">
    	         <LeftSidebarContainer />
    				    <div className="col-xs-12 col-sm-6 col-lg-8 right-main-panel">
    				          <div className="row">
    					               {/* <FeatureInfoComponent /> */}
                             {/* { this.state.showAreaRoutesPreviewPanel ? <AreaRoutesPreviewPanelComponent areaInfo={this.props.featureInfo.areaInfo} routeType={this.props.routeType.routeType} /> : null } */}
                            <AreaRoutesPreviewPanelComponent layers={this.props.featureInfo.layers} routeType={this.props.routeType.routeType} />
                      </div>
    				    </div>
    				</div>
  			  	<MapComponent routeType={this.props.routeType} onFeatureClick={this.onFeatureClick} />
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
