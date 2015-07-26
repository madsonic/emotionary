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
var __lobby = new Room('Lobby');
var __lobbyName = __lobby.getName();
var __rooms = {};
__rooms[__lobbyName] = __lobby;

/*  Player
    name: str
    role: str ('admin' | 'player')
    room: str
*/
var testPlayer = new Player('bot');
var __players = { 'socketid': testPlayer };

var nicknames = ['bot'];

module.exports.players = __players;
module.exports.rooms = __rooms;

io.on('connection', function(socket) {
    console.log(socket.id + ' has connected');

    // EVENT HANDLERS

    // Disconection of registered players
    socket.on('disconnect', function() {
        console.log(socket.id + ' has left the game');

        if (__players.hasOwnProperty(socket.id)) {
            var name = __players[socket.id].getName();
            var i = nicknames.indexOf(name);

            // Delete from nicknames
            nicknames.splice(i, 1);

            // Delete from players
            delete __players[socket.id];
            console.log(__players);
            console.log(nicknames);

            // Leave room - socket.io handles it
        }

    });

    ////////////////////
    //   Room Stuff   //
    ////////////////////

    // handle user registration
    socket.on('register', function(nickname) {
 
        var player = new Player(nickname);
        console.log(player);
        socket.join(__lobbyName, function() {
            console.log('join default lobby');
            // player.setRoom(__lobbyName);

            __players[socket.id] = player;
            nicknames.push(nickname);
            
            io.to(__lobbyName)
                  .emit('room-update', 
                        {
                          id: socket.id,
                          greeting: nickname + ' has joined',
                          room: player.getRoom(),
                        });
        });

    });

    // create new room for the user.
    socket.on('create-room', function(roomName) {

        var player = __players[socket.id];
        var oldRoom = player.getRoom();
        var newRoom = new Room(roomName, socket.id, player.getName());

        // remove room if last player in room
        socket.leave(oldRoom, function() {
            __rooms[oldRoom].evictOccupants(player.getName());

            if (oldRoom !== __lobbyName && __rooms[oldRoom].isEmpty()) {
                delete __rooms[oldRoom];
            }
        });
        
        // Update player status.
        // Room creators are game master by default
        socket.join(roomName, function() {
            player.setRoom(roomName);
            player.setRole('gm');

            // Update room list
            __rooms[roomName] = newRoom;

            socket.emit('room-update', 
                        {
                            id: socket.id,
                            room: roomName
                        });
            socket.emit('role-change', socket.id);
        });
    });

    // handle room joining
    socket.on('join-room', function(roomName) {

        var player = __players[socket.id];
        var oldRoom = player.getRoom();
        var newRoom = __rooms[roomName];

        // remove room if last player in room
        socket.leave(oldRoom, function() {
            __rooms[oldRoom].evictOccupants(player.getName());

            if (oldRoom !== __lobbyName && __rooms[oldRoom].isEmpty()) {
                delete __rooms[oldRoom];
            }
        });
        
        // Update player status
        socket.join(roomName, function() {
            player.setRoom(roomName);
            player.setRole('player');
            __rooms[roomName].addOccupant(player.getName());

            io.to(roomName).emit('room-update', 
                      { 
                        id: socket.id,
                        greeting: player.getName() + ' has joined',
                        room: roomName,
                      });
            socket.emit('role-change', newRoom.getGmID());
        });

    });

    ////////////////////
    //   Form Stuff   //
    ////////////////////

    // Handle input validation
    socket.on('validate', function(formName, val) {
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
                if (__rooms.hasOwnProperty(val)) {
                    socket
                        .emit('form-validate-result', false,
                              '\'' + val + '\' already exists');
                } else {
                    socket.emit('form-validate-result', true);
                }
                break;

            case 'join-room':
                if (__rooms.hasOwnProperty(val)) {
                    if (__rooms[val].isPlaying()) {
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

    ////////////////////
    //   Game Stuff   //
    ////////////////////

    // Handle message transfer
    // If game is not in progress, everyone is in chat mode
    // If there is a ongoing game, all players will be in answer mode
    // and only the game master is in chat mode
    socket.on('message', function(msg) {
        var sender = __players[socket.id];
        var senderName = sender.getName();
        var rmName = sender.getRoom();
        var rm = __rooms[rmName];

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
                    gm: rm.getGmID(),
                    id: socket.id,
                    name: senderName,
                    msg: msg
                };
                // io.to(rmName).emit('correct-ans', data);
                // rm.endGame();
                endGame(rmName, data);

                console.log(__rooms[rmName]);
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
        var player = __players[socket.id];
        var rmName = player.getRoom();
        var game = new Game(valArr[0], valArr[1], valArr[2]);
        var data = {
            gm: socket.id,
            name: player.getName(),
            qns: game.qns,
            cat: game.category,
        };

        // End current game
        __rooms[rmName].endGame();

        // Update room game status
        __rooms[rmName].startGame(game);

        io.to(rmName).emit('start-game', data);
    });

    // Handle end game
    socket.on('end-game', function() {
        console.log('end game');
        var data = {
            type: 'improper',
            id: socket.id,
            name: __players[socket.id].getName(),
        };
        var rmName = __players[socket.id].getRoom();
        endGame(rmName, data);
    });

});


function endGame(roomName, data) {
    io.to(roomName).emit('end-game', data);
    __rooms[roomName].endGame();
}

var port = process.env.PORT || 3000;
http.listen(port, function() {
    console.log('listening on *:' + port);
});
