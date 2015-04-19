var Score = function() {
  this.maximum = 1000000;
  this.score = 0;
  this.multiplier = 1
  this.current_radius = 100;
  this.words_completed = 0;
  this.errors = 0;
};

Score.prototype.yay = function(percentTimeRemaining, withoutErrors) {
   var points = 50;
   	if (percentTimeRemaining >= 60) {
   		points = 100;
    } else if (percentTimeRemaining >= 40) {
    	points = 80;
    }
  this.score += (points * this.multiplier);
  this.words_completed += 1;
  this.errors--;
};

Score.prototype.errored = function() {
  this.errors++;
};

Score.prototype.rank = function() {
  return this.errors / 10;
};

Score.prototype.lost = function() {
  return this.errors > 10;
};

Score.prototype.resetMultiplier = function () {
	this.multiplier = 1;
}

Score.prototype.incrementMultiplier = function () {
	this.multiplier +=1;
        this.errors--;
}

Score.prototype.multiplier = function () {
	return this.multiplier;
}

Score.prototype.words_completed = function () {
	return this.words_completed;
}

Score.prototype.value = function () {
	return this.score;
}

Score.prototype.draw = function(ctx) {
  var score = "SCORE: " + this.score;
  ctx.font = '30px "8bit"';
  var textDimensions = ctx.measureText(score);
  ctx.fillStyle = 'blue';
  ctx.fillText(score, (atom.width / 2) + 200, (atom.height / 2) - 250, 100);
  
  var multiplier = "MULTIPLIER: " + this.multiplier;
  var textDimensions = ctx.measureText(multiplier);
  ctx.fillStyle = 'blue';
  ctx.fillText(multiplier, (atom.width / 2) + 200, (atom.height / 2) - 200, 200);
}
