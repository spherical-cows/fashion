var ScreenFlash = function(color, duration) {
  this.color = color;
  this.remaining = duration;
  this.complete = false;
  this.start = new Date();
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

var challenges = [
  new Challenge(['W', 'O', 'R', 'D', 'S']),
  new Challenge(['A', 'R', 'E']),
  new Challenge(['N', 'E', 'A', 'T']),
]
var currentChallenge = challenges.shift();

var score = new Score();
var flash = null;

var timer = new Timer(120);
timer.addEvent(2, function() {
  flash = new ScreenFlash('pink', 0.1)
});

var game = new atom.Game();

for (var keycode = 65; keycode <= 90; keycode++) {
  atom.input.bind(keycode, String.fromCharCode(keycode));
}
atom.input.bind(atom.key.LEFT_ARROW, 'left');

var color_rank = function(rank) {
  var c = Math.floor(255 * rank);
  return 'rgb(' + [c, c, c].join(', ') + ')';
};

game.update = function(dt) {
  timer.update(dt);

  atom.context.fillStyle = color_rank(score.rank());
  
  if (atom.input.pressed(currentChallenge.next())) {
    currentChallenge.advance();
    score.yay();
  } else if (Object.keys(atom.input._pressed).length) {
    atom.context.fillStyle = 'red';
    score.boo();
  }

  if (currentChallenge.complete()) {
    currentChallenge = challenges.shift()
  }

  if (!currentChallenge) {
	var sound = new Howl({ 
		urls: ['assets/sound/fx/crowd.mp3'],
		buffer: true,
  	}).play();
    atom.context.fillStyle = 'lime';
  }

  if (flash) {
    flash.update(dt);
  }
};

game.draw = function() {
  atom.context.fillRect(0, 0, atom.width, atom.height);
  atom.context.fillStyle = 'red';
  atom.context.font = '30px Monaco';

  atom.context.fillText(currentChallenge.chars.join(''), atom.width / 2, atom.height / 2);
  atom.context.fillStyle = 'blue';
  atom.context.fillText(currentChallenge.enteredChars.join(''), atom.width / 2, atom.height / 2);

  atom.context.fillStyle = 'white';
  atom.context.fillText(Math.round(timer.value()), atom.width / 2, 50);

  if (flash && !flash.complete) {
    atom.context.fillStyle = flash.color;
    atom.context.fillRect(0, 0, atom.width, atom.height);
  }
};

window.onblur = function() { game.stop(); };
window.onfocus = function() { game.run(); };

game.run();
