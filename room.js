function Room(name, gm, public, password) {
    this.name = name;
    this.public = public || true;
    this.password = password || null;
    this.chatHistory = [];
    this.game = null;
    this.gameStarted = false;
    this.gm = gm || null;
}

Room.prototype.getName = function() {
    return this.name;
};

Room.prototype.setName = function(name) {
    if (rooms.hasOwnProperty(name)) {
        console.log(name + " already exists");
        // reprompt user
    } else {
        this.name = name;
        // update global room list name
    }
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
}

Room.prototype.endGame = function() {
    this.gameStarted = false;
    this.game = null;
}

Room.prototype.isPlaying = function() {
    return this.gameStarted;
}

Room.prototype.getChatHistory = function() {
    return this.chatHistory;
};

Room.prototype.getGm = function() {
    return this.gm;
}

var exports = module.exports = Room;