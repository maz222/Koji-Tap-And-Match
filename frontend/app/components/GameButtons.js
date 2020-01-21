class HoverButton {
	//origin - [x,y] - pixels
	//dimensions - [width,height] - pixels
	//defaultInfo - {image,backgroundColor}
	//hoverInfo - {image,backgroundColor}
	constructor(origin,dimensions,defaultInfo,hoverInfo) {
		this.hovered = false;
		this.origin = origin;
		this.dimensions = dimensions;
		this.defaultInfo = defaultInfo;
		this.hoverInfo = hoverInfo;
	}
	render() {
		let padding = Math.min(this.dimensions[0] * .5, this.dimensions[1] * .5);
		let info = this.hovered ? this.hoverInfo : this.defaultInfo;
		push();
        stroke('rgba(0,0,0,.25)');
		fill(info.backgroundColor);
		rect(this.origin[0],this.origin[1],this.dimensions[0],this.dimensions[1],5);
		image(info.image,this.origin[0]+padding/2,this.origin[1]+padding/2,this.dimensions[0]-padding,this.dimensions[1]-padding);
		pop();
	}
	handleHover() {
		if(mouseX >= this.origin[0] && mouseX <= this.origin[0]+this.dimensions[0]) {
			if(mouseY >= this.origin[1] && mouseY <= this.origin[1]+this.dimensions[1])
			{
				this.hovered = true;
			}
		}
		else {
			this.hovered = false;
		}
	}
	handleClick() {
		return;
	}
}

class BackButton extends HoverButton {
	handleClick() {
		if(this.hovered) {
			soundController.mute();
			window.setAppView("intro");
		}
	}
}

class SoundButton extends HoverButton {
    constructor(origin,dimensions,defaultInfo,hoverInfo) {
        super(origin,dimensions,defaultInfo,hoverInfo);
    }
    render() {
       	let padding = Math.min(this.dimensions[0] * .5, this.dimensions[1] * .5);
		let info = this.hovered ? this.hoverInfo : this.defaultInfo;
		push();
        stroke('rgba(0,0,0,.25)');
		fill(info.backgroundColor);
		rect(this.origin[0],this.origin[1],this.dimensions[0],this.dimensions[1],5);
        info = !(JSON.parse(sessionStorage.getItem('isMuted'))) ? this.hoverInfo : this.defaultInfo;
		image(info.image,this.origin[0]+padding/2,this.origin[1]+padding/2,this.dimensions[0]-padding,this.dimensions[1]-padding);
		pop(); 
    }
	handleClick() {
        console.log("sound clicked");
		if(this.hovered) {
			soundController.toggleMute();
			let t = JSON.parse(sessionStorage.getItem('isMuted'));
			sessionStorage.setItem('isMuted',!t);
		}
	}
}