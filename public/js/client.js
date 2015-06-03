// INITIALIZE SOCKET

var socket = io();

// BIND BROWSER EVENTS TO SOCKET EVENT EMITTERS
function afterReady() {
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

    $('#send-message').click(function() {
        console.log("clicking send")
        var msg = $('#message').val();
        sendMsg(msg, socket.id);
        receiveMsg(msg);
        $('#message').val('');
    });

}

// SOCKET EVENT LISTENERS

socket.on('message', function(data) {
    receiveMsg(data.msg, data.id);
});

socket.on('echo', function(data) {
    console.log("echo message: " + data);
});

socket.on('room-error', function(errMsg) {
    // reveal alert message
    $('.alert-danger').append(errMsg);
    $('.alert-danger').show();
});

socket.on('success', function(msg, data) {
    $('.popup_close').click();
    $('#messages').append('<li class="admin">' + msg);
    $('.room p').text('Room name: ' + data);
});

// SOCKET EVENT EMITTERS

function createRoom(roomName) {
    socket.emit('create-room', roomName);
}

function joinRoom(roomName) {
    socket.emit('join-room', roomName);
}

function sendMsg(msg, id) {
    socket.emit('message', msg, id);
}

// HELPER
function receiveMsg(msg, sender) {
    $('#messages').append("<li>" + sender + ": " + msg);
}

function receiveMsg(msg) {
    $('#messages').append("<li>you: " + msg);    
}

// Init 
$(document).ready(afterReady);
