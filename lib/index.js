var game = new atom.Game();

atom.input.bind(atom.key.LEFT_ARROW, 'left');

game.update = function(dt) {
  var color = atom.input.down('left') ? "black" : "yellow";
  atom.context.fillStyle = color;
};

game.draw = function() {
  atom.context.fillRect(0, 0, atom.width, atom.height);
};

window.onblur = function() { game.stop(); };
window.onfocus = function() { game.run(); };

game.run();
