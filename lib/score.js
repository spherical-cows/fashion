var Score = function() {
  this.maximum = 1000000;
  this.score = 0;
  this.multiplier = 1
  this.current_radius = 100;
  this.score_buckets = { 
	  0: 50, 
	  20: 80, 
	  40: 100 
  };
};

Score.prototype.yay = function(percentTimeRemaining, withoutErrors) {
   var points = 50;
   	if (percentTimeRemaining >= 60) {
   		points = 100;
    } else if (percentTimeRemaining >= 40) {
    	points = 80;
    }
  this.score += (points * this.multiplier);
};

Score.prototype.boo = function() {
  this.score = Math.max(this.score - 1, 0);
};

Score.prototype.rank = function() {
  return this.score / this.maximum;
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

Score.prototype.value = function () {
	return this.score;
}

Score.prototype.update = function(dt) {
  var max_radius = 100;
  var desired_radius = 10 + (max_radius * this.rank());
  var delta_radius = (this.current_radius - desired_radius) * dt;

  this.current_radius -= delta_radius;
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
  
  ctx.fillStyle = 'blue';
  ctx.beginPath();
  var x = 700, y = 35;
  ctx.arc(x, y, this.current_radius, 0, Math.PI * 2, false);
  ctx.fill();
}
