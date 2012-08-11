var http = require('http').createServer(handler);
var io = require('socket.io').listen(http);
var sys = require('sys');
var fs = require('fs');

var clients = [];

http.listen(4000);

function handler(request, response) {

	response.writeHead(200, {
		'Content-Type':'text/html'
	});

	var rs = fs.createReadStream(__dirname + '/template.html');

	sys.pump(rs, response);

};


io.sockets.on('connection', function(socket) {

	var username;

	clients.push(socket);
	socket.emit('welcome', {'salutation':'Welcome to this chat server!'});
	socket.emit('welcome', {'salutation':'Please input your username:'});

	socket.on('data from client', function(data) {
		console.log('message ' + data.text);
		if(!username) {
			username = data.text;
			socket.emit('data from server', {'message': 'Welcome, ' + username + '!'});
			return;
		}
		var feedback = username + ' said: ' + data.text;

		clients.forEach(function(socket) {
			socket.emit('data from server', {'message': feedback});
		});
	});

});


