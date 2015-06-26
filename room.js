/*
room - object with
-name
-access
-password
-people
-chatHistory
*/

function Room(name, access, password) {
    this.name = name;
    this.access = access === undefined ? true : acesss;
    this.password = password === undefined ? '' : password;
    this.people = [];
    this.chatHistory = [];
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

Room.prototype.isOpen = function() {
    return this.access;
};

Room.prototype.getChatHistory = function() {
    return this.chatHistory;
};

var exports = module.exports = Room;