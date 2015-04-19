var Timer = function(duration, onEndFn) {
  this.duration = duration
  this.elapsed = 0;
  this.events = {}
  this.end = onEndFn;
  this.complete = false;
  this.paused = false;
};

Timer.prototype.addEvent = function(time, fn) {
  this.events[time] = fn;
}

Timer.prototype.update = function(dt) {
  if (this.complete || this.paused) {
    return;
  }

  this.elapsed += dt * 1000;

  var second = Math.round(this.elapsed);
  var ev = this.events[second];
  if (ev) {
    ev();
    delete this.events[second];
  }

  if (this.value() <= 0) {
    this.end();
    this.complete = true;
  }
}

Timer.prototype.value = function() {
  return this.duration - this.elapsed;
}

Timer.prototype.percentRemaining = function() {
  return Math.floor((this.elapsed / this.duration) * 100);
}
