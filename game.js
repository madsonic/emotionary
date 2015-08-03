// Game object

function Game(qns, ans, category) {
    this.qns = qns;
    this.ans = ans.trim();
    this.category = category || '';
}

Game.prototype.checkAns = function(ans) {
    return this.ans === ans.trim();
};

Game.prototype.timer = function(timeObj) {
    this.timer = timeObj;
};

Game.prototype.endTimer = function() {
    clearTimeout(this.timer);
    this.timer = null;
};

var exports = module.exports = Game;