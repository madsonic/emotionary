// INITIALIZE SOCKET

var socket = io();

// BIND BROWSER EVENTS TO SOCKET EVENT EMITTERS
function afterReady() {
    // Loads registration modal on ready
    $('.modal-content').load('views/register.html', function() {
        // show modal and make it permanent until submitted
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

            // redfines options
            $modal.data('bs.modal').options.backdrop = "true";
            $modal.data('bs.modal').options.keyboard = "true";
        }
    }).on('shown.bs.modal', function() {
        // focus modal input
        $(this).find('input').focus();
    }).on('hidden.bs.modal', function() {
        // focus message input
        $('#message').focus();
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
        } else if (id === 'make-game') {
            console.log('making game');
            var valArr = $input.map(function() {
                return $(this).val();
            }).get();
            makeGame(valArr);
        }
    });

    // Validation visuals based on keystroke
    var waiting;
    $('.modal').on('keypress', 'form .has-feedback input', function(e) {
        var code = e.keyCode || e.which;
        console.log(code);
        
        if (code === 13) { // Enter key
            return;
        } else {
            var $form = $('.modal form');
            var $self = $(this);

            // Wait for user to 'finish' typing
            clearTimeout(waiting);
            waiting = setTimeout(function() {

                checkInput($form.attr('id'), $self.val());

            }, 250);
        }
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

////////////////////
//     Updates    //
////////////////////

socket.on('message', function(data) {
    console.log('receiving msg');
    receiveMsg(data);
});

socket.on('rm-update-success', function(data) {
    console.log('success');

    $('.modal').modal('hide');
    appendMsg(data.msg);
    $('#rm-name').text(data.room.name);    
});

socket.on('role-change', function(gameMasterID) {
    if (socket.id === gameMasterID) {
        console.log('role to gm');
        var markup = 
            "<ul class='sidebar-nav gm'>" +
                "<li>"  +
                    "<a href='views/make-game.html' data-toggle='modal' data-target='.modal'>Start Game</a>"+
                "</li>" +
                "<li>"  +
                    "<a href='#' data-toggle='modal' data-target='.modal'>Change game master</a>"+
                "</li>" +
            "</ul>";
        
        $('.sidebar-nav').after(markup);
    } else {
        console.log('role to player');
        $('.sidebar-nav.gm').remove();
    }
});

////////////////////
//   Form Stuff   //
////////////////////

socket.on('form-validate-result', function(result, msg) {
    var $form = $('.modal form');
    var $formGroup = $form.find('.form-group');
    var $icon = $form.find('.glyphicon.form-control-feedback');
    var $alert = $form.find('.alert');
    var $button = $form.find('button[type="submit"]');

    if (result) {
        console.log('form ok')

        // Input box visuals
        $formGroup
            .removeClass('has-error')
            .removeClass('has-success')
            .addClass('has-success');

        $icon
            .removeClass('glyphicon-remove')
            .removeClass('glyphicon-ok')
            .addClass('glyphicon-ok');

        // Remove any alert message
        $alert.remove();

        // Enable submit button
        $button.prop('disabled', false);
    } else {
        console.log('form not ok')

        // Input box visuals        
        $formGroup
            .removeClass('has-success')
            .removeClass('has-error')
            .addClass('has-error');

        $icon
            .removeClass('glyphicon-ok')
            .removeClass('glyphicon-remove')
            .addClass('glyphicon-remove');

        // Add/replace alert message
        var m = "<div class='alert alert-danger'>" + msg + "</div>";
        
        if ($alert.length === 0) { // New error
            $form.find('.form-group').after(m);
        } else { // Recurring error
            $alert.html(msg);
        }

        // Disable submit button
        $button.prop('disabled', true);
    }
});

////////////////////
//   Game Stuff   //
////////////////////

socket.on('start-game', function(data) {
    $('.modal').modal('hide');
    appendMsg('Game has started!');
    appendMsg(data.qns);
    appendMsg(data.cat);
});

socket.on('correct-ans', function(responder) {
    appendMsg(responder.name + " guessed the right answer!");
    appendMsg("The answer was: " + responder.msg);

    if (responder.id !== socket.id) {
        appendMsg("Awwww.....");
    }
});

socket.on('wrong-ans', function() {
    appendMsg("Wrong answer. Try again!");
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

function makeGame(valArr) {
    socket.emit('make-game', valArr);
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

function appendMsg(msg) {
    $('.message-history').append("<li class='announcement'>" + msg);
}

// Init 
$(document).ready(afterReady);
