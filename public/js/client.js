// INITIALIZE SOCKET

var socket = io();

// BIND BROWSER EVENTS TO SOCKET EVENT EMITTERS
function afterReady() {
    // Loads registration modal on ready
    $('.modal-content').load('views/register.html', function() {
        $('.modal').modal({
            show: true,
            backdrop: 'static',
            keyboard: false,
        });
    });

    // Insert content dynamically so that a common modal can be used
    $('.modal').on('show.bs.modal', function(e) {
        var dir = $(e.relatedTarget).attr('href');

        // insert content for modals called via click
        if (dir !== undefined) {
            var $modal = $(this);
            var $content = $modal.find('.modal-content');

            // clears content
            $content.html('');

            // load new content
            $('.modal-content').load(dir);
        }
    });

    $('#send-message').click(function(e) {
        console.log("clicking send")
        e.preventDefault();
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

socket.on('room-error', function(errMsg) {
    // reveal alert message
    $('.alert-danger').append(errMsg);
    $('.alert-danger').show();
});

socket.on('success', function(msg, data) {
    // get the popup object
    if (msg !== undefined) {
        $('#messages').append('<li class="admin">' + msg);
    }
    if (data !== undefined) {
        $('.room p').text('Room name: ' + data.name);
    }
});

// SOCKET EVENT EMITTERS

function register(nickname) {
    socket.emit('register', nickname);
}

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
    console.log('from others')
    $('#messages').append("<li>" + sender + ": " + msg);
}

function receiveMsg(msg) {
    console.log('from yourself')
    $('#messages').append("<li>you: " + msg);    
}

// Init 
$(document).ready(afterReady);
