// BIND BROWSER EVENTS TO SOCKET EVENT EMITTERS

$('#join-room').click(function() {
    var roomName = $('#roomName').val();
    joinRoom(roomName);
});

$('#crate-room').click(function() {
    var roomName = $('#roomName').val();
    createRoom(roomName);
}


// SOCKET EVENT LISTENERS



// SOCKET EVENT EMITTERS
function createRoom(roomName) {
    socket.emit('create-room', roomName);
}

function joinRoom(roomName) {
    socket.emit('join-room', roomName);
}
