import React from 'react';

class FeatureInfoComponent extends React.Component {
    constructor(props){
		    super(props);
    }

    render () {

      var hideStyle = {display:'none'};

  		return(
        <div id="info-container" style={hideStyle}>
          <h4 id='info-area-title'></h4>
          <div id="info-box">
             <div id="click-chart-panel"></div>
          </div>
        </div>
  		);
    }
}

export default FeatureInfoComponent;
