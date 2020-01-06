function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

    if (delta == 0)
    h = 0;
    else if (cmax == r)
    h = ((g - b) / delta) % 6;
    else if (cmax == g)
    h = (b - r) / delta + 2;
    else
    h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
    h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return [h,s,l];
}

function formatHSL(hslArray) {
    return "hsl(" + hslArray[0] + "," + hslArray[1] + "%," + hslArray[2] + "%)"; 
}

//timer - in seconds

class TopBar {
	constructor(pxOrigin,pxDimensions,maxRounds,maxTimer) {
        console.log(graphics);
        const VCC = Koji.config.game;
		this.currentRound = 1;
		this.maxRounds = maxRounds;
		this.timer = maxTimer;
		this.strokeSize = 0;
		this.origin = pxOrigin;
		this.dimensions = pxDimensions;
		let buttonDimensions = [this.dimensions[1]*.6, this.dimensions[1]*.6];
		let backOrigin = [this.origin[0]+buttonDimensions[0]*.25,this.origin[1]+this.dimensions[1]*.2];
    let backColor = VCC.topBar.backbutton.backgroundColor;
    let backHoverColor = hexToHSL(backColor);
    backHoverColor[2] = Math.max(0,backHoverColor[2] - 20);
    backHoverColor = formatHSL(backHoverColor);
		this.backButton = new BackButton(backOrigin,buttonDimensions,{image:graphics['backButton'],backgroundColor:backColor},{image:graphics['backButton'],backgroundColor:backHoverColor});
		let soundOrigin = [this.origin[0]+this.dimensions[0]-buttonDimensions[0]-buttonDimensions[0]*.25,this.origin[1]+this.dimensions[1]*.2];
    let soundColor = VCC.topBar.soundButton.backgroundColor;
    let soundHoverColor = hexToHSL(soundColor);
    soundHoverColor[2] = Math.max(0,soundHoverColor[2] - 20);
    soundHoverColor = formatHSL(soundHoverColor);
    console.log(soundColor);
		this.soundButton = new SoundButton(soundOrigin,buttonDimensions,{image:graphics['soundButton']['off'],backgroundColor:soundColor},{image:graphics['soundButton']['on'],backgroundColor:soundHoverColor});
	}
	update() {
		if(frameRate() > 1) {
			this.timer = Math.max(0,this.timer - 1/frameRate());
		}
	}
	render() {
		push();
		stroke(0);
		strokeWeight(this.strokeSize);
    fill(Koji.config.game.topBar.background.backgroundColor);
		rect(this.origin[0]+this.strokeSize,this.origin[1]+this.strokeSize,this.dimensions[0]-this.strokeSize*2,this.dimensions[1]-this.strokeSize*2);
		if('topBar' in graphics) {
			let img = graphics['topBar'];
			image(img,this.origin[0]+this.strokeSize,this.origin[1]+this.strokeSize,this.dimensions[0]-this.strokeSize*2,this.dimensions[1]-this.strokeSize*2);
		}
		pop();
		this.backButton.render();
		this.renderRoundCount();
		this.renderTimer();
		this.soundButton.render();
	}
	renderRoundCount() {
		push();
		textSize(32);
		textAlign(CENTER,CENTER);
		fill(Koji.config.game.topBar.roundCounter);
		let buttonSpacing = this.dimensions[1]*.6 + this.dimensions[1]*.6*.5;
		let actualWidth = this.dimensions[0] - buttonSpacing*2;
		let xPos = this.origin[0] + actualWidth/4 + buttonSpacing;
		let yPos = this.origin[1] + this.dimensions[1]/2;
		text(this.currentRound.toString() + " / " + this.maxRounds.toString(),xPos,yPos);
		pop();
	}
	renderTimer() {
		push();
    textSize(32);	
		textAlign(CENTER,CENTER);
		fill(Koji.config.game.topBar.timer);
		let buttonSpacing = this.dimensions[1]*.6 + this.dimensions[1]*.6*.5;
		let actualWidth = this.dimensions[0] - buttonSpacing*2;
		let xPos = this.origin[0] + actualWidth/4 * 3 + buttonSpacing;
		let yPos = this.origin[1] + this.dimensions[1]/2;
		let mins = Math.floor(this.timer / 60);
		if(mins < 10) {
			mins = "0" + mins.toString();
		}
		let seconds = Math.floor(this.timer % 60);
		if(seconds < 10) {
			seconds = "0" + seconds.toString();
		}
		text(mins + ":" + seconds,xPos,yPos);
		pop();
	}
	handleHover() {
		this.soundButton.handleHover();
		this.backButton.handleHover();
	}
	handleClick() {
		this.soundButton.handleClick();
		this.backButton.handleClick();
	}
}