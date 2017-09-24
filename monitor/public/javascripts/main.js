var socket = io();

var binObjects={};

socket.on('binData',function (data) {
	//rendrGraph(data);
	binObjects[data['id']]=data;
	var array = $.map(binObjects, function(value, index) {
		return [value];
	});
	render(array);
	console.log(array);
});


		
/*function rendrGraph(data) {
	var canvas = d3.select("body").append("svg")
		.attr("width",500)
		.attr("height",500)
	console.log("in");

	canvas.selectAll("rect")
		.data(data)
		.enter()
			.append("rect")
			.attr("width", function(d) {return d.quantity;})
			.attr("height", 45)
			.attr("y", function(d,i) {return i;})
			.attr("fill", "steelblue");
	console.log("out");

	canvas.selectAll("text")
		.data(data)
		.enter()
			.append("text")
			.attr("fill", "white")
			.attr("y", function(d,i) {return i+2;})
			.text(function (d,i) { return i+1; })
}*/

var canvas={};
d3.json("mydata.json", render);

function render(data){
		$("#graph").empty();
		canvas = d3.select("#graph").append("svg")
			.attr("width",500)
			.attr("height",500)
			.attr("id","mySvg");

		canvas.selectAll("rect")
			.data(data)
			.enter()
				.append("rect")
				.attr("width", function(d) {return d.quantity*4;})
				.attr("height", 45)
				.attr("y", function(d,i) {return i*50;})
				.attr("fill", "steelblue");

		canvas.selectAll("text")
			.data(data)
			.enter()
				.append("text")
				.attr("fill", "white")
				.attr("y", function(d,i) {return i*50 +24;})
				.text(function (d,i) { return d.id; })

}