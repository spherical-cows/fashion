var Timer = function(duration) {
  this.duration = duration
  this.elapsed = 0;
};

Timer.prototype.update = function(dt) {
  this.elapsed += dt;
}

Timer.prototype.value = function() {
  return this.duration - this.elapsed;
}
