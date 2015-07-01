var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Room = require('./room.js');
var Player = require('./player.js');

// CONFIGURATION
app.use(express.static(__dirname + '/public'));

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
       console.log("server register: " + nickname + " " + socket.id);
 
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

            // Update player status.
            // Room creators are game master by default
            socket.join(roomName);
            socket.leave(oldRoom);
            players[socket.id].setRoom(roomName);
            players[socket.id].setRole('gm');

            // Update room list
            rooms[roomName] = newRoom;

            console.log(rooms);
            console.log(players[socket.id]);

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
        var player = players[socket.id];

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
            player.setRoom(roomName);

            if (player.getRole() === 'gm') { player.setRole('player'); }

            console.log(player);
            var msg = 'Welcome to \'' + roomName + '\''
            socket.emit('rm-update-success', {msg: msg, room: newRm});
        }
    });

    // Handle input validation
    socket.on('validate', function(formName, val) {
        console.log('validating')
        switch (formName) {

            case 'registration':
                if (nicknames.indexOf(val) === -1) {
                    socket.emit('form-validate-result', true);
                } else {
                    socket
                        .emit('form-validate-result', false,
                              '\'' + val + '\' already in use');
                }
                break;

            case 'create-room':
                console.log('create room');
                if (rooms.hasOwnProperty(val)) {
                    socket
                        .emit('form-validate-result', false,
                              '\'' + val + '\' already exists');
                } else {
                    socket.emit('form-validate-result', true);
                }
                break;

            case 'join-room':
                console.log('join room');
                if (rooms.hasOwnProperty(val)) {
                    socket.emit('form-validate-result', true);
                } else {
                    socket
                        .emit('form-validate-result', false,
                              '\'' + val + '\' does not exists');
                }
                break;
        }
    });

    // handle message transfer
    socket.on('message', function(msg) {
        console.log('message');
        var data = {
            msg: msg, 
            id: socket.id,
            name: players[socket.id].getName(),
        }
        socket.broadcast.emit('message', data);
    });
});
var port = process.env.PORT || 3000;
http.listen(port, function() {
    console.log('listening on *:' + port);
});
