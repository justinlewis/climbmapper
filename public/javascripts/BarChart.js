
////
// Builds the bar chart when a ToDo feature is clicked
//
// This needs so much work it's not even funny
//
////
function BarChart(routeArr, targetEl, width){
	this.width = width;
	this.targetEl = targetEl;
	this.routeArr = routeArr;
						
	// TODO: replace with database lookup
	this.ratingLookup = { "ratings": 
		 		{
		 			"5.0" : 0,
		 			"5.1" : 1,
		 			"5.2" : 2,
		 			"5.3" : 3,
		 			"5.4" : 4,
		 			"5.5" : 5,
		 			"5.6" : 6,
		 			"5.7" : 7,
		 			"5.8" : 8,
		 			"5.9" : 9,
		 			"5.10" : 10,
		 			"5.10a" : 11,
		 			"5.10b" : 12,
		 			"5.10c" : 13,
		 			"5.10d" : 14,
		 			"5.11" : 15,
		 			"5.11a" : 16,
		 			"5.11b" : 17,
		 			"5.11c" : 18,
		 			"5.11d" : 19,
		 			"5.12" : 20,
		 			"5.12a" : 21,
		 			"5.12b" : 22,
		 			"5.12c" : 23,
		 			"5.12d" : 24,
		 			"5.13" : 25, 
		 			"v0" : 26,
		 			"v1" : 27,
		 			"v2" : 28,
		 			"v3" : 29,
		 			"v4" : 30,
		 			"v5" : 31,
		 			"v6" : 32,
		 			"v7" : 33,
		 			"v8" : 34,
		 			"v9" : 35,
		 			"v10" : 36 					
		 }
	};		
	
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
		
		if($(targetEl)){
			$(targetEl).html("");
		}
		
		if(routeArr.length === 0){
			$(targetEl).html("Sorry, there are no routes for this location.");
		}
		else{
			var routeGradeObj = function (rating, frequency, sportFrequency, tradFrequency, boulderFrequency, orderIndex) { 
				this.rating = rating, 
				this.frequency = frequency,
				this.orderIndex = orderIndex,
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
				var gradeExists = checkGradeExists(rating, gradeArr);		
				if( gradeExists ){	
					//
					//Iterate over existing grade (rating) objects to increment frequency properties		
					//
					for(var rg=0; rg<gradeArr.length; rg++){
						if( rating == String(gradeArr[rg].rating).trim() ){
							
							gradeArr[rg].frequency = gradeArr[rg].frequency + 1;
							
							switch(type.toLowerCase()){
								case 'sport':
								gradeArr[rg].sportFrequency = gradeArr[rg].sportFrequency + 1;
								break;
							case 'trad':
								gradeArr[rg].tradFrequency = gradeArr[rg].tradFrequency + 1;
								break;
							case 'boulder':
								gradeArr[rg].boulderFrequency = gradeArr[rg].boulderFrequency + 1;
								break;
							}
						}			
					}								
				}
				else{
					var ratingIndex = this.ratingLookup.ratings[rating];
					if(!ratingIndex){
						ratingIndex = 999;
					}
				
					var initialSportFrequency = 0;
					var initialTradFrequency = 0;
					var initialBoulderFrequency = 0;
					switch(type.toLowerCase()){
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
												
					gradeArr.push( new routeGradeObj( rating, 1, initialSportFrequency, initialTradFrequency, initialBoulderFrequency, ratingIndex ));
				}												
			}
			
			// Sort the array by the orderIndex property
			function compare(a,b) {
			  if (a.orderIndex < b.orderIndex)
			     return -1;
			  if (a.orderIndex > b.orderIndex)
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
	this.build = function () {	
	
		// Clear the chart
		if($(targetEl)){
			$(targetEl).html("");
		}
							
		var gradeArr = this.getGradeArr(routeArr);
		
		var margin = {top: 20, right: 20, bottom: 40, left: 40};
		
		if(!this.width){
			var dynamicWidth = gradeArr.length * 35;
			if(dynamicWidth < 300){
				this.width = 300;
			}
			else if (dynamicWidth > 1000){
				this.width = 1000;
			}
			this.width = this.width - margin.left - margin.right;
		}
		else{
			this.width = this.width - margin.left - margin.right;
		}
		
		
		var height = 200 - margin.top - margin.bottom;
		
		var x = d3.scale.ordinal()
		    .rangeRoundBands([0, this.width], .2);
		
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
		    .attr("width", this.width + margin.left + margin.right)
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
		      .attr("y", height )
		      .attr("height", 0 )
		      .attr("width", x.rangeBand())
		      .transition().delay(function (d, i) { return i*100; })
		      .duration(500)
		      .attr("y", function(d) { return y(d.frequency); })
		      .attr("height", function(d) { return height - y(d.frequency); })
		      
		   
	}
}