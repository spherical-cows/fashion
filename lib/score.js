var Score = function() {
  this.maximum = 10;
  this.score = 0;

  this.current_radius = 100;
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

Score.prototype.update = function(dt) {
  var max_radius = 100;
  var desired_radius = 10 + (max_radius * this.rank());
  var delta_radius = (this.current_radius - desired_radius) * dt;

  this.current_radius -= delta_radius;
}

Score.prototype.draw = function(ctx) {
  ctx.fillStyle = 'blue';
  ctx.beginPath();
  var x = 700, y = 35;
  ctx.arc(x, y, this.current_radius, 0, Math.PI * 2, false);
  ctx.fill();
}
