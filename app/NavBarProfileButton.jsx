import React from 'react';


class NavBarProfileButton extends React.Component {
    constructor(props){
	super(props);
    }

    render () {
	
	return(
	    <li className="active"><a href="/profile">Your Profile</a></li>
	);  
    }
}

export default NavBarProfileButton;
