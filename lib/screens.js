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

function newAlbert(path, frameCount, speed) {
  var albertSprites = new SpriteSheet(path, 64, 64);
  return new Animation(albertSprites, speed || 5, 0, frameCount)
}

var alberts = [
  newAlbert('assets/player/arms-up-pose.png', 16),
  newAlbert('assets/player/kiss-pose.png', 8),
  newAlbert('assets/player/unbutton-pose.png', 12),
];

function randomAlbert() {
  var idx = Math.round(Math.random() * (alberts.length - 1));
  return alberts[idx];
}

var GameplayScreen = function(challenges) {
  sound.gameplay();
  this.challenges = challenges;
  this.currentChallenge = challenges.shift();
  this.score = new Score();
  this.flash = null;
  this.timer = new Timer(30);

  this.cameraFlashes = [];

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

var flashPositions = [
  [10, 150],
  [20, 150],
  [40, 150],
  [50, 150],
  [70, 150],
  [90, 150],
  [100, 150],
  [120, 150],

  [10, 160],
  [20, 160],
  [40, 160],
  [50, 160],
  [70, 160],
  [90, 160],
  [100, 160],

  [10, 180],
  [20, 180],
  [40, 180],
  [50, 180],
  [70, 180],
  [90, 180],

  [10, 200],
  [20, 200],
  [40, 200],
  [50, 200],

  [10, 220],
  [20, 220],
  [40, 220],
  [50, 220],
];

GameplayScreen.prototype.theCrowdTakesMorePhotos = function() {
  var point = flashPositions[Math.round(Math.random() * flashPositions.length)],
    flash = {
      duration: 1.0 + Math.random(),
      age: 0,
      scale: 1.0 + (Math.random() * 7),
      x: (atom.width / 384) * point[0],
      y: (atom.height / 256) * point[1]
    };

  if (Math.random() > 0.5) {
    flash.x = atom.width - flash.x;
  }

  this.cameraFlashes.push(flash);
}

GameplayScreen.prototype.updateCameraFlashes = function(dt) {
  this.cameraFlashes.forEach(function(flash) {
    flash.age += dt;
  });

  var newFlashes = [];
  this.cameraFlashes.forEach(function(flash) {
    if (flash.age <= flash.duration) {
      newFlashes.push(flash);
    }
  });

  this.cameraFlashes = newFlashes;
}

GameplayScreen.prototype.update = function(dt) {
  this.timer.update(dt);
  this.score.update(dt);
  this.updateCameraFlashes(dt);

  atom.context.fillStyle = color_rank(this.score.rank());

  if (atom.input.pressed(this.currentChallenge.next())) {
    this.currentChallenge.advance();
    this.score.yay();

    if (this.currentChallenge.complete()) {
      this.theCrowdTakesMorePhotos();
    }
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

GameplayScreen.prototype.drawCameraFlashes = function() {
  var img = new Image();
  img.src = 'assets/camera-flash.png';

  this.cameraFlashes.forEach(function(flash) {
    var opacity = flash.duration - flash.age;
    atom.context.globalAlpha = opacity;
    atom.context.drawImage(img, flash.x, flash.y, 16 * flash.scale, 16 * flash.scale);
    atom.context.globalAlpha = 1;
  });
}

GameplayScreen.prototype.draw = function() {
  atom.context.drawImage(background, 0, 0, atom.width, atom.height);
  atom.context.fillRect(0, 0, atom.width, atom.height);
  atom.context.fillStyle = 'red';
  atom.context.font = fontSize+'px Monaco';

  this.drawCameraFlashes();

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
  this.albert = newAlbert('assets/player/weeping-pose.png', 20, 4);
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
