import React from 'react';
import BarChart from './BarChart.jsx';

class LeftSidebar extends React.Component {

    render () {
    		return(
          <div className="col-xs-6 col-lg-4" id="left-sidebar">
            <div id="left-sidebar-heading-info-container">
                <h2 id="left-sidebar-heading" className="text-center"></h2>
                <div id="hover-text-info-container">{this.props.header}</div>
            </div>
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
