function Player(name) {
    this.name = name;
    this.role = 'player';
    this.room = 'lobby';
}

Player.prototype.getName = function() {
    return this.name;
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