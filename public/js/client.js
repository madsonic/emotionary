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
        var modalWidth = $(this).find('.modal-content').width();
        var keyboardWidth = String(0.8 * modalWidth);

        // emoji keyboard
        $('#qns').emojiPicker({
            width: keyboardWidth,
            iconBackgroundColor: "#fff"
        });

        // focus modal input
        $(this).find('input').first().focus();

    }).on('hidden.bs.modal', function() {
        // focus message input
        $('#message').focus();
    });

    // User registration handler
    $('.modal').on('submit', 'form', function(e) {
        e.preventDefault();
        // console.log(e);

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
        } else if (id === 'end-game') {
            endGame();
        }
    });

    // Validation visuals based on keystroke
    var waiting;
    $('.modal').on('keypress', 'form .has-feedback input', function(e) {
        var code = e.keyCode || e.which;
        
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

    // Responsive sidebar btn 
    $('a[href="#sidebar-link"]').click(function(e) {
        e.preventDefault();
        $('#wrapper').toggleClass('sidebar-active');
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

socket.on('room-update', function(data) {
    $('.modal').modal('hide');
    clearScreen(data.id);

    appendMsg(data.greeting, 'announcement');
    $('#rm-name').text(data.room);

    // clone and add back for animation restart
    restartAnimation($('#rm-name'), 'blink', data.id);
});
 
socket.on('role-change', function(gameMasterID) {
    updateGmCtrl(gameMasterID, 'end');
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

    // Add gm controls for gm browser
    updateGmCtrl(data.gm, 'start');

    // Announce start of game
    appendMsg(data.name + ' has started a new game', 'announcement');
    appendMsg('Question: ' + data.qns + '?', 'announcement');
    appendMsg(data.cat);

});

socket.on('end-game', function(data) {
    if (data.type === 'proper') {

        // ended game via guessing
        appendMsg(data.name + ' guessed the right answer!', 'announcement');
        appendMsg('The answer was: ' + data.msg, 'announcement');

        if (data.id !== socket.id && data.gm !== socket.id) { 
            // neither gm nor winner
            appendMsg("Awwww..... Try harder next round"); 
        }

    } else if (data.type === 'improper') {

        // forced end
        $('.modal').modal('hide');
        appendMsg(data.name + ' ended the game', 'announcement');

    }
    updateGmCtrl(data.id, 'end');
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

function endGame() {
    console.log('end game');
    socket.emit('end-game');
}

// HELPER
function receiveMsg(data) {
    console.log('receive msg fn');

    if (data.id !== socket.id && data.id !== undefined) {
        console.log('from others')
        $('.message-history').append("<li>" + data.name + ": " + data.msg);
    } else {
        console.log('from yourself')
        // $('.message-history').append("<li>you: " + data.msg);
        appendMsg('you: ' + data.msg);
    }
}
/*
    Appends msg to message history. Type will become class attribute
    Types in use (if not specified, it will be a normal message)
    announcement - centers text
 */
function appendMsg(msg, type) {
    if (msg !== '' && msg !== undefined && msg !== null) {
        if (type === undefined) {
            $('.message-history').append('<li>' + msg);
        } else {
            $('.message-history').append('<li class='+ ' \" ' + type+ ' \"> ' + msg);
        }
    }
}

// Adds a alert msg in bootstrap form. Replaces the message if it exists
function alertMsg(msg, context) {
    console.log('alert msg');
    var $context = $(context);
    var $alert = $context.find('.alert');
    var $form = $context.find('form');
    var m = '<div class="alert alert-danger">' + msg + '</div>';
    
    if ($alert.length === 0) { // New error
        $form.find('.form-group').after(m);
    } else { // Recurring error
        $alert.html(msg);
    }
}

function updateGmCtrl(gmID, nextState) {
    var $sidebar = $('#sidebar-wrapper');

    // markups for different state
    var state = {
        inGame: 
            '<li>'  +
                '<a href="views/make-game.html" data-toggle="modal" data-target=".modal">Restart Game</a>'+
            '</li>' +
            '<li>'  +
                '<a href="views/end-game.html" data-toggle="modal" data-target=".modal">End Game</a>'+
            '</li>',
        newGame: 
            '<li>' +
                '<a href="views/make-game.html" data-toggle="modal" data-target=".modal">Start Game</a>'+
            '</li>',
        newGm:
            '<ul class="sidebar-nav gm">' +
                '<li>'  +
                    '<a href="views/make-game.html" data-toggle="modal" data-target=".modal">Start Game</a>'+
                '</li>' +
            '</ul>',
    };

    if (socket.id === gmID) {
        // GM browser
        if ($sidebar.has('.gm').length > 0) {
            // existing GM
            var $gmNav = $sidebar.find('.gm');

            if (nextState === 'start') {
                // change nav to in-game state
                $gmNav.html(state.inGame);
                $gmNav.data('playing', true);
                restartAnimation($gmNav, 'blink');
            } else if (nextState === 'end') {
                // change to end-game state
                $gmNav.html(state.newGame);
                $gmNav.data('playing', false);
                restartAnimation($gmNav, 'blink');
            }
        } else {
            // New GM

            // new gm no gm nav yet
            $sidebar.find('.sidebar-nav').after(state.newGm);
            $sidebar.find('.gm').data('playing', false);
            restartAnimation($('.sidebar-wrapper .gm'), 'blink');
        }
    } else { 

        // removes ctrl
        $('.sidebar-nav.gm').remove();
    }
}

// Clears all message on caller's screen
function clearScreen(id) {
    if (socket.id === id) {
        $('.message-history').html('');
    }
}

// Hack to restart CSS3 animation
function restartAnimation($target, animation, id) {
    if (socket.id === id) {
        var $copy = $target.addClass(animation).clone(true);
        $target.replaceWith($copy);
    }
}

// Init 
$(document).ready(afterReady);
