import React from 'react';

import NavBarButtons from './NavBarButtons.jsx';
import NavBarTools from './NavBarTools.jsx';


class NavBarComponent extends React.Component {
    constructor(props){
	     super(props);
    }

    render () {
    	 return(
    	    <div id="navbar" className="navbar navbar-custom navbar-fixed-top">
    		    <div className="navbar-header"></div>
        		<div className="navbar-collapse collapse">
        			<NavBarButtons />
        			<NavBarTools filterByType={this.props.filterByType}/>
        		</div>
    	    </div>
    	 );
    }
}

export default NavBarComponent;
