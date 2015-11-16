function LineChart(dataArr, targetEl, width) {
	
	this.width = width || 200;
	this.height = 200;
	this.data = [];
	this.totalCt = 0;
	this.totalTradCt = 0;
	this.totalSportCt = 0;
	this.totalBoulderCt = 0;
	this.totalAlpineCt = 0;
	
	
	this.sortDatesAscending = function (date1, date2) {
	  // This is a comparison function that will result in dates being sorted in
	  // ASCENDING order. 
	  if (date1.date > date2.date) return 1;
	  if (date1.date < date2.date) return -1;
	  return 0;
	};
	
	this.dateExists = function(date) {
		for (var dc=0; dc<this.data.length; dc++) {
			var dateEntry = this.data[dc];
			if (dateEntry.date.getTime() === date.getTime()) {
				return true;
			}
		}
		return false;
	}
	
	
	this.buildData = function () {
		var routes = [];
			
		for (var di=0; di<dataArr.length; di++) {
			var area = dataArr[di];
			for (var a=0; a<area.properties.customTicksArr.length; a++) {
				var feature = area.properties.customTicksArr[a];
				
				routes.push({"date":new Date(feature.date), "type":feature.type});
			}
		}
		
		routes = routes.sort(this.sortDatesAscending);
	
		// Build array aggregated by date
		for (var d=0; d<routes.length; d++) {
			var rt = routes[d];
			var exists = this.dateExists(rt.date)
	
			if (exists) {	
				this.updateExisting(rt);
			}
			else{
				
				this.totalCt = this.totalCt + 1;
	
				if(rt.type === "Trad"){
					this.totalTradCt = this.totalTradCt + 1;
					this.data.push({"Total":this.totalCt, "Trad":this.totalTradCt, "Sport":this.totalSportCt, "Boulder":this.totalBoulderCt, "Alpine":this.totalAlpineCt, "date":rt.date});
				}
				else if(rt.type === "Sport"){
					this.totalSportCt = this.totalSportCt + 1;
					this.data.push({"Total":this.totalCt, "Trad":this.totalTradCt, "Sport":this.totalSportCt, "Boulder":this.totalBoulderCt, "Alpine":this.totalAlpineCt, "date":rt.date});
				}
				else if(rt.type === "Boulder"){
					this.totalBoulderCt = this.totalBoulderCt + 1;
					this.data.push({"Total":this.totalCt, "Trad":this.totalTradCt, "Sport":this.totalSportCt, "Boulder":this.totalBoulderCt, "Alpine":this.totalAlpineCt, "date":rt.date});
				}
				else if(rt.type === "Alpine"){
					this.totalAlpineCt = this.totalAlpineCt + 1;
					this.data.push({"Total":this.totalCt, "Trad":this.totalTradCt, "Sport":this.totalSportCt, "Boulder":this.totalBoulderCt, "Alpine":this.totalAlpineCt, "date":rt.date});
				}
				else if(rt.type === "Top-Rope"){
					// TODO: add top rope routes
				}
			}
		}
	}
	
	
	this.updateExisting = function(route) {
		for (var dc=0; dc<this.data.length; dc++) {
			var dateEntry = this.data[dc];
			if(dateEntry.date.getTime() === route.date.getTime()){
				this.totalCt = this.totalCt + 1;
				dateEntry.Total = this.totalCt;
				
				if(route.type === "Trad"){
					this.totalTradCt = this.totalTradCt + 1;
				}
				else if(route.type === "Sport"){
					this.totalSportCt = this.totalSportCt + 1;
				}
				else if(route.type === "Boulder"){
					this.totalBoulderCt = this.totalBoulderCt + 1;
				}
				else if(route.type === "Alpine"){
					this.totalAlpineCt = this.totalAlpineCt + 1;
				}
				else if(route.type === "Top-Rope"){
					// TODO: add top rope routes
				}
				
				dateEntry.Trad = this.totalTradCt;
				dateEntry.Sport = this.totalSportCt;
				dateEntry.Boulder = this.totalBoulderCt;
				dateEntry.Alpine = this.totalAlpineCt;
			}
		}
	}
	
	
	////
	// Build the chart
	////
	this.build = function () {	
		var that = this;
		
		this.buildData()
		
	/*	var color = d3.scale.ordinal()
		    .range(["#193441", "#3E606F", "#91AA9D", "#D1DBBD"]);*/
		
		var margin = {top: 20, right: 80, bottom: 30, left: 50}
	
		var parseDate = d3.time.format("%Y%m%d").parse;
		
		var x = d3.time.scale().range([0, this.width - margin.right - margin.left]);	
		var y = d3.scale.linear().range([this.height - margin.top - margin.bottom, 0]);
		var color = d3.scale.category10();
		
		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");
		
		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");
		
		var line = d3.svg.line()
		    .interpolate("basis")
		    .x(function(d) { return x(d.date); })
		    .y(function(d) { return y(d.total); });
		
		var svg = d3.select(targetEl).append("svg")
		    .attr("width", this.width)
		    .attr("height", this.height)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		color.domain(d3.keys(this.data[0]).filter(function(key) { return key !== "date"; }));
		
		var climbType = color.domain().map(function(name) {
		    return {
		      name: name,
		      values: that.data.map(function(d) {
		        return {date: d.date, total: +d[name]};
		      })
		    };
		});
		
		x.domain(d3.extent(this.data, function(d) { return d.date; }));
		
		y.domain([d3.min(climbType, function(c) { return d3.min(c.values, function(v) { return v.total; }); }),
		    d3.max(climbType, function(c) { return d3.max(c.values, function(v) { return v.total; }); })
		]);
	
		svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + String(this.height - margin.top - margin.bottom) + ")")
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
		
		var city = svg.selectAll(".city")
	      .data(climbType)
	    	.enter().append("g")
	      .attr("class", "city");
		
		city.append("path")
	      .attr("class", "line")
	      .attr("d", function(d) { return line(d.values); })
	      .style("stroke", function(d) { return color(d.name); });
		
		city.append("text")
	      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
	      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.total) + ")"; })
	      .attr("x", 3)
	      .attr("dy", ".35em")
	      .text(function(d) { return d.name; });	      
	}
}