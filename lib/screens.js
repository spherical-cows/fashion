var fontSize = 50;
var background = new Image();
background.src = 'assets/background.png'

var GameplayScreen = function(challenges) {
  this.challenges = challenges;
  this.currentChallenge = challenges.shift();
  this.score = new Score();
  this.flash = null;
  this.timer = new Timer(30);
  this.timer.addEvent(10, function() {
    if (this.score.score > 5) {
      sound.cheer();
    }
  }.bind(this));
  this.timer.onEnd(function() {
    currentScreen = new LoseScreen();
  });

  var albertSprites = new SpriteSheet('assets/player/unbutton-pose.png', 64, 64);
  this.albert = new Animation(albertSprites, 10, 0, 12)
}

GameplayScreen.prototype.update = function(dt) {
  this.timer.update(dt);
  this.score.update(dt);
  this.albert.update(dt);
  atom.context.fillStyle = color_rank(this.score.rank());

  if (atom.input.pressed(this.currentChallenge.next())) {
    this.currentChallenge.advance();
    this.score.yay();
  } else if (Object.keys(atom.input._pressed).length) {
    atom.context.fillStyle = 'rgba(255,0,0,.5)';
    this.score.boo();
  }

  if (this.currentChallenge.complete()) {
    this.currentChallenge = this.challenges.shift()
  }

  if (!this.currentChallenge) {
    currentScreen = new WinScreen(this.score.value);
  }

  if (this.flash) {
    this.flash.update(dt);
  }
}

GameplayScreen.prototype.draw = function() {
  atom.context.drawImage(background, 0, 0, atom.width, atom.height);
  atom.context.fillRect(0, 0, atom.width, atom.height);
  atom.context.fillStyle = 'red';
  atom.context.font = fontSize+'px Monaco';

  this.albert.draw(atom.width / 2 - 32 * 4, atom.height - 350, 5);
  this.score.draw(atom.context);

  var text = this.currentChallenge.chars.join('');
  var textDimensions = atom.context.measureText(text);
  atom.context.fillStyle = 'yellow';
  atom.context.fillText(text, atom.width / 2 - textDimensions.width / 2, 150);
  atom.context.fillStyle = 'black';
  atom.context.fillText(this.currentChallenge.enteredChars.join(''), atom.width / 2 - textDimensions.width / 2, 150);

  text = Math.round(this.timer.value()).toString()
  textDimensions = atom.context.measureText(text);
  atom.context.fillStyle = 'white';
  atom.context.fillText(text, atom.width / 2 - textDimensions.width / 2, 50);

  if (this.flash && !this.flash.complete) {
    atom.context.fillStyle = this.flash.color;
    atom.context.fillRect(0, 0, atom.width, atom.height);
  }
}

var WinScreen = function(score) {
  this.score = score;
  this.first = true;
}

WinScreen.prototype.update = function(dt) {
  if (this.first) {
    sound.cheer();
    this.first = false;
  }
}

WinScreen.prototype.draw = function() {
  atom.context.fillStyle = 'lime';
  atom.context.fillRect(0, 0, atom.width, atom.height);

  var text = 'You Win Fashion Jesus';
  var textDimensions = atom.context.measureText(text);
  atom.context.fillStyle = 'blue';
  atom.context.fillText(text, atom.width / 2 - textDimensions.width / 2, (atom.height / 2) + fontSize / 2);
}

var LoseScreen = function(score) {
  this.score = score;
  this.first = true;
}

LoseScreen.prototype.update = function(dt) {
  if (this.first) {
    // sound.cheer();
    this.first = false;
  }
}

LoseScreen.prototype.draw = function() {
  atom.context.fillStyle = 'red';
  atom.context.fillRect(0, 0, atom.width, atom.height);

  var text = 'Centrelink chic is so last season';
  var textDimensions = atom.context.measureText(text);
  atom.context.fillStyle = 'white';
  atom.context.fillText(text, atom.width / 2 - textDimensions.width / 2, (atom.height / 2) + fontSize / 2);
}

var color_rank = function(rank) {
  var c = Math.floor(255 * rank);
  return 'rgba(' + [c, c, c].join(', ') + ', .5)';
};
