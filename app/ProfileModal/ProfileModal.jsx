import React from 'react';

//TODO Profile Modal Child Compontents
import ProfileModalHeader from './ProfileModalHeader.jsx';
import ProfileModalRow from './ProfileModalRow.jsx';

class ProfileModalComponent extends React.Component {
  constructor(props){
     super(props);
  }

  render () {
    return(
        <div className="modal fade" id="profile-modal" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h2 className="modal-title">Profile Page</h2> 
                </div>
                <div className="modal-body">
                  <ProfileModalHeader />
                  <ProfileModalRow />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                </div>
              </div> // end modal-content
            </div> // end modal-dialog
          </div> // end profile-modal
    );
  }
}

export default ProfileModalComponent;