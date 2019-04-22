var rainbow = d3.scaleSequential(d3.interpolateWarm).domain([0,12]);


(function () { 
var width =window.innerWidth,
height = window.innerHeight;
var svg = d3.select("#chart")
.append("svg")
.attr("height", height)
.attr("width", width)
.append("g")
.attr("transform", "translate(0,0)")


var defs = svg.append("defs");
defs.append("pattern")



var radiusScale =d3.scaleSqrt().domain([2.4,7.9]).range([10,20])

var forceXSeperate = d3.forceX(function(d){
	if (d.Gender === "Male"){
		return 250
	}else {
		return 750
	}
	return width/2
}).strength(0.05)


var forceXSeperate2 = d3.forceX(function(d){
	if (d.Gender === "Female"){
		return 250
	}else {
		return 750
	}
	return width/2
}).strength(0.05)

var forceXSeperate3 = d3.forceX(function(d){
	if (d.Gender === "Persons"){
		return 250
	}else {
		return 750
	}
	return width/2
}).strength(0.05)

var forceXCombine = d3.forceX(width/2).strength(0.05)

var forceCollide = d3.forceCollide(function(d){
	return radiusScale(d.Percent) + 1;
})



var simulation = d3.forceSimulation()
.force("x", forceXCombine)
.force("y", d3.forceY(height/2).strength(0.05))
.force("collide", forceCollide)

d3.queue()
.defer(d3.json, "aihw1.json")
.await(ready)

function ready (error, datapoints) {

//defs.append("Age_group-pattern")
defs.selectAll(".Age_group-pattern")
.data(datapoints)
.enter().append("pattern")
.attr("class","Age_group-pattern")
.attr("id",function(d){
	return d.name
})
.attr("height","100%")
.attr("patternContentUnits","objectBoundingBox")
.append("image")
.attr("height", 1)
.attr("width", 1)
.attr("preserveAspectRatio", "none")
.attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
.attr("xlink:href", function(d) {
	return d.image_path
});



var circles = svg.selectAll(".Age_group")
.data(datapoints)
.enter().append("circle")
.attr("class", "Age_group")
.attr("r",function(d){
	return radiusScale(d.Percent)
})
.attr("fill", function(d,i){
	return rainbow(i);
})
.on("click",function(d){
	console.log(d)
})


var texts = svg.selectAll(null)
    .data(datapoints)
    .enter()
    .append('text')
		.attr("text-anchor", "middle")
		.text((datapoints) => { return datapoints.Age_group ; })
    // .text(d => d.Gender, d => d.Percent)
    .attr('color', 'black')
    .attr('font-size', 15)







d3.select("#gender_males").on("click", function(d){
	simulation
	.force("x", forceXSeperate)
	.alphaTarget(0.5)
	.restart()
})


d3.select("#gender_females").on("click", function(d){
	simulation
	.force("x", forceXSeperate2)
	.alphaTarget(0.5)
	.restart()
})


d3.select("#gender_persons").on("click", function(d){
	simulation
	.force("x", forceXSeperate3)
	.alphaTarget(0.5)
	.restart()
})

d3.select("#combine").on("click", function(d){
	simulation
	.force("x", forceXCombine)
	.alphaTarget(0.5)
	.restart()
})

simulation.nodes(datapoints)
.on('tick', ticked)

function ticked() {
	circles
	.attr("cx", function(d){
	return d.x
	})

	.attr("cy", function(d){
	return d.y
	})
	
	
	
	texts.attr('x', (data) => {
            return data.x
        })
        .attr('y', (data) => {
            return data.y
        });

}

}

})();
