import React from 'react';


//import AboutButtonComponent from './AboutButtonComponent.jsx';

class NavBarSignUpButton extends React.Component {
    constructor(props){
	super(props);
    }

    render () {
	
	return(
	    <li className="active"><a href="/signup">Sign Up</a></li>
	);  
    }
}

export default NavBarSignUpButton;
