var ScreenFlash = function(color, duration) {
  this.color = color;
  this.remaining = duration;
  this.complete = false;
};

ScreenFlash.prototype.update = function(dt) {
  if (this.complete) {
    return;
  }

  this.remaining -= dt;
  if (this.remaining <= 0) {
    this.complete = true;
  }
}
