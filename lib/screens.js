var fontSize = 30;
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
      new Howl({ 
        urls: ['assets/sound/fx/crowd.mp3'],
        buffer: true,
      }).play();
    }
  }.bind(this));
  this.timer.onEnd(this.lose);
}

GameplayScreen.prototype.win = function() {
  sound.cheer();
  atom.context.fillStyle = 'rgba(0,255,0,.75)';
};

GameplayScreen.prototype.lose = function() {
  this.flash = new ScreenFlash('rgba(255,0,0,.5)', 0.1);
};

GameplayScreen.prototype.update = function(dt) {
  this.timer.update(dt);
  this.score.update(dt);
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
    this.win()
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

  this.score.draw(atom.context);

  var text = this.currentChallenge.chars.join('');
  var textDimensions = atom.context.measureText(text);
  atom.context.fillText(text, atom.width / 2 - textDimensions.width / 2, (atom.height / 2) + fontSize / 2);
  atom.context.fillStyle = 'blue';
  atom.context.fillText(this.currentChallenge.enteredChars.join(''), atom.width / 2 - textDimensions.width / 2, (atom.height / 2) + fontSize / 2);

  text = Math.round(this.timer.value()).toString()
  textDimensions = atom.context.measureText(text);
  atom.context.fillStyle = 'white';
  atom.context.fillText(text, atom.width / 2 - textDimensions.width / 2, 50);

  if (this.flash && !this.flash.complete) {
    atom.context.fillStyle = this.flash.color;
    atom.context.fillRect(0, 0, atom.width, atom.height);
  }
}

var color_rank = function(rank) {
  var c = Math.floor(255 * rank);
  return 'rgba(' + [c, c, c].join(', ') + ', .5)';
};
