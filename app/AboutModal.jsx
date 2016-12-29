import React from 'react';


class AboutModalComponent extends React.Component {
    constructor(props){
		    super(props);
    }

    render () {
    		return(
    			<div className="modal fade" id="about-modal" role="dialog">
    			    <div className="modal-dialog">
    			      	<div className="modal-content">
    			        	<div className="modal-header">
    			          		<button type="button" className="close" data-dismiss="modal">&times;</button>
    			          		<h2 className="modal-title">About Climb Mapper</h2>
    			        	</div>
    			        	<div className="modal-body">
    			          	<div>
      				    			<p>Climb Mapper seeks to provide planning and analysis for users of Mountain Project.
      				    				After signing up and uploading your Mounatin Project data the application displays climbing areas sized by the number of your Mountain Project Ticks and ToDos.
      				    				Charts are used throughout to display the breakdown of climb rating (using YDS), type (ex: boulder, sport, traditional) by area, and height (in pitches).
      				    				In addition to visualizing your existing data, logged-in users have the ability to add and edit climbing areas in the system to help better map Mountain Project Tick/ToDo data against Climb Mapper climbing areas.
      				    				This is an experiment and side project and so any collaboration is welcome.
      				    				All the scrapy code is available on <a href="https://github.com/justinlewis/climbmapper" target="_blank">one of my GitHub repos</a>.
      				    			</p>

      				    			<br/>
      				    			<h4>The Bigger Picture</h4>
        								<p>
        									I am tired of not being able to build useful tools for the climbing and outdoor community because of a lack of data.
        									There are a number of websites out there actively crowd sourcing climbing area data from people just like you but never returning that data back to the community as open data.
        									<b>NOTE:</b> Mountain Project was kind enough to make some data available through an API which helps power ClimbMapper (which is pretty damn great).
        									This is a problem because it makes it even harder for people like me to build free or inexpensive apps due to the overhead of collecting that same data WHILE then being forced to compete with other crowd sourcing websites that would be much better as partners than competitors.
        									If ClimbMapper is at all successful I would like to build out the data management functionality so WE can collect more types of data to be used in other ways.
        									With this open model developers like me can work on projects that affect the whole climbing community like building an application to help the Access Fund identify bad hardware and coordinate with those amazing teams that replace bad hardware to keep us happy and safe.
        								</p>
      				    		</div>

      				    		<br/><br/>
      				    		<div>
      				    			<h4>About The Data</h4>
      				    			<p>All route data (Ticks and ToDos) are imported from <a href="http://www.mountainproject.com/" target="_blank">Mountain Project</a>.
      				    			All climbing area data is created by Climb Mapper users independent of Mountain Project.
      				    			All user submitted data will be open sourced for other applications to use in hopes that a common data source openly shared will benefit other future applications that help engage in this sport we love so much.
      				    			</p>
      				    		</div>
      				    		<div>
      				    			<h4>An Important Caveat</h4>
      				    			<ul>
      				    				<li>Mountain Project data is NOT available with geometrically based location data.
      				    					Instead the application attempts to assign routes to climbing areas based on name matching.
      				    					This is problematic because it means that climbing areas in Climb Mapper must grammatically match a name in the location hierarchy of a route on Mountain Project.
      				    					For example, if a route on Mountain Project has a location hierarchy (found at top of page) like this "All Locations > California > Yosemite National Park > Tuolumne Meadows > Cathedral Range > Cathedral Peak" then an area in Climb Mapper must exist that has one of those names between the ">" symbols (i.e. Yosemite National Park).
      				    					If there these location names do not match up the route will not be matched to an area in Climb Mapper.
      				    				</li>
      				    			</ul>
      				    		</div>

      				    		<br/>
      				    		<div>
      				    			<h4>About The Technology Used</h4>
      				    			<p>
      				    				The application is built on PostgreSQL/PostGIS, Node.js, Leaflet.js, D3.js, Bootstrap, and JQuery.
      				    				Needless to say there is a lot of JavaScript used for presentation and a little Python for data extraction/processing.
      				    			</p>
      				    		</div>

      				    		<br/>
      				    		<div>
      				    			<h4>Future Plans</h4>
      				    			<p>
      				    				Because this is an experiment you can expect the visualizations to get better and more interesting.
      									More details and implementation specifics can be found at the <a href="https://github.com/justinlewis/climbmapper" target="_blank">public GitHub repo</a> where anyone can submit issue or request tickets.
      				    			</p>
      				    		</div>

      				    		<br/>
      				    		<div>
        								<h4>About Me</h4>
        								<p>I am a software developer with a particular interest in geography and web visualization.
        									I have been climbing for a long time and this application serves as a junction between the real and the digital.
        									You can find me on <a href="https://twitter.com/jmapping" target="_blank">Twitter @jmapping</a>
        								</p>
        							</div>
    			        	</div> // end modal-body
    			        	<div className="modal-footer">
    			          		<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
    			        	</div> // end modal-footer
    			      	</div> // end modal-content
    			    </div> // end modal-dialog
    			</div> 
    		);
    }
}

export default AboutModalComponent;
