var Timer = function(duration) {
  this.duration = duration
  this.elapsed = 0;
  this.events = {}
  this.end = function() {};
  this.complete = false;
  this.paused = false;
};

Timer.prototype.add = function(sec) {
  this.elapsed -= sec;
  if (this.value() > this.duration) {
    this.elapsed = 0;
  }
}

Timer.prototype.subtract = function(sec) {
  this.elapsed += sec;
  if (this.value() <= 0) {
    this.elapsed = this.duration;
  }
}

Timer.prototype.addEvent = function(time, fn) {
  this.events[time] = fn;
}

Timer.prototype.update = function(dt) {
  if (this.complete || this.paused) {
    return;
  }

  this.elapsed += dt * 2;

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

Timer.prototype.onEnd = function(end) {
  this.end = end;
}

Timer.prototype.value = function() {
  return this.duration - this.elapsed;
}
