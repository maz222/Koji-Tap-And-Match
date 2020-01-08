class Particle {
    constructor(imageIndex,radius,position,launchVelocity) {
        this.reset(imageIndex,radius,position,launchVelocity);
    }
    reset(imageIndex,radius,position,launchVelocity) {
        this.imageIndex = imageIndex;
        this.radius = radius;
        this.position = position;
        this.launchVelocity = launchVelocity;
        this.velocity = this.launchVelocity;
        this.timer = 0;
		this.image = graphics['items'][imageIndex];
    }
    update() {
        if(this.position[1] > height || this.position[0] > width || this.position[0] < 0) {
            return null;
        }
        this.timer += 1/frameRate();
        const gravity = [0,1];
        this.velocity[0] = this.velocity[0] + gravity[0];
        this.velocity[1] = this.velocity[1] + gravity[1];
        this.position[0] += this.velocity[0];
        this.position[1] += this.velocity[1];
		return this;
    }
    render() {
        const rotationAnglePerSecond = 180;
        const rotatedAngle = Math.floor(this.timer * rotationAnglePerSecond);
        push();
        angleMode(DEGREES);
        rectMode(CENTER);
        translate(this.position[0],this.position[1]);
        rotate(rotatedAngle);
        //image(this.image,this.position[0],this.position[1],this.radius*2,this.radius*2);
		image(this.image,0,0,this.radius*2,this.radius*2);
        pop();
    }
}

class ParticlePool {
    constructor() {
        this.activeParticles = [];
        this.deadParticles = [];
    }
    addParticle(imageIndex,radius,position,launchVelocity) {
        let particle = null;
        if(this.deadParticles.length > 0) {
            particle = this.deadParticles.pop();
            particle.reset(imageIndex,radius,position,launchVelocity);
        } 
        else {
            particle = new Particle(imageIndex,radius,position,launchVelocity);
        }
        this.activeParticles.push(particle);
    }
    update() {
        let temp = [];
		const count = this.activeParticles.length;
        for(var i=0; i<count; i++) {
            let p = this.activeParticles.pop();
            if(p.update() === null) {
                this.deadParticles.push(p);
            }
            else {
                temp.push(p);
            }
        }
        this.activeParticles = temp;
    }
    render() {
        for(var i in this.activeParticles) {
            this.activeParticles[i].render();
        }
    }
}