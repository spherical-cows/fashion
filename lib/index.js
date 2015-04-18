var Challenge = function(chars) {
  this.chars = chars;
};

var currentChallenge = new Challenge(['w', 'o', 'r', 'd']);

var game = new atom.Game();

atom.input.bind(atom.key.LEFT_ARROW, 'left');

game.update = function(dt) {
  var color = atom.input.down('left') ? "black" : "yellow";
  atom.context.fillStyle = color;
};

game.draw = function() {
  atom.context.fillRect(0, 0, atom.width, atom.height);
  atom.context.fillStyle = 'red';
  atom.context.font = "30px Monaco";
  atom.context.fillText(currentChallenge.chars.join(''), atom.width / 2, atom.height / 2);
};

window.onblur = function() { game.stop(); };
window.onfocus = function() { game.run(); };

game.run();
