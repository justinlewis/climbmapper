# climbmapper

An experiment built on Node.js using Mountain Project climbing route data and my climbing area data. 

You can see the app live at www.climbmapper.com

<h3>About</h3>
The goal of this app is to provide a better toolset for visualizing where someone wants to climb based on their MountainProject.com ToDos and Ticks.  While the initial interest was to leverage Mountain Project there is a general interest to break away from that connection to allow for other integrations and possibly the ability to add routes solely to ClimbMapper.  However, none of that is in the works right now. 

<h4>Current Features</h4>
* MountainProject.com user integration
* Tick and ToDo downloads from user profiles
* Mapping ToDo/Tick density by location (climbing area and partial crag level support)
* Charting grade breakdown, route type (trad, sport, boulder, alpine), and height (in # of pitches) on hover of locations
* Displaying a list of routes with preview images and supplemental info on click of a location with links to the respective route in MountainProject.com
* User profile management
* Data issue reports
* Ability to filter maps and charts by route types (trad, sport, boulder, alpine)
* Ability to search for climbing areas
* Ability to add new climbing areas or crags
* Ability to edit existing areas or crags
* Ability to use a time slider for visualizing user ticks across time
* Charting of user ticks by route type and type across time

<h3>The future</h3>

<b>NOTE:</b> After some interest from the community it was decided that this project is being ported from a Proof of Concept implementation to something we all can be more proud of.  The target stack will include:

** See the <a href="https://github.com/justinlewis/climbmapper/tree/reactify" >reactify</a> branch for the work in progress

Basic Front-end
* React
* WebPack/Babel
* Redux
* Bootstrap

Visualization Specific
* Leaflet.js
* D3.js

Backend
* Node 9.9.1
* PostgreSQL 9.6.1 (PostGIS 2 >)
* Python 2.7 (for some data processing)


<h3>Want to help out?</h3>
Awesome! 

<h4>1.  Dev Database Setup</h4>

<ol>
<li> Install PostgreSQL if you don't have it installed already.
<li> Create 'climbmapper' database with PostGIS installed.
<li> Create a new login user called 'app_user' who is a read only user.
<li> **There is another user used in the production environment which you probably don't need but conatact me if you do end up needing it.
<li> Populate the database by restoring climbmapper/project_setup/climbmapper.backup.
</ol>

<h4>2.  Dev Server Env Setup</h4>

<ol>
<li> Install Node.js if you don't have it installed already.
<li> Pull the repo to your local webserver root (typically /var/www on Linux using Apache HTTPD).
<li> CD into the climbmapper root directory.
<li> Type 'npm install' in your terminal when cd'd into the cimbmapper root directory.
<li> Type 'webpack' in your terminal when cd'd into the cimbmapper root directory.
<li> Type 'npm start' in your terminal when cd'd into the cimbmapper root directory.
<li> Access the site at http://localhost:8080/climbmapper
</ol>

<h4>3.  Making Changes</h4>
<ol>
<li> Make a branch
<li> When you make changes run webpack in your terminal to compile your changes (simply type webpack)
<li> Refresh your browser
<li> Use the 'issues' tab in GitHub for reporting or accepting tickets.
</ol>

<h4> Setting up Python Virtual Environment </h4>
From the project root...
<ol>
<li><p> Use Python 2.7
<code>virtualenv -p /usr/bin/python2.7 venv</code>

<li> Activate the environment
<code>. venv/bin/activate</code>

<li> Install requirements
<code>pip install -r requirements.txt</code>
</ol>

<h4>General Needs</h4>
See the issues tab for more details.

<ol>
<li> Migration from a Proof of Concept to a real app (IN PROGRESS - see reactify branch)
<li> Better security authentication
<li> UI/UX makeover (especially with editing locations)
<li> Stronger domain models that help minimize the bridge to Mountain Project
<li> Connectors to other climbing websites (8a.nu, thecrag.com, etc...)
<li> Ability to add routes directly to ClimbMapper
</ol>

