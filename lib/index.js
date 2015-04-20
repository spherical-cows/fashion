var sound = new Sound();
var game = new atom.Game();
var currentScreen = new PresentedBy();

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'assets/fonts.css';
document.getElementsByTagName('head')[0].appendChild(link);

var image = new Image;
image.src = link.href;
image.onerror = function() {
    atom.context.font = '10px "8bit"';
    for (var keycode = 65; keycode <= 90; keycode++) {
      atom.input.bind(keycode, String.fromCharCode(keycode));
    }
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

    window.onblur = function() { game.stop(); Howler.mute(); };
    window.onfocus = function() { game.run(); Howler.unmute(); };

    game.run();
};

