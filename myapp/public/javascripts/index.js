// dustbin constructor 
function Dustbin (id,quantity,lat,long) {
	this.id=id;
	this.quantity=10;
	this.lat=lat;
	this.long=long;
	this.getJson = function(){
		var jsonObj={};
		jsonObj['id']=this.id;
		jsonObj['quantity']=this.quantity;
		jsonObj['lat']=this.lat;
		jsonObj['long']=this.long;
		return jsonObj;
	}

	this.getLocation = function(){
		var jsonObj={};
		jsonObj['lat']=this.lat;
		jsonObj['lng']=this.long;
		return jsonObj;
	}

	this.setLocation = function(lat,lng){
		var jsonObj={};
		this.lat=lat;
		this.long=lng;
		return jsonObj;
	}
}


var binsArray=[];
var quantity=0;
var binTemplate="";

var map;
var marker=null;
var socket = io();

$( document ).ready(function() {
    console.log( "ready!" );
    $.ajax({url: "/template/bins.tlp.hbs", success: function(result){
    	 template  = Handlebars.compile(result);
    	 binTemplate=template;

    	 // add one bin by default
		var item = new Dustbin(quantity++,10,26.2389,73.0243);
		binsArray.push(item);
		$('#data').append(binTemplate(item.getJson()));    	 
         // $('#data').append(template);
    }});

	
    // Jugad

	// $('#myModal').modal('show');
	// $('#myModal').modal('hide');

});

function placeMarker(map,latLng) {
	marker.setPosition(latLng);
	// console.log(latLng.lat());
	$('#lat').val(latLng.lat());
	$('#long').val(latLng.lng())
	// map.setCenter(marker.getPosition());
}

$('#btnAdd').click(function(){
	var item = new Dustbin(quantity++,10,26.2389,73.0243);
	binsArray.push(item);
	$('#data').append(binTemplate(item.getJson()));
	// render();
});

$('#btnRemove').click(function(){
	if(quantity==0)
		return;
	$('#data #bin_id_'+(--quantity)).remove();
	binsArray.pop();
	// render();
});

function render(){
	var data='';
	// collect all the data in single string
	binsArray.forEach( function(element, index) {
		data+=binTemplate(element.getJson());
	});

	//append it
	$('#data').empty();
	$('#data').append(data);
}

setInterval(updateBins, 1000);

function updateBins(){
	// console.log('hello')
	binsArray.forEach(function(element, index) {
		if(element.quantity==100)
			element.quantity=0;
		else{
			element.quantity+=parseInt(Math.random()*20);
			if(element.quantity>100)
				element.quantity=100;
		}
		socket.emit('binData',element.getJson());
	});
	render();
}

// change Location callback
function changeLocation (id) {
	$('#myModal').modal('toggle');
	// console.log(binsArray[id].getLocation(),map);
	// map = new google.maps.Map(document.getElementById('map'));
	var lat=binsArray[id].getLocation()['lat'];
	var lng=binsArray[id].getLocation()['lng'];
	var latLng = new google.maps.LatLng(lat,lng);
	$("#btnSave").click(function () {
		console.log(id);
		binsArray[id].setLocation(marker.getPosition().lat(),marker.getPosition().lng());
		// so that evenlisteners dont stack
		$(this).unbind('click');
	});
	marker.setPosition(latLng);
	marker.setMap(map);
	map.setCenter(new google.maps.LatLng(lat, lng));
	$('#lat').val(lat);
	$('#long').val(lng);
	console.log('Change Location of '+id);

	// var marker = new google.maps.Marker({
 //  		position: binsArray[id].getLocation(),
 // 		map: map
	// });
}

function saveClicked(id) {
	
}

function initMap() {
	console.log("Map initilized")

	var uluru = {lat: 26.2389, lng: 73.0243};

	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 5,
		center: uluru
	});
	var latLng = new google.maps.LatLng(26.2389,73.0243);
	$('#myModal').one('shown.bs.modal', function () 
	{
	    google.maps.event.trigger(map, "resize");
	});

	marker = new google.maps.Marker({
  		position: latLng,
 		map: map
	});
    // initMap();
	google.maps.event.addListener(map, 'click', function(event) {
		console.log('Helo')
  		placeMarker(map, event.latLng);
  	});

	$("#lat").on("change paste keyup", function() {
   		marker.setPosition(new google.maps.LatLng($("#lat").val(),$("#long").val())); 
   		map.setCenter(marker.getPosition());
	});
	$("#long").on("change paste keyup", function() {
   		marker.setPosition(new google.maps.LatLng($("#lat").val(),$("#long").val())); 
   		map.setCenter(marker.getPosition());

	});
	changeLocation(0);

}

// $('#myModal').one('shown.bs.modal', function(){
// 	console.log("called")
//     initMap();
// });
