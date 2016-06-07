function PieChart(feature, targetEl, width, routeTypeFilter) {
	var data = [];
	var trad = 0;
	var sport = 0;
	var boulder = 0;
	var alpine = 0;

	if(routeTypeFilter === "ALL"){
		trad = feature.properties.customTradCt;
		sport = feature.properties.customSportCt;
		boulder = feature.properties.customBoulderCt;
		alpine = feature.properties.customAlpineCt;
	}
    else if(routeTypeFilter === "TRAD"){
    	trad = feature.properties.customTradCt;
    }
    else if(routeTypeFilter === "SPORT"){
    	sport = feature.properties.customSportCt;
    }
    else if(routeTypeFilter === "BOULDER"){
    	boulder = feature.properties.customBoulderCt;
    }
    else if(routeTypeFilter === "ALPINE"){
    	alpine = feature.properties.customAlpineCt;
    }
	
	function getAvg(targetCt, allCt) {
		var percent = (targetCt/allCt) * 100;
		return Math.round(percent);
	}
	
	if(trad > 0){
		data.push({"count":trad, "type":"Trad ("+trad+")"});
	}
	if(sport > 0){
		data.push({"count":sport, "type":"Sport ("+sport+")"});
	}
	if(boulder > 0){
		data.push({"count":boulder, "type":"Boulder ("+boulder+")"});
	}
	if(alpine > 0){
		data.push({"count":alpine, "type":"Alpine ("+alpine+")"});
	}
	
	if (!width) {
		var width = 200;
	}
	
	var height = 175,
	    radius = Math.min(width, height) / 2,
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
	    .attr("width", width)
	    .attr("height", height)
	    .append("g")
	    .attr("transform", "translate(" + width / 2 + "," + height / 1.75  + ")");
	    
	svg.append("text")
        		.attr("x", 0)             
        		.attr("y", 10 - height/2)
        		.attr("text-anchor", "middle")  
        		.style("font-size", "16px") 
        		.style("text-decoration", "underline")  
        		.text("Routes by Type");
										
	  var g = svg.selectAll(".arc")
	    .data(pie(data))
	    .enter().append("g")
	    .attr("class", "arc");
	
	  g.append("path")
	      .attr("d", arc)
	      .style("fill", function(d) { return color(d.data.type); })
	      .transition()
//	      .delay(function(d, i) { return i * 500; })
	      .duration(500)
	      .attrTween('d', function(d) {
       		var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
       		return function(t) {
           		d.endAngle = i(t);
         		return arc(d);
      		}
  			});
	
	  g.append("text")
	      //.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
	      //.style("text-anchor", "middle")
	      .attr("transform", function(d) {
			    var c = arc.centroid(d);
			    var x = c[0];
			    var y = c[1];
			        
			    // pythagorean theorem for hypotenuse
			    h = Math.sqrt(x*x + y*y);
			    
			    return "translate(" + (x/h * labelr) +  ',' + (y/h * labelr) +  ")"; 
			})					      
	      .attr("text-anchor", function(d) {
			    return (d.endAngle + d.startAngle)/2 > Math.PI ? "end" : "start";
			})
			.style("font-size","14px")
	      .text(function(d) { 
	      	return d.data.type; 
	      });
	           
	
	return svg;
}