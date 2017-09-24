var socket = io();

socket.on('binData',function (data) {
	console.log(data);
});