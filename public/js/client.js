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

    // User registration handler
    $('.modal').on('submit', 'form', function(e) {
        e.preventDefault();
        console.log(e);

        // Send data
        var $input = $(this).find('input');
        var val = $input.val();
        var id = $(this).attr('id');

        if (id === 'registration') {
            register(val);
        } else if (id === 'create-room') {
            console.log('emit create rm event');
            createRoom(val);
        } else if (id === 'join-room') {
            console.log('emit join room event');
            joinRoom(val);
        }

        // Close modal when successful
        $('.modal').modal('hide');
    });

    // Send message event handler
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

// socket.on('registration-success', function(data) {
//     console.log("registration success");
//     $('.modal').modal('hide');

//     // Append welcome message
//     $('.message-history').append("<li class='announcement'>" + data.msg);
//     $('#rm-name').text(data.room.name);
// });

<<<<<<< HEAD
socket.on('register-fail', function() {
    console.log('registration fail')
});
=======
// socket.on('registration-fail', function() {
//     console.log('registration fail')
// });

// socket.on('create-rm-success', function(data) {
//     console.log('create rm success');
//     $('.modal').modal('hide');
//     $('.message-history').append("<li class='announcement'>" + data.msg);
//     $('#rm-name').text(data.room.name);
// })
>>>>>>> Refactor success events

socket.on('rm-update-success', function(data) {
    console.log('success');
    $('.modal').modal('hide');
    $('.message-history').append("<li class='announcement'>" + data.msg);
    $('#rm-name').text(data.room.name);    
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
