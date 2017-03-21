import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MapComponent from './MainMap.jsx';
import AboutModalComponent from './AboutModal.jsx';
import IssuesModalComponent from './IssuesModal.jsx';
import WelcomeModalComponent from './WelcomeModal.jsx';
import FeatureInfoComponent from './FeatureInfo.jsx';
import AreaRoutesPreviewPanelComponent from './AreaRoutesPreviewPanel.jsx'
import LeftSidebarContainer from './containers/LeftSideBarContainer.js'

import { setFeatureInfo, hoverFeatureInfo, loadMap, clickFeatureInfo, setGlobalTickData } from './actions/MapActions.js';


class MapContainerComponent extends React.Component {
    constructor(props){
		    super(props);

        this.state = {
          showAreaRoutesPreviewPanel : false,
          tickSliderConfig : {},
          tickRoutes : {}
        }

        this.onFeatureClick = this.onFeatureClick.bind(this);
        this.onModalCloseButtonClick = this.onModalCloseButtonClick.bind(this);
        this.onTickSliderDataChange = this.onTickSliderDataChange.bind(this);
        this.setTicksGlobalData = this.setTicksGlobalData.bind(this);
    }

    setTicksGlobalData(ticks){
      // const { store } = this.context;
      this.setState({tickRoutes: ticks});
      // store.dispatch(setGlobalTickData(ticks));
    }

    onTickSliderDataChange(data){
      this.setState({tickSliderConfig: data});
    }

    onFeatureClick(feature){
      var showPanel = false;
      if(feature){
        showPanel = true;
      }
      this.setState({showAreaRoutesPreviewPanel : showPanel});
    }

    onModalCloseButtonClick(toClose){
      this.setState({showAreaRoutesPreviewPanel : false});
    }

    componentWillReceiveProps(nextProps){
      // console.log("the props: ", nextProps)
      // this.setState({tickRoutes : nextProps})
    }

    render () {
      const { store } = this.context;

      console.log("got the store")

      // var hideStyle = {display:'none'};
  		return(
  	    	<div className="container" id="main">
    		  	<div className="row">
    	         <LeftSidebarContainer mapComponent={this.refs.childMapComponent}
                 routeTypeFilter={store.getState().routeType}
                 tickSliderConfig={this.state.tickSliderConfig}
                 ticksGlobalData={this.state.tickRoutes}
               />
    				    <div className="col-xs-12 col-sm-6 col-lg-8 right-main-panel">
    				          <div className="row">
    					               {/* <FeatureInfoComponent />  */}   {/*TODO: Remove this and the associated class if not used elsewhere */}
                             { this.state.showAreaRoutesPreviewPanel ? <AreaRoutesPreviewPanelComponent layers={this.props.featureInfo.layers} routeType={this.props.routeType.routeType} onModalCloseButtonClick={this.onModalCloseButtonClick} /> : null }
                      </div>
    				    </div>
    				</div>
  			  	<MapComponent routeType={this.props.routeType}
              onFeatureClick={this.onFeatureClick}
              onTickSliderDataChange={this.onTickSliderDataChange}
              setTicksGlobalData={this.setTicksGlobalData}
            />
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
