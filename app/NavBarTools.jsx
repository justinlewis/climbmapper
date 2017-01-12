import React from 'react';

//import AboutButtonComponent from './AboutButtonComponent.jsx';

class NavBarTools extends React.Component {
    constructor(props){
	super(props);
    }

    handleClick(routeType) {
        this.props.filterByType(routeType)
    }

    render () {



      	//TODO: This is a bad way to pass data to a component.
      	var username = document.getElementById("app-config-el").dataset.username;

      	return(
            		<ul className="nav navbar-nav pull-right">
                     <li>
                         <div id="user-name-container">
                             <p className="navbar-text">{username}</p>
                         </div>
                     </li>

                     <li className="dropdown">
                         <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">All Route Types
                             <span className="caret"></span>
                         </a>
                         <ul className="dropdown-menu">
                             <li><a id="trad-btn" href="#" data-type="TRAD" onClick={() => this.handleClick('TRAD')}>Trad </a></li>
                             <li><a id="sport-btn" href="#" data-type="SPORT" onClick={() => this.handleClick('SPORT')}>Sport</a></li>
                             <li><a id="boulder-btn" href="#" data-type="BOULDER" onClick={() => this.handleClick('BOULDER')}>Boulder</a></li>
                             <li><a id="alpine-btn" href="#" data-type="ALPINE" onClick={() => this.handleClick('ALPINE')}>Alpine</a></li>
                             <li role="separator" className="divider"></li>
                             <li><a id="all-btn" href="#" data-type="ALL" onClick={() => this.handleClick('ALL')}>All Types</a></li>
                         </ul>
                     </li>
                     <li>
                         <form className="navbar-form" role="search">
                             <div id="area-search" className="input-group pull-right">
                                 <div className="form-group">
                                     <input type="text" className="typeahead form-control" placeholder="Search for a crag/area"></input>
                                 </div>

                                 <span className="input-group-addon">
  	                                 <span className="glyphicon glyphicon-search"></span>
  	                             </span>
                             </div>
                         </form>
                     </li>
                  </ul>
      	);
    }
}

export default NavBarTools;
