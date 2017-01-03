import React from 'react';


class NavBarDataIssuesButton extends React.Component {
    constructor(props){
	     super(props);
    }

    render () {
    	return(
    	    <li className="active" data-toggle="modal" data-target="#issues-modal"><a href="#">Data Issues</a></li>
    	);
    }
}

export default NavBarDataIssuesButton;
