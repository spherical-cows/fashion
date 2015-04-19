var fontSize = 50;
var background = new Image();
background.src = 'assets/background.png'

var SplashScreen = function () {
	sound.title();
}

SplashScreen.prototype.update = function () {
	if (Object.keys(atom.input._pressed).length > 0) {
		sound.stop();
		var corpus = new Corpus();
		var word = corpus.suggest();
		var challenges = [];
		for (var x = 0; x < 10; x++) {
		  word = corpus.next(word);
		  challenges.push(new Challenge(word.split('')));
		}
		currentScreen = new GameplayScreen(challenges);
	}	
}

SplashScreen.prototype.draw = function () {
	atom.context.fillStyle = 'black';
	atom.context.fillRect(0, 0, atom.width, atom.height);
    var text = 'ANY KEY TO START';
    var textDimensions = atom.context.measureText(text);
    atom.context.fillStyle = 'red';
    atom.context.fillText(text, atom.width / 2 - textDimensions.width / 2, (atom.height / 2) + fontSize / 2);
}

function newAlbert(path, frameCount) {
  var albertSprites = new SpriteSheet(path, 64, 64);
  return new Animation(albertSprites, 5, 0, frameCount)
}

var alberts = [
  newAlbert('assets/player/arms-up-pose.png', 16),
  newAlbert('assets/player/kiss-pose.png', 8),
  newAlbert('assets/player/unbutton-pose.png', 12),
];

function randomAlbert() {
  var idx = Math.round(Math.random() * (alberts.length - 1));
  console.log(idx)
  return alberts[idx];
}

var GameplayScreen = function(challenges) {
  sound.gameplay();
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
	sound.stop();
    currentScreen = new LoseScreen();
  });

  this.albert = randomAlbert();
}

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
    this.timer.subtract(5);
  }

  if (this.currentChallenge.complete()) {
    this.timer.paused = true;
    this.albert.update(dt, function() {
      this.currentChallenge = this.challenges.shift()
      this.albert.reset();
      this.albert = randomAlbert();
      this.timer.paused = false;
      this.timer.add(5);
    }.bind(this));
  }

  if (!this.currentChallenge) {
	sound.stop();
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

  if (!this.currentChallenge.complete()) {
    var text = this.currentChallenge.chars.join('');
    var textDimensions = atom.context.measureText(text);
    atom.context.fillStyle = 'yellow';
    atom.context.fillText(text, atom.width / 2 - textDimensions.width / 2, 150);
    atom.context.fillStyle = 'black';
    atom.context.fillText(this.currentChallenge.enteredChars.join(''), atom.width / 2 - textDimensions.width / 2, 150);
  }

  this.drawTimer();

  if (this.flash && !this.flash.complete) {
    atom.context.fillStyle = this.flash.color;
    atom.context.fillRect(0, 0, atom.width, atom.height);
  }
}

GameplayScreen.prototype.drawTimer = function() {
  var text = Math.round(this.timer.value()).toString();
  if (this.timer.paused) {
    text = '--';
  }

  atom.context.fillStyle = 'white';
  atom.context.fillRect(atom.width / 2 - 60, 0, 120, 70)
  
  atom.context.fillStyle = 'black';
  atom.context.font = '13px Monaco';
  var textDimensions = atom.context.measureText('catwalk time');
  atom.context.fillText('Catwalk Time', atom.width / 2 - textDimensions.width / 2, 20);
  atom.context.font = '30px Monaco';
  textDimensions = atom.context.measureText(text);
  atom.context.fillText(text, atom.width / 2 - textDimensions.width / 2, 60);
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
  this.albert = newAlbert('assets/player/weeping-pose.png', 20);
}

LoseScreen.prototype.update = function(dt) {
  this.albert.update(dt, function() {
    this.albert.paused = true;
  }.bind(this));
}

LoseScreen.prototype.draw = function() {
  atom.context.drawImage(background, 0, 0, atom.width, atom.height);
  atom.context.fillStyle = 'rgba(0,0,0,.5)';
  atom.context.fillRect(0, 0, atom.width, atom.height);

  var text = 'Centrelink chic is so last season';
  var textDimensions = atom.context.measureText(text);
  atom.context.font = '30px Monaco';
  atom.context.fillStyle = 'red';
  atom.context.fillText(text, atom.width / 2 - textDimensions.width / 2, 200);

  this.albert.draw(atom.width / 2 - 32 * 4, atom.height - 350, 5);
}

var color_rank = function(rank) {
  var c = Math.floor(255 * rank);
  return 'rgba(' + [c, c, c].join(', ') + ', .5)';
};
