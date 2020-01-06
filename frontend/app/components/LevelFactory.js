class LevelFactory {
	constructor(items,gridRows,gridColumns) {
		this.items = items;
		this.gridRows = gridRows;
		this.gridColumns = gridColumns;
	}
	getTargetItems(items=this.items,count=0) {
		if(count === 0) {
			count = Math.max(Math.round(Math.random() * items.length),1);
		}
		count = Math.min(count,this.gridColumns*this.gridRows);
		let itemsCopy = items.slice();
		let targetItems = [];
		while(count > 0) {
			let index = Math.floor(Math.random()*itemsCopy.length);
			targetItems.push(itemsCopy[index]);
			itemsCopy.splice(index,1);
			count -= 1;
		}
		return targetItems;
	}
	buildEmptyLevel() {
		let level = [];
		for(var i=0; i<this.gridRows;i++) {
			let t = [];
			for(var j=0; j<this.gridColumns; j++) {
				t.push(undefined);
			}
			level.push(t);
		}
		return level;
	}
	buildRandomLevel(items=this.items,count=0) {
		let targetItems = this.getTargetItems(items,count);
		return this.buildLevel(items,targetItems);
	}
	flattenIndex(row,column,grid) {
		return row * grid[0].length + column;
	}	 
	unflattenIndex(flatIndex,grid) {
		return [Math.floor(flatIndex/grid[0].length),flatIndex%grid[0].length];
	}
	buildLevel(items, targetItems) {
		//get empty level
		let level = this.buildEmptyLevel();
		//determing how many of each target item you can have
		let maxGroupSize = Math.floor((level[0].length * level.length) / targetItems.length);
		let cells = [];
		for(var i=0; i<level.length; i++) {
			for(var j=0; j<level[0].length; j++) {
				cells.push(this.flattenIndex(i,j,level));
			}
		}
		let groupSizes = {};
		//for each target item, assign random cells to its value
		for(var i in targetItems) {
			let count = Math.max(Math.floor(Math.random() * maxGroupSize),1);
			groupSizes[i] = count;
			while(count > 0) {
				let randIndex = Math.floor(Math.random() * cells.length);
				let levelIndex = this.unflattenIndex(cells[randIndex],level);
				level[levelIndex[0]][levelIndex[1]] = targetItems[i];
				cells.splice(randIndex,1);
				count -= 1;
			}
		}
		//fill out the rest of the level
		for(var i in cells) {
			let levelIndex = this.unflattenIndex(cells[i],level);
			//get a random item and place it
			let itemIndex = Math.floor(Math.random() * items.length);
			while(itemIndex in groupSizes && groupSizes[itemIndex] >= maxGroupSize * 2) {
				itemIndex = Math.floor(Math.random() * items.length);
			}
			level[levelIndex[0]][levelIndex[1]] = itemIndex;
			if(itemIndex in groupSizes) {
				groupSizes[itemIndex] += 1;
			}
			else {
				groupSizes[itemIndex] = 1;
			}
		}
		return [level,targetItems];
	}
}