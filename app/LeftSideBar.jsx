import React from 'react';
import rd3 from 'react-d3-library'
const RD3Component = rd3.Component;
// const BarChart = rd3.BarChart;

import BarChart from './BarChart.jsx';
import { setFeatureInfo } from './actions/MapActions.js';


class LeftSidebar extends React.Component {
    constructor(props){
        super(props);

        this.state = {
          // data: [{"routeid":105736294,"name":"Bates Arete","crag":null,"area":207,"type":"Boulder","ropegrade":"5.11d","bouldergrade":"V4-","difficultyindex":19,"url":"https://www.mountainproject.com/v/bates-arete/105736294","imgSmall":"https://www.mountainproject.com/images/1/64/6200164_small_9e7d58.jpg","imgMed":"https://www.mountainproject.com/images/1/64/6200164_medium_9e7d58.jpg","stars":4.6,"starVotes":29,"pitches":0,"routeCategory":"TODO"}]
          data : null
        }
    }

    componentDidMount() {
      // this.setState({data: this.state.data});
    }

    componentWillReceiveProps(newProps){
      // console.log(prevProps, " - ", newProps);

      if(newProps.areaInfo && newProps.areaInfo.customRouteArr){
        this.setState({data : newProps.areaInfo.customRouteArr});
      }
      else{
        this.setState({data : null})
      }
    }

    render () {
    		return(
          <div className="col-xs-6 col-lg-4" id="left-sidebar">
            <div id="left-sidebar-heading-info-container">
                <h2 id="left-sidebar-heading" className="text-center">{this.props.header}</h2>
            </div>

            { this.state.data ? <BarChart data={this.state.data} targetChartId="todo-type-chart" /> : null }

            <div className="row slider-row">
              <div id="tick-slider">
                <div id="time-slider-label-container">
                  <p id="time-slider-label"></p>
                </div>
              </div>
            </div>
          </div>
    		);
    }
}

export default LeftSidebar;
