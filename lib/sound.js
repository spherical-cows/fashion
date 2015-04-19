var Sound = function() {
	this.current_music = null;
};

Sound.prototype.title = function () {
	this.play_music('assets/sound/intro-loop.mp3');
};

Sound.prototype.cheer = function (howler_opts) {
	var sound  = new Howl({ 
		urls: ['assets/sound/fx/crowd-big.mp3'],
		volume: 0
	}).play().fade(0.0, 1.0, 1000, function() {
		sound.fade(1.0, 0.0, 1500);
	});
};

Sound.prototype.play_music = function(url) {
	!current_music || current_music.stop();
	this.current_music = new Howl({ urls: [url] });
	this.current_music.play();
};