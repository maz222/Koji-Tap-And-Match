var spawnTimer = .25;
var failBlinkTimer = .25;
var failBlinkCount = 1;

class GridBaseState {
	constructor(grid) {
		this.grid = grid;
	}
	update() {
		for(var i=0; i<this.grid.grid.length; i++) {
			for(var j=0; j<this.grid.grid[i].length; j++) {
				this.grid.grid[i][j] = this.grid.grid[i][j].update();
			}
		}
		return this;
	}
    renderBackground() {
        push();
        strokeWeight(0);
		fill(Koji.config.game.grid.backgroundColor);
		rect(this.grid.pxOrigin[0],this.grid.pxOrigin[1],this.grid.pxWidth,this.grid.pxHeight);
		if('gridBackground' in graphics) {
			let img = graphics['gridBackground'];
			image(img,this.grid.pxOrigin[0],this.grid.pxOrigin[1],this.grid.pxWidth,this.grid.pxHeight);
		}
		pop();    
    }
    renderItems() {
		for(var i=0; i<this.grid.grid.length; i++) {
			for(var j=0; j<this.grid.grid[i].length; j++) {
				this.grid.grid[i][j].render();
			}
		}        
    }
	render() {
		push();
        strokeWeight(0);
		fill(Koji.config.game.grid.backgroundColor);
		rect(this.grid.pxOrigin[0],this.grid.pxOrigin[1],this.grid.pxWidth,this.grid.pxHeight);
		if('gridBackground' in graphics) {
			let img = graphics['gridBackground'];
			image(img,this.grid.pxOrigin[0],this.grid.pxOrigin[1],this.grid.pxWidth,this.grid.pxHeight);
		}
		pop();
		for(var i=0; i<this.grid.grid.length; i++) {
			for(var j=0; j<this.grid.grid[i].length; j++) {
				this.grid.grid[i][j].render();
			}
		}
	}
	handleHover() {
		for(var i=0; i<this.grid.grid.length; i++) {
			for(var j=0; j<this.grid.grid[i].length; j++) {
				if(this.grid.grid[i][j].checkHover()) {
					this.grid.grid[i][j].setHover();
				}
			}
		}
		return;
	}
	handleClick() {
		for(var i=0; i<this.grid.grid.length; i++) {
			for(var j=0; j<this.grid.grid[i].length; j++) {
				if(this.grid.grid[i][j].checkHover()) {
					this.grid.grid[i][j].setClicked();
					this.grid.activateCell([i,j]);
				}
			}
		}
		return;
	}
}

class GridSpawnState extends GridBaseState{
	constructor(grid,spawnTimer) {
		super(grid);
		this.spawnTimer = spawnTimer;
		this.timer = 0;
	}
	update() {
		super.update()
		if(frameRate() > 0) {
			this.timer += 1/frameRate();
		}
		if(this.timer >= this.spawnTimer) {
			return new GridBaseState(this.grid);
		}
		return this;
	}
	handleHover() {
		return;
	}
	handleClick() {
		return;
	}
}

class GridFailState extends GridBaseState {
	constructor(grid,failCell,blinkTimer,blinkCount) {
		super(grid);
		this.timer = -blinkTimer *.5;
		this.failCell = failCell;
		this.blinkTimer = blinkTimer;
		this.blinkCount = blinkCount;
		this.grid.grid[this.failCell[0]][this.failCell[1]].setFail();
	}
	update() {
		if(this.timer < this.blinkTimer && this.timer > 0) {
			this.grid.grid[this.failCell[0]][this.failCell[1]].setBase();
		}
		else {
			this.grid.grid[this.failCell[0]][this.failCell[1]].setFail();
			if(this.timer >= this.blinkTimer * 2) {
				this.blinkCount -= 1;
				this.timer = 0;
			}
		}
		this.timer += 1/frameRate();
		if(this.blinkCount == 0) {
			return null;
		}
		return this;
	}
    renderItems() {
        super.renderItems();
        this.grid.grid[this.failCell[0]][this.failCell[1]].render()
    }
	render() {
		super.render();
		this.grid.grid[this.failCell[0]][this.failCell[1]].render();
	}
	handleHover() {
		return;
	}
	handleClick() {
		return;
	}
}

class GameGrid {
	//pxOrigin - [x,y] in px - origin of the area that contains the grid!
	//pxDimensions - [width,height] in px - of area that contains the grid!
	//gridDimensions - [columns,rows]
	constructor(pxOrigin,pxDimensions,level,refreshCallback) {
		this.refresh = refreshCallback;
		this.pxOrigin = pxOrigin;
		this.pxWidth = pxDimensions[0];
		this.pxHeight = pxDimensions[1];
		this.columns = level[0][0].length;
		this.rows = level[0].length;
		this.grid = []
		this.copyGrid(level[0]);
		this.targetItems = level[1];
		this.targetCells = new Set([]);
		this.activeCells = new Set([]);
		this.state = null;
		this.loadItems();
	}
	copyGrid(grid) {
		for(var i=0; i< grid.length; i++) {
			this.grid[i] = [];
			for(var j=0; j < grid[i].length; j++) {
				this.grid[i].push(grid[i][j]);
			}
		}
	}
	loadItems() {
        console.log("loading items");
		let pxBound = Math.min(this.pxWidth,this.pxHeight);
		let cellBound = Math.max(this.columns,this.rows);
		let cellRad = pxBound / cellBound / 2;
		let padding = cellRad * .5;
		let widthPX = cellRad * this.columns * 2;
		let heightPX = cellRad * this.rows * 2;
		let gridOrigin = [this.pxOrigin[0] + this.pxWidth/2, this.pxOrigin[1] + this.pxHeight/2];
		gridOrigin = [gridOrigin[0] - widthPX/2, gridOrigin[1] - heightPX/2];
		cellRad -= padding;
		let tItems = new Set(this.targetItems);
		for(var i=0; i<this.rows; i++) {
			for(var j=0; j<this.columns; j++) {
				let itemImg = graphics['items'][this.grid[i][j]];
				let itemID = this.grid[i][j];
				let itemPosX = gridOrigin[0] + j*cellRad*2 + padding*(j*2+1);
				let itemPosy = gridOrigin[1] + i*cellRad*2 + padding*(i*2+1);
				let itemPos = [itemPosX,itemPosy];
				this.grid[i][j] = new Item(itemImg, itemID, itemPos, cellRad, padding, spawnTimer);
				if(tItems.has(itemID)) {
					this.targetCells.add(i*this.columns+j);
				}

			}
		}
		this.state = new GridSpawnState(this,spawnTimer);
	}
	activateCell(cell) {
		if(this.targetCells.has(cell[0]*this.columns+cell[1])) {
			this.activeCells.add(cell[0]*this.columns+cell[1]);
			if(this.activeCells.size === this.targetCells.size) {
				this.refresh(true);
			}
		}
		else {
			this.state = new GridFailState(this,cell,failBlinkTimer,failBlinkCount);
		}
	}
	update() {
		this.state = this.state.update();
		if(this.state === null) {
			this.refresh(false);
		}
	}
	handleHover() {
		this.state.handleHover();
	}
	handleClick() {
		this.state.handleClick();
	}
    renderBackground() {
        this.state.renderBackground();
    }
    renderItems() {
        this.state.renderItems();
    }
	render() {
		this.state.render(offset);
	}
}