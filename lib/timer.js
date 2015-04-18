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

  var second = Math.round(this.elapsed);
  var ev = this.events[second];
  if (ev) {
    ev();
    delete this.events[second];
  }
}

Timer.prototype.value = function() {
  return this.duration - this.elapsed;
}
