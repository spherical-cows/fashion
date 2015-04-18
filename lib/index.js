var corpus = new Corpus();
var word = corpus.suggest();
var challenges = [];
for (var x = 0; x < 10; x++) {
  word = corpus.next(word);
  challenges.push(new Challenge(word.split('')));
}

var currentChallenge = challenges.shift();

var score = new Score();
var flash = null;

function win() {
  sound.cheer();
  atom.context.fillStyle = 'rgba(0,255,0,.75)';
}

function lose() {
  flash = new ScreenFlash('rgba(255,0,0,.5)', 0.1);
}

var timer = new Timer(30);
timer.addEvent(10, function() {
  if (score.score > 5) {
    new Howl({ 
      urls: ['assets/sound/fx/crowd.mp3'],
      buffer: true,
    }).play();
  }
});
timer.onEnd(lose);

var sound = new Sound();

var game = new atom.Game();

for (var keycode = 65; keycode <= 90; keycode++) {
  atom.input.bind(keycode, String.fromCharCode(keycode));
}
atom.input.bind(atom.key.LEFT_ARROW, 'left');

var color_rank = function(rank) {
  var c = Math.floor(255 * rank);
  return 'rgba(' + [c, c, c].join(', ') + ', .5)';
};

game.update = function(dt) {
  timer.update(dt);
  score.update(dt);

  atom.context.fillStyle = color_rank(score.rank());
  
  if (atom.input.pressed(currentChallenge.next())) {
    currentChallenge.advance();
    score.yay();
  } else if (Object.keys(atom.input._pressed).length) {
    atom.context.fillStyle = 'rgba(255,0,0,.5)';
    score.boo();
  }

  if (currentChallenge.complete()) {
    currentChallenge = challenges.shift()
  }

  if (!currentChallenge) {
    win()
  }

  if (flash) {
    flash.update(dt);
  }
};

var fontSize = 30;
var background = new Image();
background.src = 'assets/background.png'
game.draw = function() {
  atom.context.drawImage(background, 0, 0, atom.width, atom.height);
  atom.context.fillRect(0, 0, atom.width, atom.height);
  atom.context.fillStyle = 'red';
  atom.context.font = fontSize+'px Monaco';

  score.draw(atom.context);

  var text = currentChallenge.chars.join('');
  var textDimensions = atom.context.measureText(text);
  atom.context.fillText(text, atom.width / 2 - textDimensions.width / 2, (atom.height / 2) + fontSize / 2);
  atom.context.fillStyle = 'blue';
  atom.context.fillText(currentChallenge.enteredChars.join(''), atom.width / 2 - textDimensions.width / 2, (atom.height / 2) + fontSize / 2);

  text = Math.round(timer.value()).toString()
  textDimensions = atom.context.measureText(text);
  atom.context.fillStyle = 'white';
  atom.context.fillText(text, atom.width / 2 - textDimensions.width / 2, 50);

  if (flash && !flash.complete) {
    atom.context.fillStyle = flash.color;
    atom.context.fillRect(0, 0, atom.width, atom.height);
  }
};

window.onblur = function() { game.stop(); };
window.onfocus = function() { game.run(); };

game.run();
