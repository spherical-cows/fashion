var Sound = function() {
	this.current_music = null;
};

Sound.prototype.title = function () {
	var sound  = new Howl({ 
		urls: ['assets/sound/intro-loop.mp3'],
		sprite: {
			a: [0,12000, true]
		},
		buffer: true
	})
	this.play_music(sound, "a");
};

Sound.prototype.gameplay = function () {
	var sound  = new Howl({ 
		urls: ['assets/sound/gameplay-loop.mp3'],
		sprite: {
			a: [0,4380, true]
		},
		buffer: true
	})
	this.play_music(sound, "a");
};

Sound.prototype.cheer = function () {
	var sound  = new Howl({ 
		urls: ['assets/sound/fx/crowd-big.mp3'],
		buffer: true,
		volume: 0
	}).play().fade(0.0, 1.0, 1000, function() {
		sound.fade(1.0, 0.0, 1500);
	});
};

Sound.prototype.error = function () {
	new Howl({ 
		urls: ['assets/sound/fx/error.wav'],
		buffer: true,
		volume: 1
	}).play();
};

Sound.prototype.cameras = function () {
	sprites = ['a', 'b', 'c', 'd', 'e'];
	var sound  = new Howl({ 
		urls: ['assets/sound/fx/flashbulbs.mp3'],
		sprite: {
			a: [0,500],
			b: [10000,10500],
			c: [15000,15500],
			d: [19000,19500],
			e: [23000,23500]
		},
		buffer: true
	});
	var random_sample = sprites[Math.floor(Math.random() * sprites.length)];
	sound.play('a');
};

Sound.prototype.play_music = function(sound, sprite) {
	this.stop();
	this.current_music = sound;
	sound.play(sprite);
};

Sound.prototype.stop = function () {
	if (this.current_music) {
		this.current_music.stop();
	}
}
