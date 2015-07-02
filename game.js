// Game object

function Game(qns, ans, category) {
    this.qns = qns;
    this.ans = ans.trim();
    this.category = category || '';
}

Game.prototype.checkAns = function(ans) {
    return this.ans === ans.trim();
};

var exports = module.exports = Game;