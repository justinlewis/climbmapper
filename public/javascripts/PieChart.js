function PieChart(feature, targetEl, width) {
	var data = [];
	var trad = feature.properties.customTradCt;
	var sport = feature.properties.customSportCt;
	var boulder = feature.properties.customBoulderCt;
	var alpine = feature.properties.customAlpineCt;
	
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
	    .innerRadius(25);
	
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
			    var c = arc.centroid(d),
			        x = c[0],
			        y = c[1],
			        // pythagorean theorem for hypotenuse
			        h = Math.sqrt(x*x + y*y);
			    return "translate(" + (x/h * labelr) +  ',' +
			       (y/h * labelr) +  ")"; 
			})					      
	      .attr("text-anchor", function(d) {
			    return (d.endAngle + d.startAngle)/2 > Math.PI ?
			        "end" : "start";
			})
			.style("font-size","14px")
	      .text(function(d) { 
	      	return d.data.type; 
	      });
	      
	
	return svg;
}