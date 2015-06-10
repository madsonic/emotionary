var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Room = require('./room.js');
var Player = require('./player.js');

// CONFIGURATION
app.use(express.static(__dirname + '/public'));
app.use('/vendor', express.static(__dirname + '/vendor'));

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

/*
rooms - object with room (object)
1. room

room - object with
-name
-access
-password
-players
-chatHistory

players - objects with 
-name
-role
-room

*/
var rooms = {
    'lobby': { 
        name: 'lobby',
        access: true,
        password: '',
        players: [],
        chatHistory: []
    }
};

var players = {
    'bot': {
        name: 'bot',
        role: 'admin',
        room: 'lobby'
    }
};

module.exports.players = players;

io.on('connection', function(socket) {
    console.log('a user connected');
    console.log('socket id: ' + socket.id);

    // EVENT HANDLERS

    // handle user registration
    socket.on('register', function(nickname) {
        console.log("server register: " + nickname);
        var player = new Player(nickname, socket.id);
        players[socket.id] = player;
        console.log(players);
    });

    // create new room for the user.
    socket.on('create-room', function(roomName) {
        if (rooms.hasOwnProperty(roomName)) {
            console.log("create room error");
            socket.emit('room-error', '\"' + roomName + '\" already exists. Please choose another name');
        } else {
            console.log('making room');
            var room = new Room(roomName);
            var oldRoom = players[socket.id].room;

            socket.join(roomName);
            socket.leave(oldRoom);
            players[socket.id].setRoom(roomName);

            socket.emit('success', 
                        '\"' + roomName + '\" successfully created.', 
                        room);
        }
    });

    // handle room joining
    socket.on('join-room', function(roomName) {
        console.log(roomName);
        var room = rooms[roomName];
        if (room !== undefined && room.canJoin === true) {
            var oldRoom = players[socket.id].room;

            socket.join(roomName);
            socket.leave(oldRoom);
            players[socket.id].setRoom(roomName);
            
            socket.emit('success', 'Welcome to ' + roomName, room);
        } else {
            socket.emit('room-error', 'Unable to join room. Either room doesn\'t exist or game has already started');
        }
    });

    // handle message transfer
    socket.on('message', function(msg, id) {
        var data = {
            'msg': msg, 
            'id': id
        }
        socket.broadcast.emit('message', data);
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
