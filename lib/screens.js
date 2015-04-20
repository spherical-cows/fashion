var fontSize = 50;
var background = new Image();
background.src = 'assets/background.png'
var stars = new Image();
stars.src = 'assets/stars.png'
var cow = new Image();
cow.src = 'assets/spherical-cow.png';

var PresentedBy = function () {
    this.duration = 5;
    this.rotation = 0;
    this.age = 0;
}

PresentedBy.prototype.update = function (dt) {
  this.rotation += 90* dt * Math.PI/180

  this.age += dt;
  if (this.age > this.duration) {
    currentScreen = new SplashScreen();
  }
}

PresentedBy.prototype.draw = function () {
  atom.context.fillRect(0, 0, atom.width, atom.height);
  var star_offset = (this.age * 200) % atom.width
  atom.context.drawImage(stars, -atom.width + star_offset, 0, atom.width, atom.height);
  atom.context.drawImage(stars, star_offset, 0, atom.width, atom.height);

  var drawRedCentredText = function (text, height) {
    var textDimensions = atom.context.measureText(text);
    atom.context.fillStyle = 'red';
    atom.context.fillText(text, atom.width / 2 - textDimensions.width / 2, height);
  }

  atom.context.font = '50px "8bit"';
  drawRedCentredText('Spherical Cows', 260);
  drawRedCentredText('Presents', 330);

  atom.context.save();
  // atom.context.rotate(45 * Math.PI/180);
  var originX = atom.width / 2 - 16 * 10,
    originY = atom.height / 2;

  atom.context.translate(originX, originY); 
  atom.context.translate(16 * 20 / 2, 16 * 20 / 2); 
  atom.context.rotate(this.rotation);
  atom.context.drawImage(cow, -120, -120, 16 * 15, 16 * 15);
  atom.context.restore();
}

var SplashScreen = function () {
	sound.title();
}

SplashScreen.prototype.update = function () {
	if (Object.keys(atom.input._pressed).length > 0) {
		sound.stop();
		currentScreen = new GameplayScreen();
	}	
}

SplashScreen.prototype.draw = function () {
    atom.context.font = '30px "8bit"';
	atom.context.fillStyle = 'black';
	atom.context.fillRect(0, 0, atom.width, atom.height);
	var drawRedCentredText = function (text, height) {
	    var textDimensions = atom.context.measureText(text);
	    atom.context.fillStyle = 'red';
	    atom.context.fillText(text, atom.width / 2 - textDimensions.width / 2, height);
	}

	drawRedCentredText('FIGHT ALBERTS CRUSHING SELF DOUBT', 260);
	drawRedCentredText('TYPE WHAT HE IS THINKING', 330);
    drawRedCentredText('ANY LETTER TO START', 400);
}

function newAlbert(path, frameCount, opts) {
  var albertSprites = new SpriteSheet(path, 64, 64);
  return new Animation(albertSprites, opts.speed || 5, opts.startFrame || 0, frameCount, opts.reversible || false, opts.infinite || false)
}

var alberts = [
  newAlbert('assets/player/arms-up-pose.png', 15, { reversible: true } ),
  newAlbert('assets/player/kiss-pose.png', 7, { reversible: true }),
  newAlbert('assets/player/unbutton-pose.png', 12, { reversible: true }),
];

function randomAlbert() {
  var idx = Math.round(Math.random() * (alberts.length - 1));
  return alberts[idx];
}

var GameplayScreen = function() {
  var self = this;
  sound.gameplay();
  this.corpus = new Corpus();
  this.currentChallenge = this.corpus.challenge();
  this.score = new Score();
  this.flash = null;
  this.cameraFlashes = [];
  this.gameOver = function() {
	sound.stop();
    currentScreen = new LoseScreen(self.score);
  };
  this.startTimer = function () {
	  var scaled_reduction = 0;
	  for (var i = 0; i != this.score.words_completed; i++) {
		  scaled_reduction += i * 3;
	  }
	  var duration = this.currentChallenge.length() * (500 - scaled_reduction);
	  this.timer = new Timer(duration, this.gameOver);
  }
  this.startTimer();
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
  for (var i=0; i < (this.score.multiplier -1) + (this.score.multiplier -1) * Math.round(Math.random() * 3); i++) {
    setTimeout(function() {
      var point = flashPositions[Math.round(Math.random() * (flashPositions.length - 1))],
        flash = {
          duration: 1.0 + Math.random(),
          age: 0,
          scale: 1.0 + (Math.random() * 10),
          x: (atom.width / 384) * point[0],
          y: (atom.height / 256) * point[1]
        };

      if (Math.random() > 0.5) {
        flash.x = atom.width - flash.x;
      }

      sound.cameras();
      this.cameraFlashes.push(flash);
    }.bind(this), Math.random() * 1000);
  }
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
  this.updateCameraFlashes(dt);

  atom.context.fillStyle = color_rank(this.score.rank());

  if (atom.input.pressed(this.currentChallenge.next())) {
    this.currentChallenge.advance();
	if (this.currentChallenge.complete() && !this.currentChallenge.errored) {
		this.score.incrementMultiplier();
		this.theCrowdTakesMorePhotos();
	}
  } else if (Object.keys(atom.input._pressed).length) {
	this.score.resetMultiplier();
    atom.context.fillStyle = 'rgba(255,0,0,.5)';
    this.currentChallenge.errored = true;
    this.score.errored();
	sound.error();
  }

  if (this.currentChallenge.complete()) {
    this.timer.paused = true;
    this.albert.update(dt, function() {
	  this.score.yay(this.timer.percentRemaining());
      this.currentChallenge = this.corpus.challenge()
      this.albert.reset();
      this.albert = randomAlbert();

      if (this.currentChallenge) {
        this.startTimer();
      }
    }.bind(this));
  }

  if (this.score.lost()) {
    this.gameOver();
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
  atom.context.font = fontSize+'px "8bit"';

  this.drawCameraFlashes();

  this.albert.draw(atom.width / 2 - 32 * 4, atom.height - 350, 5);
  this.score.draw(atom.context);

  if (this.currentChallenge) {
    this.currentChallenge.draw(atom.width / 2 - 32 * 4, atom.height - 350);
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

  atom.context.font = '13px "8bit"';

  var textDimensions = atom.context.measureText('catwalk time');

  var padding = 20;

  atom.context.fillStyle = 'white';
  atom.context.fillRect(
    (atom.width / 2) - (textDimensions.width / 2) - padding,
    0,
    textDimensions.width + padding * 2,
    13 + padding + 30
  );

  atom.context.fillStyle = 'black';
  atom.context.fillText('Catwalk Time', atom.width / 2 - textDimensions.width / 2, 20);
  atom.context.font = '30px "8bit"';
  textDimensions = atom.context.measureText(text);
  atom.context.fillText(text, atom.width / 2 - textDimensions.width / 2, 60);
}

var LoseScreen = function(score) {
  this.score = score;
  this.scoreboard = score.scoreboard();
  this.first = true;
  this.albert = newAlbert('assets/player/weeping-pose.png', 20, { speed: 4 });
}

LoseScreen.prototype.update = function(dt) {
  this.albert.update(dt, function() {
    this.albert = newAlbert('assets/player/weeping-pose.png', 20, { startFrame: 15, speed: 8, reversible: true, infinite: true });
  }.bind(this));

  if (atom.input.pressed('R')) {
      sound.stop();
      currentScreen = new GameplayScreen();
  }
}

LoseScreen.prototype.draw = function() {
  atom.context.fillStyle = 'rgba(0,0,0,.5)';
  atom.context.fillRect(0, 0, atom.width, atom.height);

  atom.context.font = '30px "8bit"';
  atom.context.fillStyle = 'red';
  
  var commiseration = 'Centrelink chic is so last season';
  var textDimensions = atom.context.measureText(commiseration);
  atom.context.fillText(commiseration, atom.width / 2 - textDimensions.width / 2, 100);
  
  var scoreText = "SCORE: " + this.score.value();
  var textDimensions = atom.context.measureText(scoreText);
  atom.context.fillText(scoreText, atom.width / 2 - textDimensions.width / 2, 150);

  var anyKeyText = "Press r to try again";
  var textDimensions = atom.context.measureText(anyKeyText);
  atom.context.fillStyle = 'white';
  atom.context.fillText(anyKeyText, atom.width / 2 - textDimensions.width / 2, 200);
  
  var self = this;
  var cycle_colours = ['red', 'green', 'white', 'blue', 'purple'];
  
  var draw_leaderboard = function(header, col, offsetpx) {
	  atom.context.font = '10px "8bit"';
	  atom.context.fillStyle = 'white';
	  atom.context.measureText(header);
	  atom.context.fillText(header, atom.width / 2 - textDimensions.width / 2 + offsetpx, 250);
  
	  for (var i = 0; i < this.scoreboard.length; i++) {
		  var text = this.scoreboard[i][col];
		  
		  atom.context.fillStyle = this.scoreboard[i]["default"] ? 'red' : cycle_colours[Math.floor(Math.random() * cycle_colours.length)];
		  atom.context.measureText(text);
		  atom.context.fillText(text, atom.width / 2 - textDimensions.width / 2 + offsetpx, 270 + (20 * i));
	  }
  }.bind(this);

  draw_leaderboard("RANK", "rank", 0);
  draw_leaderboard("SCORE", "score", 80);
  draw_leaderboard("PLAYER", "player", 160);
  
  this.albert.draw(atom.width / 2 - 32 * 4, atom.height - 350, 5);
}

var color_rank = function(rank) {
  return 'rgba(0, 0, 0, ' + rank + ')';
};
