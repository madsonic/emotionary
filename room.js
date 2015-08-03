function Room(name, gmID) {
    this.name = name;
    this.gmID = gmID || null;
    this.people = [];
    
    this.game = null;
    this.gameStarted = false;
}

Room.prototype.getName = function() {
    return this.name;
};

Room.prototype.startGame = function(game, timerObj) {
    this.gameStarted = true;
    this.game = game;
    this.game.timer(timerObj);
};

Room.prototype.endGame = function() {
    this.gameStarted = false;
    this.game.endTimer();
    this.game = null;
};

Room.prototype.isPlaying = function() {
    return this.gameStarted;
};

Room.prototype.getGmID = function() {
    return this.gmID;
};

Room.prototype.getOccupants = function() {
    return this.people;
};

Room.prototype.addOccupant = function(occupant) {
    this.people.push(occupant);
};

Room.prototype.evictOccupants = function(occupants) {
    if (occupants === undefined || occupants.length === 0) {
        this.people = [];
    } else {
        if (typeof occupants === 'string') {
            var i = this.people.indexOf(occupants);
            this.people.splice(i, 1);
        } else if (occupants.isArray()) {
            for (var i = 0; i < occupants.length; ++i) {
                var j = this.people.indexOf(occupants[i]);
                this.people.splice(j, 1);
            }
        }
    }
};

Room.prototype.isEmpty = function() {
    return this.people.length === 0;
};

var exports = module.exports = Room;