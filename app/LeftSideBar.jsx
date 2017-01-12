import React from 'react';
import BarChart from './BarChart.jsx';

class LeftSidebar extends React.Component {
    constructor(props){
		    super(props);
    }

    render () {
    		return(
          <div className="col-xs-6 col-lg-4" id="left-sidebar">
            <div id="left-sidebar-heading-info-container">
                <h2 id="left-sidebar-heading" className="text-center"></h2>
                <div id="hover-text-info-container">{this.props.header}</div>
            </div>
            {/* <BarChart areaInfo={this.props.areaInfo}  ></BarChart> */}
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
    		);
    }
}

export default LeftSidebar;
