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
    'socketid': {
        name: 'bot',
        role: 'admin',
        room: 'lobby'
    }
};

var nicknames = ['bot'];

module.exports.players = players;

io.on('connection', function(socket) {
    console.log('a user connected');
    console.log('socket id: ' + socket.id);

    // EVENT HANDLERS

    // handle user registration
    socket.on('register', function(nickname) {
        console.log("server register: " + nickname);

        // Checks if nickname is used
        if (nicknames.indexOf(nickname) !== -1) {
            console.log('nickname already exists');
            socket.emit('register-fail');
        } else {
            console.log('new nickname' + socket.id);
            var player = new Player(nickname, socket.id);
            players[socket.id] = player;

            rooms.lobby.players.push(socket.id);

            nicknames.push(nickname);
            console.log(players);
            console.log(nicknames);

            // Declare success to client
            socket
              .emit('rm-update-success', 
                    {
                      msg: 'Welcome ' + nickname, 
                      room: player.getRoom(),
                    });
        }
    });

    // create new room for the user.
    socket.on('create-room', function(roomName) {

        if (rooms.hasOwnProperty(roomName)) {
            console.log("create room error");
            socket.emit('room-error', '\"' + roomName + '\" already exists. Please choose another name');
        } else {
            console.log('making room');
            var newRoom = new Room(roomName);
            var oldRoom = players[socket.id].getRoom();

            // Update player status
            socket.join(roomName);
            socket.leave(oldRoom);
            players[socket.id].setRoom(roomName);

            // Update room list
            rooms[roomName] = newRoom;

            console.log(rooms);

            socket.emit('rm-update-success', 
                        {
                            msg: '\"' + roomName + '\" successfully created.', 
                            room: newRoom
                        });
        }
    });

    // handle room joining
    socket.on('join-room', function(roomName) {

        var newRm = rooms[roomName];

        if(!rooms.hasOwnProperty(roomName)) {
            // no such room
            console.log('no such room');
        } else if (!newRm.isOpen()) {
            // room closed
            console.log('room closed');
        } else { // join the room
            console.log('joining room');
            var oldRmName = players[socket.id].room;

            // Update player status
            socket.join(roomName);
            socket.leave(oldRmName);
            players[socket.id].setRoom(roomName);
<<<<<<< HEAD
            
            socket.emit('success', 'Welcome to ' + roomName, room);
        } else {
            socket.emit('room-error', 'Unable to join room. Either room doesn\'t exist or game has already started');
=======

            var msg = 'Welcome to ' + roomName         
            socket.emit('rm-update-success', {msg: msg, room: newRm});
>>>>>>> Refactor success events
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
