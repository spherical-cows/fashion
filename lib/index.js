var sound = new Sound();
var game = new atom.Game();
var currentScreen = new SplashScreen();

for (var keycode = 65; keycode <= 90; keycode++) {
  atom.input.bind(keycode, String.fromCharCode(keycode));
}
atom.input.bind(atom.key.SPACE, ' ');
atom.input.bind(atom.key.LEFT_ARROW, 'left');

atom.context.imageSmoothingEnabled = false;
atom.context.mozImageSmoothingEnabled = false;
atom.context.webkitImageSmoothingEnabled = false;

game.update = function(dt) {
  currentScreen.update(dt);
};

game.draw = function() {
  currentScreen.draw();
};

window.onblur = function() { game.stop(); };
window.onfocus = function() { game.run(); };

game.run();
