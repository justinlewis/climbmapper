function PieChart(feature) {
	var data = [];
	var trad = feature.properties.customTradCt;
	var sport = feature.properties.customSportCt;
	var boulder = feature.properties.customBoulderCt;
	var alpine = feature.properties.customAlpineCt;
	
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
	
	var width = 225,
	    height = 150,
	    radius = Math.min(width, height) / 2,
	    labelr = radius -20; // radius for label anchor
	
	var color = d3.scale.ordinal()
	    .range(["#505050", "#0a4958", "#003399", "#a31e39"]);
	
	var arc = d3.svg.arc()
	    .outerRadius(radius - 30)
	    .innerRadius(0);
	
	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d.count; });
	
	var svg = d3.select("#pie").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .append("g")
	    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
										
	  var g = svg.selectAll(".arc")
	      .data(pie(data))
	    .enter().append("g")
	      .attr("class", "arc");
	
	  g.append("path")
	      .attr("d", arc)
	      .style("fill", function(d) { return color(d.data.type); });
	
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
			    // are we past the center?
			    return (d.endAngle + d.startAngle)/2 > Math.PI ?
			        "end" : "start";
			})
			.style("font-size","14px")
	      .text(function(d) { return d.data.type; });
	
	return svg;
}