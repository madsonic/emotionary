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
            console.log('emit registration event');
            register(val);
        } else if (id === 'create-room') {
            console.log('emit create rm event');
            createRoom(val);
        } else if (id === 'join-room') {
            console.log('emit join room event');
            joinRoom(val);
        }
    });

    // Validation visuals based on keystroke
    var waiting;
    $('.modal').on('keyup', 'form input', function() {
        var $form = $('.modal form');
        var $self = $(this);

        // Wait for user to 'finish' typing
        clearTimeout(waiting);
        waiting = setTimeout(function() {

            checkInput($form.attr('id'), $self.val());

        }, 500);
    });

    // Send message event handler

    $('#send-message').click(function(e) {
        console.log("clicking send")
        e.preventDefault();

        var msg = $('#message').val().trim();

        if (msg !== '') {
            console.log(msg);
            sendMsg(msg);
            receiveMsg({msg: msg});
            $('#message').val('');
        }
    });
}

// SOCKET EVENT LISTENERS

socket.on('message', function(data) {
    console.log('receiving msg');
    receiveMsg(data);
});

socket.on('rm-update-success', function(data) {
    console.log('success');

    $('.modal').modal('hide');
    $('.message-history').append("<li class='announcement'>" + data.msg);
    $('#rm-name').text(data.room.name);    
});

socket.on('form-accept', function() {
    console.log('form ok')
    var $form = $('.modal form');

    // Input box visuals
    var $formGroup = $form.find('.form-group');
    var $icon = $form.find('.glyphicon');
    $formGroup
        .removeClass('has-error')
        .removeClass('has-success')
        .addClass('has-success');

    $icon
        .removeClass('glyphicon-remove')
        .removeClass('glyphicon-ok')
        .addClass('glyphicon-ok');

    // Remove any alert message
    $form.find('.alert').remove();

    // Enable submit button
    $form.find('button[type="submit"]').prop('disabled', false);
});

socket.on('form-reject', function(errMsg) {
    console.log('form not ok')
    var $form = $('.modal form');

    // Input box visuals
    var $formGroup = $form.find('.form-group');
    var $icon = $form.find('.glyphicon');
    
    $form.find('.form-group')
        .removeClass('has-success')
        .removeClass('has-error')
        .addClass('has-error');

    $form.find('.glyphicon')
        .removeClass('glyphicon-ok')
        .removeClass('glyphicon-remove')
        .addClass('glyphicon-remove');

    // Add/replace alert message
    var $alert = $form.find('.alert');
    var m = "<div class='alert alert-danger'>" + errMsg + "</div>";
    
    if ($alert.length === 0) { // New error
        $form.find('.form-group').after(m);
    } else { // Recurring error
        $alert.html(errMsg);
    }

    // Disable submit button
    $form.find('button[type="submit"]').prop('disabled', true);
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

function checkInput(formName, val) {
    socket.emit('validate', formName, val);
}

function sendMsg(msg) {
    socket.emit('message', msg);
}

// HELPER
function receiveMsg(data) {
    console.log('receive msg fn');
    if (data.id !== socket.id && data.id !== undefined) {
        console.log('from others')
        $('.message-history').append("<li>" + data.name + ": " + data.msg);
    } else {
        console.log('from yourself')
        $('.message-history').append("<li>you: " + data.msg);
    }
}

// Init 
$(document).ready(afterReady);
