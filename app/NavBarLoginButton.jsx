import React from 'react';


//import AboutButtonComponent from './AboutButtonComponent.jsx';

class NavBarLoginButton extends React.Component {
    constructor(props){
	super(props);
    }

    render () {
	
	return(
	    <li className="active"><a href="/login">Login</a></li>
	);  
    }
}

export default NavBarLoginButton;
