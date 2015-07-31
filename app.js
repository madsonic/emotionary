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

        // Delete player
        if (__players.hasOwnProperty(socket.id)) {
            var player = __players[socket.id]
            var name = player.getName();
            var i = nicknames.indexOf(name);
            var rm = player.getRoom();

            // Delete from nicknames
            nicknames.splice(i, 1);

            // Remove player from room guest list
            __rooms[rm].evictOccupants(name);
            closeEmptyRm(rm);

            // Delete from players
            console.log('deleting player ' + socket.id);
            delete __players[socket.id];

            // Leave room - socket.io handles it
        }
    });

    ////////////////////
    //   Room Stuff   //
    ////////////////////

    // handle user registration
    socket.on('register', function(nickname) {
        console.log('register event');
        var player = new Player(nickname);

        socket.join(__lobbyName, function() {
            console.log('join default lobby');

            // set up player
            __players[socket.id] = player;
            nicknames.push(nickname);

            // update room guest list
            __rooms[__lobbyName].addOccupant(nickname);
            
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
        console.log('create-room event');
        var player = __players[socket.id];
        var oldRoom = player.getRoom();
        var newRoom = new Room(roomName, socket.id);

        socket.leave(oldRoom, function() {
            __rooms[oldRoom].evictOccupants(player.getName());
            closeEmptyRm(oldRoom);
        });
        
        // Update player status.
        // Room creators are game master by default
        socket.join(roomName, function() {
            // Update player status
            player.setRoom(roomName);
            player.setRole('gm');

            // Update rooms list
            __rooms[roomName] = newRoom;

            // Update room guest list
            __rooms[roomName].addOccupant(player.getName());

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
        console.log('join-room event');
        var player = __players[socket.id];
        var oldRoom = player.getRoom();
        var newRoom = __rooms[roomName];

        socket.leave(oldRoom, function() {
            __rooms[oldRoom].evictOccupants(player.getName());
            closeEmptyRm(oldRoom);
        });
        
        // Update player status
        socket.join(roomName, function() {
            // Update player status
            player.setRoom(roomName);
            player.setRole('player');

            // Update room guest list
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
                    winnderID: socket.id,
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

// called when players leave room, namely disconnect and leave room
// deletes non lobby room if it is empty 
function closeEmptyRm(roomName) {
    if (roomName !== __lobbyName && __rooms[roomName].isEmpty()) {
        delete __rooms[roomName];
    }
}

var port = process.env.PORT || 3000;
http.listen(port, function() {
    console.log('listening on *:' + port);
});
