// INITIALIZE SOCKET

var socket = io();

// BIND BROWSER EVENTS TO SOCKET EVENT EMITTERS
function afterReady() {
    // register name on load
    var regPopup = new $.Popup({
        modal: true,
        closeContent: '',
        afterOpen: function() {
            // submit does not work for some reason
            $('form #register').click(function(e) {
                var name = $('#registration input#nickname').val();
                $alert = $('.alert-danger');
                console.log('name: '+name);

                // Do not accept empty nickname
                if (name.length === 0) {
                    console.log('empty nickname not allowed');
                    $('.err-msg').text('');
                    $('.err-msg').text("Nickname must be filled");

                    if ($alert.attr('hidden') === 'hidden') {
                        $alert.show();
                    }
                } else {
                    console.log("submitting name");
                    // to join a default room
                    register(name);

                    // Handle successful registration
                    socket.on('register-success', function(player) {
                        console.log('register success');
                        $alert.hide();
                        regPopup.close();

                        // Update info
                        $('.room #rm-name').text('Room name: ' + player.getRoom());
                        $('.room #nickname').text('Nickname: ' + player.name);
                    });

                    // Handle failed registration
                    // Gives new alert message
                    socket.on('register-fail', function() {
                        console.log('register fail');
                        $('.err-msg').text('');
                        $('.err-msg').text("Nickname is in use. Try another nickname");
                        if ($alert.attr('hidden') === 'hidden') {
                            $alert.show();
                        }
                    });                    
                }
            });
        },
    });
    regPopup.open('views/register.html');

    // page popup elements
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
    $('#messages').append("<li>" + sender + ": " + msg);
}

function receiveMsg(msg) {
    $('#messages').append("<li>you: " + msg);    
}

// Init 
$(document).ready(afterReady);
