import React from 'react';
var ReactDOM = require('react-dom');

import rd3 from 'react-d3-library';
const RD3Component = rd3.Component;
const defaultWidth = 400;
const defaultHeight = 200;

import {dateExists, sortDatesAscending} from '../utils/generalUtil.js';


class TickByDateChartComponent extends React.Component {
    constructor(props){
		    super(props);

        this.state = {
          width : this.props.wrapperWidth ? this.props.wrapperWidth : defaultWidth,
          height: 200,
          targetChartId : this.props.targetChartId,
          routeArr :  this.props.tickRoutes && Array.isArray(this.props.tickRoutes) ? this.props.tickRoutes.sort(sortDatesAscending) : [],
          d3: null,
          tickSliderPosition: this.props.tickSliderPosition,
          targetData: []
        }

        let data = [];
        let totalCt = 0;
        let totalTradCt = 0;
        let totalSportCt = 0;
        let totalBoulderCt = 0;
        let totalAlpineCt = 0;

        this.buildData = function (tickSliderPosition) {
      		var routes = [];
          data = [];
          totalCt = 0;
          totalTradCt = 0;
          totalSportCt = 0;
          totalBoulderCt = 0;
          totalAlpineCt = 0;

    			var selectedDate = this.state.routeArr[tickSliderPosition - 1].date; //TODO: should be sorted

      		for (var di=0; di<this.state.routeArr.length; di++) {
      			var feature = this.state.routeArr[di];
      				if(new Date(feature.date) <= new Date(selectedDate)){
      					routes.push({"date":new Date(feature.date), "type":feature.type});
      				}
              // else{
              //   console.log("else - ", feature)
              // }
      		}

          console.log(routes.length)

          // debugger

      		// routes = routes.sort(sortDatesAscending);

      		// Build array aggregated by date
      		for (var d=0; d<routes.length; d++) {
      			var rt = routes[d];
      			var exists = dateExists(rt.date, data)

      			if (exists) {
      				this.updateExisting(rt);
      			}
      			else{

      				this.totalCt = totalCt + 1;

      				if(rt.type === "Trad"){
      					totalTradCt = totalTradCt + 1;
      					data.push({"Total":totalCt, "Trad":totalTradCt, "Sport":totalSportCt, "Boulder":totalBoulderCt, "Alpine":totalAlpineCt, "date":rt.date});
      				}
      				else if(rt.type === "Sport"){
      					totalSportCt = totalSportCt + 1;
      					data.push({"Total":totalCt, "Trad":totalTradCt, "Sport":totalSportCt, "Boulder":totalBoulderCt, "Alpine":totalAlpineCt, "date":rt.date});
      				}
      				else if(rt.type === "Boulder"){
      					totalBoulderCt = totalBoulderCt + 1;
      					data.push({"Total":totalCt, "Trad":totalTradCt, "Sport":totalSportCt, "Boulder":totalBoulderCt, "Alpine":totalAlpineCt, "date":rt.date});
      				}
      				else if(rt.type === "Alpine"){
      					totalAlpineCt = totalAlpineCt + 1;
      					data.push({"Total":totalCt, "Trad":totalTradCt, "Sport":totalSportCt, "Boulder":totalBoulderCt, "Alpine":totalAlpineCt, "date":rt.date});
      				}
      				else if(rt.type === "Top-Rope"){
      					// TODO: add top rope routes
      				}
      			}
      		}

          // TODO: remove this in favor of the return
          this.setState({targetData:data.sort(sortDatesAscending)})

          return data.sort(sortDatesAscending);
      	}


      	this.updateExisting = function(route) {
      		for (var dc=0; dc<data.length; dc++) {
      			var dateEntry = data[dc];
      			if(new Date(dateEntry.date).getTime() === route.date.getTime()){
      				totalCt = totalCt + 1;
      				dateEntry.Total = totalCt;

      				if(route.type === "Trad"){
      					totalTradCt = totalTradCt + 1;
      				}
      				else if(route.type === "Sport"){
      					totalSportCt = totalSportCt + 1;
      				}
      				else if(route.type === "Boulder"){
      					totalBoulderCt = totalBoulderCt + 1;
      				}
      				else if(route.type === "Alpine"){
      					totalAlpineCt = totalAlpineCt + 1;
      				}
      				else if(route.type === "Top-Rope"){
      					// TODO: add top rope routes
      				}

      				dateEntry.Trad = totalTradCt;
      				dateEntry.Sport = totalSportCt;
      				dateEntry.Boulder = totalBoulderCt;
      				dateEntry.Alpine = totalAlpineCt;
      			}
      		}
      	}

      	////
      	// Build the chart
      	////
      	this.build = function (tickSliderPosition) {
          if(this.state.routeArr && this.state.routeArr.length > 0){
        		var targetEl = document.createElement('div');

            var that = this;

        		var theData = this.buildData(tickSliderPosition)

        		var color = d3.scale.ordinal().range(["#193441", "#3E606F", "#91AA9D", "#D1DBBD"]);

        		var margin = {top: 20, right: 80, bottom: 30, left: 50}

        		var parseDate = d3.time.format("%Y%m%d").parse;

        		var x = d3.time.scale().range([0, this.state.width - margin.right - margin.left]);
        		var y = d3.scale.linear().range([this.state.height - margin.top - margin.bottom, 0]);

        		var xAxis = d3.svg.axis()
        		    .scale(x)
        		    .orient("bottom");

        		var yAxis = d3.svg.axis()
        		    .scale(y)
        		    .orient("left");

        		var line = d3.svg.line()
        		    .interpolate("basis")
        		    .x(function(d) {
        		    		return x(new Date(d.date));
        		    })
        		    .y(function(d) {
        		    		return y(d.total);
        		    });

        		var svg = d3.select(targetEl).append("svg")
        		    .attr("width", this.state.width)
        		    .attr("height", this.state.height)
        		  .append("g")
        		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        		color.domain(d3.keys(theData[0]).filter(function(key) { return key !== "date"; }));

        		var climbType = color.domain().map(function(name) {
        		    return {
        		      name: name,
        		      values: theData.map(function(d) {
        		        return {date: new Date(d.date), total: +d[name]};
        		      })
        		    };
        		});

        		x.domain(d3.extent(theData, function(d) { return new Date(d.date); }));

        		y.domain([d3.min(climbType, function(c) { return d3.min(c.values, function(v) { return v.total; }); }),
        		    d3.max(climbType, function(c) { return d3.max(c.values, function(v) { return v.total; }); })
        		]);

        		svg.append("g")
        	      .attr("class", "x axis")
        	      .attr("transform", "translate(0," + String(this.state.height - margin.top - margin.bottom) + ")")
        	      .call(xAxis);

        		svg.append("g")
        	      .attr("class", "y axis")
        	      .call(yAxis)
        	    .append("text")
        	      .attr("transform", "rotate(-90)")
        	      .attr("y", 6)
        	      .attr("dy", ".71em")
        	      .style("text-anchor", "end")
        	      .text("Count");

        		var types = svg.selectAll(".types")
        	      .data(climbType)
        	    	.enter().append("g")
        	      .attr("class", "types");

        		types.append("path")
        	      .attr("class", "line")
        	      .attr("d", function(d) { return line(d.values); })
        	      .style("stroke", function(d) { return color(d.name); });

        		types.append("text")
        	      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
        	      .attr("transform", function(d) { return "translate(" + x(new Date(d.value.date)) + "," + y(d.value.total) + ")"; })
        	      .attr("x", 3)
        	      .attr("dy", ".35em")
        	      .text(function(d) { return d.name; });



               return targetEl;
            }

            return null;
      	}
    }

    // shouldComponentUpdate(nextProps, nextState){
    //   if((nextProps.tickSliderPosition && nextState.tickSliderPosition) && (nextProps.tickSliderPosition !== this.state.tickSliderPosition)){
    //     return true;
    //   }
    //
    //   return false;
    // }

    componentWillReceiveProps(newProps) {

      console.log("TickByDateChart::componentWillReceiveProps")

      // if(newProps && newProps.tickRoutes){
      //   this.setState({ d3: this.build() });
      // }
      // else{
      //   this.setState({routeArr : null, d3: null});
      // }

      if(newProps.wrapperWidth){
        this.setState({width:newProps.wrapperWidth});
      }

      if(newProps.tickSliderPosition && newProps.tickSliderPosition !== this.state.tickSliderPosition){
        this.setState({ d3: this.build(newProps.tickSliderPosition) });
      }
    }

    componentDidMount() {

      console.log("TickByDateChart::componentDidMount")

      this.setState({ d3: this.build(this.state.tickSliderPosition) });
     }

     componentWillMount() {

     }

     componentWillUnmount() {

     }


    render () {

      console.log("TickByDateChart::render")

      return(
          <div id={this.state.targetChartId}><RD3Component data={this.state.d3} /></div>
  		);
    }
}


export default TickByDateChartComponent;
