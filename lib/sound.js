var Sound = function() {
	this.current_music = null;
};

Sound.prototype.title = function () {
	this.play_music('assets/sound/intro-loop.mp3');
};

Sound.prototype.cheer = function () {
	this.play_effect('assets/sound/fx/crowd.mp3');
};

Sound.prototype.play_effect = function(url) {
	new Howl({ urls: [url] }).play();
};

Sound.prototype.play_music = function(url) {
	!current_music || current_music.stop();
	this.current_music = new Howl({ urls: [url] });
	this.current_music.play();
};