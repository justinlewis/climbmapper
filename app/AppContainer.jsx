import React from 'react';

import MapContainerComponent from './containers/MapContainer.js';
import NavBarComponent from './containers/NavBarContainer.js';

class AppContainerComponent extends React.Component {
    constructor(props){
	     super(props);
    }

    render () {
  	 	return(
  	    	<div>
  	    		   <NavBarComponent />
               {/* TODO:  this styleProp is too general. split out the embeded uses of this prop into separate components */}
  		 		     <MapContainerComponent />
  		 	  </div>
  	 	);
    }
}

export default AppContainerComponent;
