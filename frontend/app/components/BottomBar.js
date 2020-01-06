class BottomBar {
	//pxOrigin - [x,y] in px - origin of the area that contains the bar!
	//pxDimensions - [width,height] in px - of area that contains the bar!
	constructor(items,pxOrigin,pxDimensions) {
		this.items = items;
		this.origin = pxOrigin;
		this.dimensions = pxDimensions;
		this.strokeSize = 0;
		this.loadItems();
	}
	loadItems() {
		let tItems = [];
		let midPoint = [this.origin[0]+this.strokeSize+this.dimensions[0]/2, this.origin[1]+this.strokeSize+this.dimensions[1]/2];
		let itemDiam = Math.min(this.dimensions[0]/this.items.length, this.dimensions[1]);
		let itemPadding = itemDiam * .25;
		let itemRad = (itemDiam - itemPadding)/2;
		let offset = 0;
		if(this.items.length % 2 === 0) {
			offset += itemDiam/2;
		}
		midPoint[0] -= Math.floor(this.items.length/2) * itemDiam;
		if(this.items.length%2 !== 0) {
			midPoint[0] -= itemDiam/2;
		}
		//left items
		for(var i=0; i<this.items.length; i++) {
			let itemImg = graphics['items'][this.items[i]];
			let itemId = this.items[i];
			let itemPos = [midPoint[0]+i*itemDiam,midPoint[1]-itemDiam/2+itemPadding/2];
			let tItem = new Item(itemImg, itemId,itemPos,itemRad,itemPadding,0);
			tItems.push(tItem);
		}
		this.items = tItems;
	} 
	update() {
		for(var i in this.items) {
			this.items[i].update();
		}
	}
	render() {
		push();
		stroke(0);
		strokeWeight(this.strokeSize);
		fill(Koji.config.game.bottomBar.backgroundColor);
		rect(this.origin[0]+this.strokeSize,this.origin[1]+this.strokeSize,this.dimensions[0]-this.strokeSize*2,this.dimensions[1]-this.strokeSize*2);
		if('bottomBar' in graphics) {
			let img = graphics['bottomBar'];
			image(img,this.origin[0]+this.strokeSize,this.origin[1]+this.strokeSize,this.dimensions[0]-this.strokeSize*2,this.dimensions[1]-this.strokeSize*2);
		}
		pop();
		for(var i in this.items) {
			this.items[i].render();
		}
	}
}