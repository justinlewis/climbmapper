import React from 'react';

class ProfileHeaderComponent extends React.Component {
    constructor(props){
            super(props);
    }

    render () {
        return(
            // TODO This whole thing right here...
            <div class="row">
            <div class="col-sm-3 col-m-3"></div>
            <div class="col-sm-6 col-m-6">
            
                <h3 class="error-message">{{message}}</h3>
            
                <div class="well">
                    <span><a href="/updateprofile" id="edit-profile-btn" class="fa fa-pencil fa-2x pull-right" title="Edit your profile"></a></span>
                    <h3><span class="fa fa-user"></span> {{user.username}}</h3>

                    <p>
                        <strong>User Name</strong>: {{user.username}}<br>
                        <strong>Email</strong>: {{user.emails}}<br>
                        <strong>Mountain Project User Key</strong>: {{user.mountainprojkey}}
                        <div class="form-group checkbox disabled">
                        <label><strong>Get updates and notifications via Email</strong></label>
                        <input type="checkbox" name="getnotifications" {{#user.getnotifications}}checked{{/user.getnotifications}} disabled="true">
                     </div>
                    </p>

                </div>
            </div>
            <div class="col-sm-3 col-m-3"></div>
        );
    }
}

export default ProfileModalRow;