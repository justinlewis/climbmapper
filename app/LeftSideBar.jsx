import React from 'react';
import rd3 from 'react-d3-library'
const RD3Component = rd3.Component;

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// import Slider, { Range } from 'rc-slider';
// We can just import Slider or Range to reduce bundle size
import Slider from 'rc-slider/lib/Slider';
// import Range from 'rc-slider/lib/Range';
// require('rc-slider/assets/index.css');

import GradeBarChart from './charts/CountByGradeBarChart.jsx';
import RouteTypePieChart from './charts/RouteTypePieChart.jsx';
import RouteHeightPieChart from './charts/RouteHeightPieChart.jsx';
import TickByDateChart from './charts/TickByDateChart.jsx';
import { setFeatureInfo } from './actions/MapActions.js';



class LeftSidebar extends React.Component {
    constructor(props){
        super(props);

        this.state = {
          // data: [{"routeid":105736294,"name":"Bates Arete","crag":null,"area":207,"type":"Boulder","ropegrade":"5.11d","bouldergrade":"V4-","difficultyindex":19,"url":"https://www.mountainproject.com/v/bates-arete/105736294","imgSmall":"https://www.mountainproject.com/images/1/64/6200164_small_9e7d58.jpg","imgMed":"https://www.mountainproject.com/images/1/64/6200164_medium_9e7d58.jpg","stars":4.6,"starVotes":29,"pitches":0,"routeCategory":"TODO"}]
          areaInfo : null,
          routeTypeFilter : this.props.routeType ? this.props.routeType.routeType : "ALL",
          tickRoutes : this.props.ticksGlobalData ? this.props.ticksGlobalData : [],
          tickSliderMin : 0,
          tickSliderMax : 50,
          tickSliderPosition : 50,
          showTickSlider : false,
          wrapperWidth : 400, // default
        }

        this.handle = this.handle.bind(this);
    }

    componentDidMount() {
      this.setState({wrapperWidth : this.refs.wrapper.offsetWidth});
    }

    componentWillReceiveProps(newProps){
      const { store } = this.context;

      if(newProps.areaInfo && newProps.areaInfo.customRouteArr){
        this.setState({areaInfo:newProps.areaInfo, showTickSlider:false});
      }
      else{
        this.setState({areaInfo : null})
      }

      if(newProps.routeType){
        this.setState({routeTypeFilter : newProps.routeType});
      }

      if(newProps.tickSliderConfig){
        let min = newProps.tickSliderConfig.min;
        let max = newProps.tickSliderConfig.max;
        this.setState({tickSliderMin:min, tickSliderMax:max, tickSliderPosition:max});
      }

      if(newProps.ticksGlobalData){
        this.setState({tickRoutes:newProps.ticksGlobalData, tickSliderPosition:newProps.ticksGlobalData.length, tickSliderMax:newProps.ticksGlobalData.length});
      }
    }

    handle(props){
      this.setState({tickSliderPosition:props, showTickSlider:Math.random()});

      // let that = this;
      // setTimeout(function(){
      //   that.setState({showTickSlider:false});
      // }, 3000);
    };

    render () {
    		return(
          <div ref="wrapper" className="col-xs-6 col-lg-4" id="left-sidebar">
            <div id="left-sidebar-heading-info-container">
                <h2 id="left-sidebar-heading" className="text-center">{this.props.header}</h2>
            </div>

              { this.state.areaInfo && this.state.areaInfo.customRouteArr ?
                <div id="chart-row-2" className="chart-row">
                  <GradeBarChart data={this.state.areaInfo.customRouteArr} targetChartId="todo-grade-chart" />
                </div>
                : null
              }

              { this.state.areaInfo ?
                <div id="chart-row-1" className="chart-row">
                  <RouteTypePieChart areaInfo={this.state.areaInfo} targetChartId="todo-type-chart" routeTypeFilter={this.state.routeTypeFilter} />
                  <RouteHeightPieChart areaInfo={this.state.areaInfo} targetChartId="todo-type-chart" routeTypeFilter={this.state.routeTypeFilter} />
                </div>
                : null
              }

              { this.state.showTickSlider ?
                <div id="chart-row-1" className="chart-row">
                  <TickByDateChart
                    wrapperWidth={this.state.wrapperWidth}
                    tickSliderPosition={this.state.tickSliderPosition}
                    tickRoutes={this.state.tickRoutes}
                    targetChartId="tick-type-chart"
                    routeTypeFilter={this.state.routeTypeFilter}
                  />
                </div>
                : null
              }


            <div className="row slider-row">
              <Slider className="vertical-align"
                min={this.state.tickSliderMin} max={this.state.tickSliderMax}
                defaultValue={this.state.tickSliderMax}
                dots={true}
                // step={20}
                onChange={this.handle} />
            </div>
          </div>
    		);
    }
}

LeftSidebar.contextTypes = {
  store: React.PropTypes.object
}
const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(LeftSidebar);
