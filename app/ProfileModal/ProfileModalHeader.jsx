import React from 'react';

class ProfileModalHeader extends React.Component {
    constructor(props){
            super(props);
    }

    render () {
        //TODO: This is a bad way to pass data to a component.
        var username = document.getElementById("app-config-el").dataset.username;

        return(
            <div className="page-header text-center">
                <span><a href="/updateprofile" id="edit-profile-btn" className="fa fa-pencil fa-2x pull-right" title="Edit your profile"></a></span>
                <h1><span className="fa fa-asterisk"></span> {username}</h1>
                <a href="/logout" className="btn btn-default btn-sm">Logout</a>
            </div>
        );
    }
}

export default ProfileModalHeader;
