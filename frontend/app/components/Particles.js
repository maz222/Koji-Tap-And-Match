class ParticlePool {
	constructor() {
		this.pool = [];
	}
	addParticle(particle) {
		this.pool.push(particle);
	}
	update() {
		for(var i in this.pool) {
			this.pool[i] = this.pool[i].update();
			if(this.pool[i] == null) {
				this.pool.splice(i,1);
			}
		}
	}
	render() {
		for(var i in this.pool) {
			this.pool[i].render();
		}
	}
}

class Particle {
	constructor(image,radius,position,launchVector,fadeTime) {
		this.image = image;
		this.radius = radius;
		this.position = createVector(position[0],position[1]);
		this.launchVector = createVector(launchVector[0],launchVector[1]);
		this.fadeTime = fadeTime;
		this.timer = 0;
	}
	update() {
		if(this.position[1] > height || this.timer >= this.fadeTime) {
			return null;
		}
		this.timer += 1/frameRate();
		let friction = createVector(this.launchVector.x,this.launchVector.y);
		friction.mult(-1);
		friction.mult(.01);
		this.launchVector.add(friction);
		this.position.add(this.launchVector);
		const gravity = createVector(0,2.5);
		this.position.add(gravity);
		return this;
	}
	render() {
		push();
		tint(255,(this.fadeTime - this.timer)/this.fadeTime * 255);
		image(this.image,this.position.x,this.position.y,this.radius*2,this.radius*2);
		pop();
	}
}