import React from 'react';

class ProfileModalRow extends React.Component {
    constructor(props){
            super(props);
    }

    render () {
        //TODO: Get email and MP key info

        return(
            // TODO This whole thing right here...
            <div className="row">
                <div class="col-sm-3 col-m-3"></div>
                <div class="col-sm-6 col-m-6">
                    <div class="well">
                        <div><strong>Email</strong>: </div>
                        <div><strong>Mountain Project User Key</strong>: </div>
                        <div><label><strong>Get updates and notifications via Email</strong></label></div>
                        <div><input type="checkbox" name="getnotifications" disabled="true"></input></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileModalRow;