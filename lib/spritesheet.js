// lifted from here: http://gamedevelopment.tutsplus.com/tutorials/an-introduction-to-spritesheet-animation--gamedev-13099
function SpriteSheet(path, frameWidth, frameHeight) {
  this.image = new Image();
  this.frameWidth = frameWidth;
  this.frameHeight = frameHeight;
 
  // calculate the number of frames in a row after the image loads
  var self = this;
  this.image.onload = function() {
    self.framesPerRow = Math.floor(self.image.width / self.frameWidth);
  };
 
  this.image.src = path;
}

function Animation(spritesheet, frameSpeed, startFrame, endFrame, reverseable, infinite) {
  var animationSequence = [];  // array holding the order of the animation
  var currentFrame = 0;        // the current frame to draw
  var counter = 0;             // keep track of frame rate
  var reverse = false;
  var elapsed = 0;
  var frameCount = endFrame - startFrame;
 
  // create the sequence of frame numbers for the animation
  for (var frameNumber = startFrame; frameNumber <= endFrame; frameNumber++) {
    animationSequence.push(frameNumber);
  }

  this.reset = function() {
    currentFrame = 0;
    counter = 0;
    elapsed = 0
    reverse = false
  }

  this.paused = false;
 
  // Update the animation
  this.update = function(dt, end) {
    if (this.paused) {
      return;
    }
    
    // update to the next frame if it is time
    if (counter == (frameSpeed - 1)) {
      currentFrame = (currentFrame + (reverse ? -1 : 1)) % animationSequence.length;
      elapsed += 1
    }
 
    // update the counter
    counter = (counter + 1) % frameSpeed;
    if (currentFrame === endFrame && reverseable) {
      reverse = !reverse
    }

    if (!infinite && (elapsed === frameCount * (reverseable ? 2 : 1))) end();
  };
 
  // draw the current frame
  this.draw = function(x, y, scale) {
    // get the row and col of the frame
    var row = Math.floor(animationSequence[currentFrame] / spritesheet.framesPerRow);
    var col = Math.floor(animationSequence[currentFrame] % spritesheet.framesPerRow);
 
    atom.context.drawImage(
      spritesheet.image,
      col * spritesheet.frameWidth, row * spritesheet.frameHeight,
      spritesheet.frameWidth, spritesheet.frameHeight,
      x, y,
      spritesheet.frameWidth * 5, spritesheet.frameHeight * 5);
  };
}
