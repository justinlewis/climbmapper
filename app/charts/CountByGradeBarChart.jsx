import React from 'react';
var ReactDOM = require('react-dom');

import rd3 from 'react-d3-library';
const RD3Component = rd3.Component;


// TODO: replace with database lookup
// const ratingLookup = { "ratings":
//       {
//         "5.0" : 0,
//         "5.1" : 1,
//         "5.2" : 2,
//         "5.3" : 3,
//         "5.4" : 4,
//         "5.5" : 5,
//         "5.6" : 6,
//         "5.7" : 7,
//         "5.8" : 8,
//         "5.9" : 9,
//         "5.10" : 10,
//         "5.10a" : 11,
//         "5.10b" : 12,
//         "5.10c" : 13,
//         "5.10d" : 14,
//         "5.11" : 15,
//         "5.11a" : 16,
//         "5.11b" : 17,
//         "5.11c" : 18,
//         "5.11d" : 19,
//         "5.12" : 20,
//         "5.12a" : 21,
//         "5.12b" : 22,
//         "5.12c" : 23,
//         "5.12d" : 24,
//         "5.13" : 25,
//         "v0" : 26,
//         "v1" : 27,
//         "v2" : 28,
//         "v3" : 29,
//         "v4" : 30,
//         "v5" : 31,
//         "v6" : 32,
//         "v7" : 33,
//         "v8" : 34,
//         "v9" : 35,
//         "v10" : 36
//    }
// };

const defaultWidth = 200;



class CountByGradeBarChartComponent extends React.Component {
    constructor(props){
		    super(props);

        this.state = {
          width : defaultWidth,
          targetChartId : this.props.targetChartId,
          routeArr : this.props.data,
          d3: null

        }

        // this.state = {
        //   d3: [{"routeid":105736294,"name":"Bates Arete","crag":null,"area":207,"type":"Boulder","ropegrade":"5.11d","bouldergrade":"V4-","difficultyindex":19,"url":"https://www.mountainproject.com/v/bates-arete/105736294","imgSmall":"https://www.mountainproject.com/images/1/64/6200164_small_9e7d58.jpg","imgMed":"https://www.mountainproject.com/images/1/64/6200164_medium_9e7d58.jpg","stars":4.6,"starVotes":29,"pitches":0,"routeCategory":"TODO"}],
        //   sampleData: [{"routeid":105736294,"name":"Bates Arete","crag":null,"area":207,"type":"Boulder","ropegrade":"5.11d","bouldergrade":"V4-","difficultyindex":19,"url":"https://www.mountainproject.com/v/bates-arete/105736294","imgSmall":"https://www.mountainproject.com/images/1/64/6200164_small_9e7d58.jpg","imgMed":"https://www.mountainproject.com/images/1/64/6200164_medium_9e7d58.jpg","stars":4.6,"starVotes":29,"pitches":0,"routeCategory":"TODO"}]
        // }



        this.getTickArray = function(array){
      		var tickArray = [];
      		var freqTracker = 0;
      		for(var i=0; i<array.length; i++){
      			if(array[i].frequency > freqTracker){
      				freqTracker = array[i].frequency;
      			}
      		}

      		var t = 0;
      		while(t <= freqTracker){
      			tickArray.push(t);
      			t++;
      		}

      		return tickArray;
      	}

      	this.getGradeArr = function(routeArr, targetEl) {

      		function checkGradeExists(grade, gradeArr) {
      				var status = false;
      				for(var rg=0; rg<gradeArr.length; rg++){
      					if( rating == String(gradeArr[rg].rating).trim() ){
      						status = true;
      					}
      				}
      				return status;
      		}


      		if(routeArr.length > 0){
      			var routeGradeObj = function (type, rating, frequency, sportFrequency, tradFrequency, boulderFrequency, difficultyindex) {
      				this.type = type,
      				this.rating = rating,
      				this.frequency = frequency,
      				this.difficultyindex = difficultyindex,
      				this.sportFrequency = sportFrequency;
      				this.tradFrequency = tradFrequency;
      				this.boulderFrequency = boulderFrequency;
      			};

      			var gradeArr = [];
      			for(var l=0; l<routeArr.length; l++){
      				var route = routeArr[l];

      				var rating = "n/a";
      				if(route.type){
      					if(route.type.toLowerCase() === "trad" || route.type.toLowerCase() === "sport" || route.type.toLowerCase() === "alpine"){
      						rating = String(route.ropegrade ? route.ropegrade : 'n/a');
      					}
      					else{
      						rating = String(route.bouldergrade ? route.bouldergrade : 'n/a');
      					}
      					rating = rating.toLowerCase().replace("+","").replace("-","");
      				}

      				var stars = String(route.stars ? route.stars : 'n/a');

      				var type = String(route.type ? String(route.type) : 'n/a').trim();
      				// var gradeExists = checkGradeExists(rating, gradeArr);


      				var gradeExists = checkGradeExists(rating, gradeArr);
      				if( gradeExists ){

      						//
      						//Iterate over existing grade (rating) objects to increment frequency properties
      						//
      						for(var rg=0; rg<gradeArr.length; rg++){
      							var areaGraded = gradeArr[rg];
      							if( rating == String(areaGraded.rating).trim() ){

      								areaGraded.frequency = areaGraded.frequency + 1;

      								switch(areaGraded.type.toLowerCase()){
      									case 'sport':
      										areaGraded.sportFrequency = areaGraded.sportFrequency + 1;
      										break;
      									case 'trad':
      										areaGraded.tradFrequency = areaGraded.tradFrequency + 1;
      										break;
      									case 'boulder':
      										areaGraded.boulderFrequency = areaGraded.boulderFrequency + 1;
      										break;
      								}
      							}
      						}
      				}
      				else{
      					if(!route.difficultyindex){
      						route.difficultyindex = 999;
      					}
      					var initialSportFrequency = 0;
      					var initialTradFrequency = 0;
      					var initialBoulderFrequency = 0;
      					switch(route.type.toLowerCase()){
      						case 'sport':
      								initialSportFrequency = 1;
      								break;
      						case 'trad':
      								initialTradFrequency = 1;
      								break;
      						case 'boulder':
      								initialBoulderFrequency = 1;
      								break;
      					}
      					gradeArr.push( new routeGradeObj(route.type, rating, 1, initialSportFrequency, initialTradFrequency, initialBoulderFrequency, route.difficultyindex ));
      				}
      			}

      			// Sort the array by the difficultyindex property
      			function compare(a,b) {
      			  if (a.difficultyindex < b.difficultyindex)
      			     return -1;
      			  if (a.difficultyindex > b.difficultyindex)
      			    return 1;
      			  return 0;
      			}
      			gradeArr.sort(compare);
      		}

      		return gradeArr;
      	}

      	////
      	// Build the chart
      	////
      	this.build = function (routeArr) {

          this.setState({routeArr : routeArr});

          if(routeArr && routeArr.length > 0){
        		var targetEl = document.createElement('div');

        		var gradeArr = this.getGradeArr(routeArr);

        		var margin = {top: 20, right: 20, bottom: 40, left: 40};

        		if(!this.state.width){
        			var dynamicWidth = gradeArr.length * 35;
        			if(dynamicWidth < 300){
                this.setState({width : 300});
        			}
        			else if (dynamicWidth > 1000){
                this.setState({width : 1000});
        			}
        			// this.setState({width : defaultWidth - margin.left - margin.right});
        		}
        		else{
              this.setState({width : defaultWidth - margin.left - margin.right});
        		}


        		var height = 200 - margin.top - margin.bottom;

        		var x = d3.scale.ordinal()
        		    .rangeRoundBands([0, this.state.width], .2);

        		var y = d3.scale.linear()
        		    .rangeRound([height, 0]);

        		var xAxis = d3.svg.axis()
        		    .scale(x)
        		    .orient("bottom");

        		var yAxis = d3.svg.axis()
        		    .scale(y)
        		    .orient("left")
        		    .tickValues(this.getTickArray(gradeArr));

        		var svg = d3.select(targetEl).append("svg")
        		    .attr("width", this.state.width + margin.left + margin.right)
        		    .attr("height", height + margin.top + margin.bottom)
        		    .append("g")
        		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        			x.domain(gradeArr.map(function(d) { return d.rating; }));
        		  	y.domain([0, d3.max(gradeArr, function(d) { return d.frequency; })]);

        		  svg.append("g")
        		      .attr("class", "x axis")
        		      .attr("transform", "translate(0," + height + ")")
        		      .call(xAxis)
        		      .selectAll("text")
        	         .style("text-anchor", "end")
        	         .attr("dx", "-.8em")
        	         .attr("dy", ".15em")
        	         .attr("transform", function(d) {
        	             return "rotate(-65)"
        	             });

        		  svg.append("g")
        		      .attr("class", "y axis")
        		      .call(yAxis)
        		    .append("text")
        		      .attr("transform", "rotate(-90)")
        		      .attr("y", 4)
        		      .attr("dy", ".71em")
        		      .style("text-anchor", "end")
        		      .text("Routes");

        		  svg.selectAll(".bar")
        		      .data(gradeArr)
        		    	.enter().append("rect")
        		      .attr("class", "bar")
        		      .attr("x", function(d) { return x(d.rating); })
        		      // .attr("y", height )
        		      // .attr("height", 0 )
        		      .attr("width", x.rangeBand())
        		      // .transition().delay(function (d, i) { return i*100; })
        		      // .duration(500)
        		      .attr("y", function(d) { return y(d.frequency); })
        		      .attr("height", function(d) { return height - y(d.frequency); })

               return targetEl;
            }

            return null;
      	}
    }

    componentWillReceiveProps(newProps) {
      if(newProps && newProps.data){
        this.setState({ d3: this.build(newProps.data) });
      }
      else{
        this.setState({routeArr : null})
        this.setState({ d3: null });
      }
    }

    componentDidMount() {
      // TODO: Probably not set state sequentially like this
      // this.setState({routeArr: this.props.data});
      this.setState({ d3: this.build(this.props.data) });

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


export default CountByGradeBarChartComponent;
