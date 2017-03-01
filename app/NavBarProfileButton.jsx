import React from 'react';


class NavBarProfileButton extends React.Component {
    constructor(props){
	   super(props);
    }

    render () {
	
	return(
	    <li className="active" data-toggle="modal" data-target="#profile-modal"><a href="#">Profile</a></li>
	);  
    }
}

export default NavBarProfileButton;
