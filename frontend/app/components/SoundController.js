class SoundController {
	constructor() {
		this.data = {
			sounds:[],
			music:null,
			isMuted:true
		};
        userStartAudio();
	}
	toggleMute() {
		this.data.isMuted = !this.data.isMuted;
		if(this.data.isMuted) {
			this.mute();
		}
		else {
            this.playMusic()
		}
	}
	//[0] - click, [1] - pass, [2] - fail
	playSound(soundIndex) {
		if(!this.data.isMuted && this.data.sounds[soundIndex] != null) {
			this.data.sounds[soundIndex].play();
		}
	}
	playMusic() {
		if(!this.data.isMuted && this.data.music != null) {
            this.data.music.setVolume(0.25);
			this.data.music.loop();
		}
	}
	mute() {
		for(var i in this.data.sounds) {
			if(this.data.sounds[i] != null) {
				this.data.sounds[i].stop();
			}
		}
		if(this.data.music != null) {
			this.data.music.stop();
		}
	}
}