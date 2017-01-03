import React from 'react';


class WelcomeModalComponent extends React.Component {
    constructor(props){
		    super(props);
    }

    render () {
    		return(
            <div className="modal fade wide" id="welcome-modal" role="dialog">
             <div className="modal-dialog">
               <div className="modal-content">
                 <div className="modal-header">
                   <button type="button" className="close" data-dismiss="modal">&times;</button>
                   <h2 className="modal-title">Welcome to ClimbMapper</h2>
                 </div>
                 <div className="modal-body">

                 <div id="welcome-modal-content">
                   <h3>What the hell is this?</h3>
                   <p>Good question. It's an experiment to help show where a climber has and wants to climb. It's a bit of an exploration and planning tool to help sort out where you might want to go climbing.</p>

                   <h3>Why should you care?</h3>
                   <ol>
                     <li>You can get your own FREE version of this map!</li>
                     <li>You can create new climbing areas.</li>
                     <li>Climbing area data will be shared back to the community as open data which you or other software developers can use to make other applications.</li>
                     <li>You can help develop the app by contributing code to the <a href="https://github.com/justinlewis/climbmapper" target="_blank">GitHub Repo</a>, submitting bug reports, or just giving general feedback.</li>
                   </ol>

                   <h3>Interested?</h3>
                   <p>Setting up your account is easy.</p>
                   <ol>
                     <li><a href="/signup">Sign Up</a> for a FREE account on ClimbMapper.</li>
                     <li>Add your Mountain Project key and email to your profile (instructions on your profile page).</li>
                     <li>Click the Mountain Project upload button on your profile.</li>
                   </ol>

                   <h3>What's the catch?</h3>
                   <p>There isn't one. This is an experiment which I would like to be collaborative with other climbers and software developers. I have no intention of monetizing this. That said I will leave you with these disclaimers:</p>
                   <ol>
                     <li>Climbing areas are very incomplete at the moment.  We need more people like you to join and help add more.</li>
                     <li>Route, ToDo, and Tick data all comes from Mountain Project and there are very challenging issues with incorporating their data into ClimbMapper.</li>
                     <li>Expect bugs! This is a project I work on when I have time so there are sure to be issues. However, with your help we can clean up that mess.</li>
                   </ol>

                   <h3>The Bigger Picture</h3>
                   <p>
                     I am tired of not being able to build useful tools for the climbing and outdoor community because of a lack of data.
                     There are a number of websites out there actively crowd sourcing climbing area data from people just like you but never returning that data back to the community as open data.
                     <b>NOTE:</b> Mountain Project was kind enough to make some data available through an API which helps power ClimbMapper (which is pretty damn great).
                     This is a problem because it makes it even harder for people like me to build free or inexpensive apps due to the overhead of collecting that same data WHILE then being forced to compete with other crowd sourcing websites that would be much better as partners than competitors.
                     If ClimbMapper is at all successful I would like to build out the data management functionality so WE can collect more types of data to be used in other ways.
                     With this open model developers like me can work on projects that affect the whole climbing community like building an application to help the Access Fund identify bad hardware and coordinate with those amazing teams that replace bad hardware to keep us happy and safe.
                   </p>

                 </div>

                 </div>
                 <div className="modal-footer">
                   <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                 </div>
               </div>
             </div>
           </div>
    		);
    }
}

export default WelcomeModalComponent;
