var Timer = function(duration) {
  this.duration = duration
  this.elapsed = 0;
  this.events = {}
};

Timer.prototype.addEvent = function(time, fn) {
  this.events[time] = fn;
}

Timer.prototype.update = function(dt) {
  this.elapsed += dt;

  var ev = this.events[Math.round(this.elapsed)];
  if (ev) {
    ev();
  }
}

Timer.prototype.value = function() {
  return this.duration - this.elapsed;
}
