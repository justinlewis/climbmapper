import React from 'react';
var ReactDOM = require('react-dom');

import rd3 from 'react-d3-library';
const RD3Component = rd3.Component;

const defaultWidth = 200;



class RouteHeightPieChartComponent extends React.Component {
    constructor(props){
		    super(props);

        this.state = {
          width : defaultWidth,
          targetChartId : this.props.targetChartId,
          routeTypeFilter : this.props.routeTypeFilter,
          areaInfo : this.props.areaInfo,
          d3: null
        }


      	////
      	// Build the chart
      	////
      	this.build = function (feature) {

          let data = [];
        	let pitchDict = {};
          let featureArr = feature.customRouteArr;
          let targetEl = document.createElement('div');

        	for(let i=0; i<featureArr.length; i++){
            let route = featureArr[i];
            let routeType = route.type;
        		let rtPitches = route.pitches;
            if(!rtPitches || rtPitches < 1){
              rtPitches = "n/a"
            }
        		let pitchesLabel = rtPitches.toString();
        		let rtObj = {};

            if(this.state.routeTypeFilter === "ALL" || routeType.toUpperCase() === this.state.routeTypeFilter){

            		if(routeEntryExists(pitchesLabel)){
            			updateRoutePitchesArr(pitchesLabel);
            		}
            		else {
            			rtObj.pitches = pitchesLabel;
            			rtObj.count = 1;
            			data.push(rtObj);
            		}

            }
        	};


        	function routeEntryExists(objectPropertyName) {
        		for(var d=0; d<data.length; d++){
        			var thisRtObj = data[d];

        			if(objectPropertyName === thisRtObj.pitches){
        				return true;
        			}
        		}

        		return false;
        	};


        	function updateRoutePitchesArr(propertyName) {
        		var rtObj = {};

        		for(var d=0; d<data.length; d++){
        			var thisRtObj = data[d];

        			if(propertyName === thisRtObj.pitches){
        				thisRtObj.count = thisRtObj.count + 1;
        				break;
        			}
        		}
        	};


        	function getAvg(targetCt, allCt) {
        		var percent = (targetCt/allCt) * 100;
        		return Math.round(percent);
        	};


        	var height = 175,
        	    radius = Math.min(this.state.width, height) / 2,
        	    labelr = radius - 30; // radius for label anchor

        	var color = d3.scale.ordinal()
        	    .range(["#193441", "#3E606F", "#91AA9D", "#D1DBBD"]);

        	var arc = d3.svg.arc()
        	    .outerRadius(radius - 40)
        	    .innerRadius(0);

        	var pie = d3.layout.pie()
        	    .sort(null)
        	    .value(function(d) { return d.count; });

        	var svg = d3.select(targetEl).append("svg")
        	    .attr("width", this.state.width)
        	    .attr("height", height)
        	    .append("g")
        	    .attr("transform", "translate(" + this.state.width / 2 + "," + height / 1.75 + ")");

        		 svg.append("text")
                .attr("x", 0)
                .attr("y", 10 - height/2)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("text-decoration", "underline")
                .text("Routes by Pitch Count");


        	  var g = svg.selectAll(".arc")
        	    .data(pie(data))
        	    .enter().append("g")
        	    .attr("class", "arc");

        	  g.append("path")
        	      .attr("d", arc)
        	      .style("fill", function(d) { return color(d.data.pitches); })
        	      // .transition()
        //	      .delay(function(d, i) { return i * 500; })
        	      // .duration(500)
        	      // .attrTween('d', function(d) {
               // 		var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
               // 		return function(t) {
                //    		d.endAngle = i(t);
                //  		return arc(d);
              	// 	}
          			// });

        	  g.append("text")
        	      //.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        	      //.style("text-anchor", "middle")
        	      .attr("transform", function(d) {
        			    var c = arc.centroid(d),
        			        x = c[0],
        			        y = c[1],
        			        // pythagorean theorem for hypotenuse
        			        h = Math.sqrt(x*x + y*y);
        			    return "translate(" + (x/h * labelr) +  ',' + (y/h * labelr) +  ")";
        			})
        	      .attr("text-anchor", function(d) {
        			    return (d.endAngle + d.startAngle)/2 > Math.PI ?
        			        "end" : "start";
        			})
        			.style("font-size","14px")
        	      .text(function(d) {

                  if(d.data.pitches === "n/a"){
                    return d.data.pitches + " ("+d.data.count+")";
                  }
                  else{
        	      	  return d.data.pitches + "p" + " ("+d.data.count+")";
                  }

        	      });


        	return targetEl;
      	}
    }

    componentWillReceiveProps(newProps) {
      debugger
      if(newProps && newProps.areaInfo){
        this.setState({ d3: this.build(newProps.areaInfo) });
      }
      else{
        this.setState({ d3: null });
      }
    }

    componentDidMount() {
      this.setState({ d3: this.build(this.props.areaInfo) });

     }

     componentWillMount() {

     }

     componentWillUnmount() {

     }


    render () {

      return(
          <div id={this.state.targetChartId}><RD3Component data={this.state.d3} /></div>
  		);
    }
}


export default RouteHeightPieChartComponent;
