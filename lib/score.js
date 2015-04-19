var Score = function() {
  this.maximum = 100000;
  this.score = 0;
	
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
  this.score = Math.min(this.score + points, this.maximum);
  console.log("SCORE: " + this.score);
};

Score.prototype.boo = function() {
  this.score = Math.max(this.score - 1, 0);
};

Score.prototype.rank = function() {
  return this.score / this.maximum;
};

Score.prototype.update = function(dt) {
  var max_radius = 100;
  var desired_radius = 10 + (max_radius * this.rank());
  var delta_radius = (this.current_radius - desired_radius) * dt;

  this.current_radius -= delta_radius;
}

Score.prototype.draw = function(ctx) {
  var text = "SCORE: " + this.score;
  var textDimensions = ctx.measureText(text);
  ctx.fillStyle = 'blue';
  ctx.fillText(text, (atom.width / 2) + 200, (atom.height / 2) - 250, 200);
  
  ctx.fillStyle = 'blue';
  ctx.beginPath();
  var x = 700, y = 35;
  ctx.arc(x, y, this.current_radius, 0, Math.PI * 2, false);
  ctx.fill();
}
