var Score = function() {
  this.maximum = 10;
  this.score = 0;
};

Score.prototype.yay = function() {
  this.score = Math.min(this.score + 1, this.maximum);
};

Score.prototype.boo = function() {
  this.score = Math.max(this.score - 1, 0);
};

Score.prototype.rank = function() {
  return this.score / this.maximum;
};
