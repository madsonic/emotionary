var players = require('./app.js')

function Player(name, id) {
    this.setName(name);
    this.role = 'player';
    this.room = id;
}

Player.prototype.getName = function() {
    return this.name;
};

Player.prototype.setName = function(name) {
    if (players.hasOwnProperty(name)) {
        console.log(name + " already exists");
        // reprompt user
    } else {
        this.name = name;
        // update global room list name
    }
};

Player.prototype.getRole = function() {
    return this.role;
};

Player.prototype.setRole = function(role) {
    this.role = role;
};

Player.prototype.getRoom = function() {
    return this.room;
};

Player.prototype.setRoom = function(room) {
    this.room = room;
};

var exports = module.exports = Player;