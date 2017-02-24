import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { closeModal } from './actions/AppActions.js';
import CloseButtonComponent from './CloseModalButton.jsx';

class AreaRoutesPreviewPanelComponent extends React.Component {
    constructor(props){
		    super(props);

        this.onModalCloseButtonClick = this.onModalCloseButtonClick.bind(this);
    }


    onModalCloseButtonClick(toClose){
      this.props.onModalCloseButtonClick(toClose);
    }


    shouldComponentUpdate(nextProps, nextState) {
      // if nextProps has layers a feature was clicked on
      if(nextProps.layers){
        return true;
      }

      return false;
    }


    render () {
      var hideStyle = {display:'none'};

      var layers =this.props.layers;
      if(layers){
        var routeTypeFilter = this.props.routeType;

        // Sort the array by the orderIndex property
        function compare(a,b) {
          if (a.difficultyindex < b.difficultyindex)
             return -1;
          if (a.difficultyindex > b.difficultyindex)
            return 1;
          return 0;
        }
        layers.sort(compare);

        // $("#info-area-title").text(subHeading+": "+layer.feature.properties.area);
        var areaCards = [];
        for(var l=0; l<layers.length; l++){

          if(routeTypeFilter.routeType === "ALL" || layers[l].type.toUpperCase() === routeTypeFilter ){
            var name = String(layers[l].name ? layers[l].name : 'n/a');
            var type = String(layers[l].type ? layers[l].type :"n/a");
            if(type.toUpperCase() === "TRAD" || type.toUpperCase() === "SPORT" || type.toUpperCase() === "ALPINE"){
              var rating = String(layers[l].ropegrade ? layers[l].ropegrade : 'n/a');
            }
            else{
              var rating = String(layers[l].bouldergrade ? layers[l].bouldergrade : 'n/a');
            }
            var pitches = String(layers[l].pitches ? layers[l].pitches :"n/a");
            var stars = String(layers[l].stars ? layers[l].stars :"n/a");
            var starVotes = String(layers[l].starVotes ? layers[l].starVotes :"n/a");
            var url = String(layers[l].url ? layers[l].url :"n/a");
            var geoLoc = String(layers[l].location ? layers[l].location :"n/a");
            var crag = layers.area; //TODO: fix
            var imgMed = String(layers[l].imgMed ? layers[l].imgMed :"n/a");
            var imgMed = String(layers[l].imgMed ? layers[l].imgMed :"n/a");

            areaCards.push(
              <ul key={Math.random()}  className='info-ul'>
                <li key={Math.random()} className='info-text'><h3 className='info-header'><u> {name} </u></h3></li>
                <li key={Math.random()} className='info-text'><i>Rating: </i> {rating} </li>
                <li key={Math.random()} className='info-text'><i>Type:  </i> {type} </li>
                <li key={Math.random()} className='info-text'><i>Pitches:  </i> {pitches} </li>
                <li key={Math.random()} className='info-text'><i>Stars:  </i> {stars} out of {starVotes} votes</li>
                <li key={Math.random()} className='info-text'><i>Crag:  </i> {crag} </li>
                <li key={Math.random()} className='info-text'><a className='info-link' target='_blank' href={url}>See it on Mountain Project</a></li>
              </ul>
            )
          }

        }
      }

      function getLocationName(areaId) {
        var areaName = "";
        for(var n=0; n<todoAreaPts.features.length; n++){
          var thisAreaId = todoAreaPts.features[n].properties.id;
          if(areaId === thisAreaId){
            areaName = todoAreaPts.features[n].properties.area;
          }
        }

        return areaName;
      }

  		return(
          <div id="info-container">
            <CloseButtonComponent onClick={this.onModalCloseButtonClick}/>
				   	<h4 id="info-area-title"></h4>
				   	<div id="info-box">
							<div id="click-chart-panel"></div>
              {areaCards}
				   	</div>
				   </div>
  		);
    }
}

AreaRoutesPreviewPanelComponent.contextTypes = {
  store: React.PropTypes.object
}
const mapStateToProps = (state) => {
  return state
}
export default connect(mapStateToProps)(AreaRoutesPreviewPanelComponent);
