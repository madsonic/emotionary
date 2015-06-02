// INITIALIZE SOCKET

var socket = io();

// BIND BROWSER EVENTS TO SOCKET EVENT EMITTERS
$(document).ready(function() {
    $('#join-room').click(function() {
        var roomName = $('#roomName').val();
        joinRoom(roomName);
    });

    $('#create-room').click(function() {
        var roomName = $('#roomName').val();
        createRoom(roomName);
    });
});


// SOCKET EVENT LISTENERS

socket.on('echo', function(data) {
    console.log("echo message: " + data);
});

socket.on('error', function(err) {
    alert(err);
});

socket.on('success', function(succ) {
    alert(succ);
});

// SOCKET EVENT EMITTERS

function createRoom(roomName) {
    socket.emit('create-room', roomName);
}

function joinRoom(roomName) {
    socket.emit('join-room', roomName);
}