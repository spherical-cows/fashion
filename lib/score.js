var Score = function() {
  this.score = 0;
  this.multiplier = 1
  this.current_radius = 100;
  this.words_completed = 0;
  this.max_errors = 5;
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
};

Score.prototype.errored = function() {
  this.errors++;
};

Score.prototype.rank = function() {
  return this.errors / this.max_errors;
};

Score.prototype.lost = function() {
  return this.errors > this.max_errors;
};

Score.prototype.resetMultiplier = function () {
	this.multiplier = 1;
}

Score.prototype.incrementMultiplier = function () {
	this.multiplier +=1;
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

Score.prototype.scoreboard = function () {
  var scores = [
    { score: 18188, player: "HOF", default: true},
    { score: 13658, player: "CMA", default: true},
    { score: 11398, player: "RBO", default: true},
    { score: 8168, player: "SSR", default: true},
    { score: 6878, player: "SAM", default: true},
    { score: this.score, player: "ALB", default: false}
  ];

  return scores.sort(function (a, b) {
    return b.score - a.score;
  }).map(function (score, index) {
    score.rank = index + 1;
    return score;
  });
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
