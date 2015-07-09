var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Room = require('./room.js');
var Player = require('./player.js');
var Game = require('./game.js');

// CONFIGURATION
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

/*  Room
    name: str
    public: bool
    password: str
    people: arr
    chatHistory: arr
    gameStarted: bool
    game: game obj;
*/
var default_lobby = new Room('lobby');
var rooms = { 'lobby': default_lobby };

/*  Player
    name: str
    role: str ('admin' | 'player')
    room: str
*/
var test_player = new Player('bot');
var players = { 'socketid': test_player };

var nicknames = ['bot'];

module.exports.players = players;
module.exports.rooms = rooms;

io.on('connection', function(socket) {
    console.log('a user connected');
    console.log('socket id: ' + socket.id);

    // EVENT HANDLERS

    // Disconection of registered players
    socket.on('disconnect', function() {
        console.log(socket.id + ' has left the game');

        if (players.hasOwnProperty(socket.id)) {
            var name = players[socket.id].getName();
            var i = nicknames.indexOf(name);

            // Delete from nicknames
            nicknames.splice(i, 1);

            // Delete from players
            delete players[socket.id];
            console.log(players);
            console.log(nicknames);

            // Leave room - socket.io handles it
        }
    });

    // handle user registration
    socket.on('register', function(nickname) {
       console.log("server register: " + nickname + " " + socket.id);
 
        var player = new Player(nickname);
        players[socket.id] = player;
        nicknames.push(nickname);

        socket.join('lobby');

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
            var newRoom = new Room(roomName, socket.id);
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
            io.to(roomName).emit('role-change', socket.id);
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
                    if (rooms[val].isPlaying()) {
                        socket
                            .emit('form-validate-result', false,
                                  'Game is in progress! Join later');
                    } else {
                        socket.emit('form-validate-result', true);
                    }
                } else {
                    socket
                        .emit('form-validate-result', false,
                              '\'' + val + '\' does not exists');
                }
                break;
        }
    });

    // Handle message transfer
    // If game is not in progress, everyone is in chat mode
    // If there is a ongoing game, all players will be in answer mode
    // and only the game master is in chat mode
    socket.on('message', function(msg) {
        var sender = players[socket.id];
        var senderName = sender.getName();
        var rmName = sender.getRoom();
        var rm = rooms[rmName];

        // Check if it is a chat message or a game answer
        if (rm.isPlaying() && sender.getRole() === 'player') {
            console.log('checking ans');
            // message as ans
            if (rm.game.checkAns(msg)) {
                // End game
                // Add to player score
                console.log('Correct!');
                var data = {
                    type: 'proper',
                    gm: rm.getGm(),
                    id: socket.id,
                    name: senderName,
                    msg: msg
                };
                // io.to(rmName).emit('correct-ans', data);
                // rm.endGame();
                endGame(rmName, data);

                console.log(rooms[rmName]);
            } else {
                // Do nothing 
                console.log('Wrong. Try again');
                socket.broadcast.to(rmName).emit('message', data);
                socket.emit('wrong-ans');
            }
        } else {
            // normal chat messages
            console.log('chat messages');
            var data = {
                id: socket.id,
                name: senderName,
                msg: msg
            };

            socket.broadcast.to(rmName).emit('message', data);
        }
    });

    // Handle game making
    socket.on('make-game', function(valArr) {
        var player = players[socket.id];
        var rmName = player.getRoom();
        var game = new Game(valArr[0], valArr[1], valArr[2]);
        var data = {
            gm: socket.id,
            name: player.getName(),
            qns: game.qns,
            cat: game.category,
        };

        // End current game
        rooms[rmName].endGame();

        // Update room game status
        rooms[rmName].startGame(game);

        io.to(rmName).emit('start-game', data);
    });

    // Handle end game
    socket.on('end-game', function() {
        console.log('end game');
        var data = {
            type: 'improper',
            id: socket.id,
            name: players[socket.id].getName(),
        };
        var rmName = players[socket.id].getRoom();
        endGame(rmName, data);
    });

});


function endGame(roomName, data) {
    io.to(roomName).emit('end-game', data);
    rooms[roomName].endGame();
}

var port = process.env.PORT || 3000;
http.listen(port, function() {
    console.log('listening on *:' + port);
});
