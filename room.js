function Room(name, gmID, gm, public, password) {
    this.name = name;
    this.gmID = gmID || null;
    this.people = [gm] || [];
    this.public = public || true;
    this.password = password || null;
    
    this.chatHistory = [];
    this.game = null;
    this.gameStarted = false;
}

Room.prototype.getName = function() {
    return this.name;
};

Room.prototype.isOpen = function(pwd) {
    if (this.gameStarted) {
        return false;
    } else if (this.public) {
        return true;
    } else { // private game requires password
        return pwd === this.password;
    }
};

Room.prototype.startGame = function(game) {
    this.gameStarted = true;
    this.game = game;
};

Room.prototype.endGame = function() {
    this.gameStarted = false;
    this.game = null;
};

Room.prototype.isPlaying = function() {
    return this.gameStarted;
};

Room.prototype.getChatHistory = function() {
    return this.chatHistory;
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
            var j = this.people.indexOf(occupants[i]);
            this.people.splice(j, 1);            
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
}

var exports = module.exports = Room;