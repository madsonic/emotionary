var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// CONFIGURATION
app.use(express.static(__dirname + '/public'));
app.use('/vendor', express.static(__dirname + '/vendor'));

app.get('/', function(req, res) {
    res.sendFile('/index.html');
});

io.on('connection', function(socket) {
    console.log(__dirname);
    console.log('a user connected');
    console.log('socketid: ' + socket.id);
    
    socket.on('echo', function(data) {
        socket.emit('echo', data);
    });

    // activeRooms - keeps track of the rooms active currently
    var activeRooms = {
        'room1': { 
            "owner": 123,
            "canJoin": true
        }
    };

    // create new room for the user. (if the room is not taken)
    socket.on('create-room', function(roomName) {
        if (activeRooms.hasOwnProperty(roomName)) {
            socket.emit('room-error', '\"' + roomName + '\" already exists. Please choose another name');
        } else {
            activeRooms.roomName = {
                "owner": socket.id,
                "canJoin": true
            };

            socket.join(roomName);
            socket.emit('success', '\"' + roomName + '\" successfully created.');
        }

    });

    socket.on('join-room', function(roomName) {
        console.log(roomName);
        var room = activeRooms[roomName];
        if (room !== undefined && room.canJoin === true) {
            socket.join(roomName);
        } else {
            socket.emit('room-error', 'Unable to join room. Either room doesn\'t exist or game has already started');
        }
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
