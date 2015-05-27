// INITIALIZE SOCKET

var socket = io();

// BIND BROWSER EVENTS TO SOCKET EVENT EMITTERS
$(document).ready(function() { 
    $('.popup').popup({
        width: 500,
        heigth: 150,
        afterOpen: function() {
            $('#join-room').click(function() {
                var roomName = $('#roomName').val();
                joinRoom(roomName);
            });

            $('#create-room').click(function() {
                var roomName = $('#roomName').val();
                createRoom(roomName);
            });
        }

    });
});

// SOCKET EVENT LISTENERS

socket.on('echo', function(data) {
    console.log("echo message: " + data);
});

socket.on('room-error', function(errMsg) {
    // reveal alert message
    $('.alert-danger').append(errMsg);
    $('.alert-danger').show();
});

socket.on('success', function(succ) {
    $('.popup_close').click();
    console.log(succ);

});

// SOCKET EVENT EMITTERS

function createRoom(roomName) {
    socket.emit('create-room', roomName);
}

function joinRoom(roomName) {
    socket.emit('join-room', roomName);
}
