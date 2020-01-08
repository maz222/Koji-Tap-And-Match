class ItemBaseState {
	constructor(item) {
		this.item = item;
	}
	update() {
		return this;
	}
	render() {
		image(this.item.image,this.item.position[0],this.item.position[1],this.item.radius*2,this.item.radius*2);
		//fill(255,0,0);
		//rect(this.item.position[0],this.item.position[1],this.item.radius*2,this.item.radius*2);
	}
}

class ItemSpawnState extends ItemBaseState {
	constructor(item,spawnTime) {
		super(item);
		this.timer = 0;
		this.spawnTime = spawnTime;
	}
	update() {
        if(frameRate() > 0) {
		    this.timer += 1/frameRate();
        }
		if(this.timer < this.spawnTime) {
			return this;
		}
		return new ItemBaseState(this.item);
	}
	render() {
		let timeFactor = lerp(0,1,this.timer/this.spawnTime);
		let newRadius = this.item.radius * timeFactor;
		let radDiff = this.item.radius - newRadius;
		let newPosition = [this.item.position[0]+this.item.radius-newRadius,this.item.position[1]+this.item.radius-newRadius];
		push();
		//rectMode(CENTER);
		//angleMode(DEGREES);
		translate(newPosition[0],newPosition[1]);
		//rotate(360*timeFactor);
		fill(255,0,0);
		image(this.item.image,0,0,newRadius*2,newRadius*2);
		//rect(0,0,newRadius*2,newRadius*2);
		pop();
	}
}

class ItemSelectedState extends ItemBaseState {
	render() {
		push();
		fill(Koji.config.game.itemSelectedColor);
		stroke(0);
		strokeWeight(1);
		let pos = this.item.position;
		let pad = this.item.padding * .8;
		let rad = this.item.radius;
		rect(pos[0]-pad,pos[1]-pad,(rad+pad)*2,(rad+pad)*2,10);
		pop();
		super.render();
	}	
}

class ItemHoverState extends ItemBaseState {
	update() {
		return new ItemBaseState(this.item);
	}
	render() {
		push();
		fill(Koji.config.game.itemHoverColor);
		stroke(0);
		strokeWeight(1);
		let pos = this.item.position;
		let pad = this.item.padding *.8;
		let rad = this.item.radius;
		rect(pos[0]-pad,pos[1]-pad,(rad+pad)*2,(rad+pad)*2,10);
		pop();
		super.render();
	}
}

class ItemFailState extends ItemBaseState {
	render() {
		super.render();
		push();
		let pos = this.item.position;
		let rad = this.item.radius;
		let sW = Math.max(this.item.radius/2,4);
		strokeWeight(sW+Math.max(this.item.radius/10,1));
		stroke(0,0,0);
		line(pos[0],pos[1],pos[0]+rad*2,pos[1]+rad*2);
		line(pos[0]+rad*2,pos[1],pos[0],pos[1]+rad*2);	
		strokeWeight(sW);
		stroke(255,0,0);
		line(pos[0],pos[1],pos[0]+rad*2,pos[1]+rad*2);
		line(pos[0]+rad*2,pos[1],pos[0],pos[1]+rad*2);
		pop();
	}
}

class Item {
	constructor(image,itemID,position,radius,padding,spawnTime=2) {
		this.image = image;
		this.itemID = itemID;
		this.position = position;
		this.radius = radius;
		this.padding = padding;
		this.state = new ItemSpawnState(this,spawnTime);
	}
	setBase() {
		this.state = new ItemBaseState(this);
	}
	setHover() {
		if(!(this.state instanceof ItemSelectedState)) {
			this.state = new ItemHoverState(this);
		}
	}
    spawnParticles() {
        let particleImage = this.image;
        let particleRad = this.radius*.5;
        let fadeTime = 1;
		const particleCount = 5;
		for(var i=0; i<particleCount; i++) {
			let particlePos = [this.position[0],this.position[1]];
			let xPos = lerp(-1,1,i/particleCount)*5;
			let velocity = [xPos,-20];
			particleController.addParticle(this.itemID,particleRad,particlePos,velocity);
		}
    }
	setClicked() {
        soundController.playSound(0);
        this.spawnParticles();
		this.state = new ItemSelectedState(this);
	}
	setFail() {
		this.state = new ItemFailState(this);
        shakeCount = 5;
	}
	checkHover() {
		if(mouseX >= this.position[0]-this.padding && mouseX <= this.position[0]+this.radius*2+this.padding) {
			return(mouseY >= this.position[1]-this.padding && mouseY <= this.position[1]+this.radius*2+this.padding)
		}
		return false;
	}
	update() {
		this.state = this.state.update();
		return this;
	}
	render() {
		this.state.render();
	}
}