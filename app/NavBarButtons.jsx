import React from 'react';


import NavBarAboutButton from './NavBarAboutButton.jsx';
import NavBarSignUpButton from './NavBarSignUpButton.jsx';
import NavBarLoginButton from './NavBarLoginButton.jsx';
import NavBarProfileButton from './NavBarProfileButton.jsx';
import NavBarDataIssuesButton from './NavBarDataIssuesButton.jsx';

class NavBarButtons extends React.Component {
    constructor(props){
	super(props);
    }

    render () {
	
	// TODO: This is a bad way to pass data to a component
	var isAuthenticated = Boolean(document.getElementById("app-config-el").dataset.isauthenticated);

	var login;
	var signUp;
	var profile;
	var dataIssues;
	
	// isAuthenticated is not updating because this is a terrible way to manage state... 	
	console.log(isAuthenticated)
	
	if(isAuthenticated === true){
	    profile = <NavBarProfileButton />;		
	    dataIssues = <NavBarDataIssuesButton />;
	}
	else if(isAuthenticated === false){
	    signUp = <NavBarSignUpButton />
 	    login = <NavBarLoginButton />
	}	

	return(
	    <ul className="nav navbar-nav">
            	<NavBarAboutButton /> 
	    	{signUp}
            	{login}
		{profile}
         	{dataIssues}
            </ul>
	
	);  
    }
}

export default NavBarButtons;
