import React from 'react';

class ProfileModalHeader extends React.Component {
    constructor(props){
            super(props);
    }

    render () {
        return(
            <div class="page-header text-center">
                <h1><span class="fa fa-asterisk"></span> Profile Page</h1>
                <a href="/" class="btn btn-primary btn-sm"> <i class="fa fa-globe"></i> Back To Your Map</a>
                <a href="/logout" class="btn btn-default btn-sm">Logout</a>
            </div>
        );
    }
}

export default ProfileModalHeader;
