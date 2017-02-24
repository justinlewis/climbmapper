import React from 'react';

class CloseButtonComponent extends React.Component {
    constructor(props){
		    super(props);
    }

    render () {
  		return(
          <a href="#" className="close-thick" onClick={this.props.onClick}></a>
  		);
    }
}

export default CloseButtonComponent;
