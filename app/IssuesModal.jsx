import React from 'react';


class IssuesModalComponent extends React.Component {
    constructor(props){
		    super(props);
    }

    render () {

        var hideStyle = {display:'none'};

    		return(
          <div className="modal fade" id="issues-modal" role="dialog">
  			    <div className="modal-dialog">
  			      <div className="modal-content">
  			        <div className="modal-header">
  			          <button type="button" className="close" data-dismiss="modal">&times;</button>
  			          <h2 className="modal-title">Known Issues</h2>
  			        </div>
  			        <div className="modal-body">

  			        		<div id="issues-content-msg"></div>

      							<div id="issue-content-container" style={hideStyle}>
      								<h4>This includes all data issues for the entire system (not just for your data). We are exposing all issues to allow others to help create data where it is missing in the system.</h4>
      								<table className="table table-striped table-bordered">
      								    <thead className="thead-inverse">
      								      <tr>
      								        <th>Route</th>
      								        <th>Problem</th>
      								        <th>Possible Solution</th>
      								        <th>Source Link</th>
      								      </tr>
      								    </thead>
      								    <tbody id="issues-content"></tbody>
      								</table>
      							</div>
  			        </div>
  			        <div className="modal-footer">
  			          <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
  			        </div>
  			      </div> // end modal-content
  			    </div> // end modal-dialog
  			  </div> // end issues-modal
    		);
    }
}

export default IssuesModalComponent;
