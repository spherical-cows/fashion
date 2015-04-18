var challenges = [
  new Challenge(['W', 'O', 'R', 'D', 'S']),
  new Challenge(['A', 'R', 'E']),
  new Challenge(['N', 'E', 'A', 'T']),
]
var currentChallenge = challenges.shift();

var game = new atom.Game();

for (var keycode = 65; keycode <= 90; keycode++) {
  atom.input.bind(keycode, String.fromCharCode(keycode));
}
atom.input.bind(atom.key.LEFT_ARROW, 'left');

game.update = function(dt) {
  atom.context.fillStyle = 'black';
  
  if (atom.input.pressed(currentChallenge.next())) {
    currentChallenge.advance();
  }

  if (currentChallenge.complete()) {
    currentChallenge = challenges.shift()
  }

  if (!currentChallenge) {
    atom.context.fillStyle = 'lime';
  }
};

game.draw = function() {
  atom.context.fillRect(0, 0, atom.width, atom.height);
  atom.context.fillStyle = 'red';
  atom.context.font = '30px Monaco';
  atom.context.fillText(currentChallenge.chars.join(''), atom.width / 2, atom.height / 2);
  atom.context.fillStyle = 'blue';
  atom.context.fillText(currentChallenge.enteredChars.join(''), atom.width / 2, atom.height / 2);
};

window.onblur = function() { game.stop(); };
window.onfocus = function() { game.run(); };

game.run();
