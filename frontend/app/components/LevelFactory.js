class LevelFactory {
	constructor(items) {
		this.items = items;
	}
	getTargetItems(gridRows,gridColumns,count=0) {
		let items = this.items;
		if(count === 0) {
			count = Math.max(Math.round(Math.random() * items.length),1);
		}
		count = Math.min(count,items.length);
		let itemsCopy = items.slice();
		let targetItems = [];
		while(count > 0) {
			let index = Math.floor(Math.random()*itemsCopy.length);
			targetItems.push(itemsCopy[index]);
			itemsCopy.splice(index,1);
			count -= 1;
		}
		return [targetItems,itemsCopy];
	}
	getFillerItems(gridRows,gridColumns,items,targetItems,count=0) {
		if(count === 0) {
			return [targetItems,[]];
		}
		count = Math.min(count,gridRows*gridColumns-targetItems.length);
		count = Math.min(count, items.length);
		let itemsCopy = items.slice();
		let fillerItems = [];
		while(count > 0) {
			let index = Math.floor(Math.random()*itemsCopy.length);
			fillerItems.push(itemsCopy[index]);
			itemsCopy.splice(index,1);
			count -= 1;
		}
		return [targetItems,fillerItems];
	}
	buildEmptyLevel(gridRows,gridColumns) {
		let level = [];
		for(var i=0; i<gridRows;i++) {
			let t = [];
			for(var j=0; j<gridColumns; j++) {
				t.push(-1);
			}
			level.push(t);
		}
		return level;
	}
	buildRandomLevel(gridRows,gridColumns,targetCount=0,fillerCount=0) {
		let items = this.getTargetItems(gridRows,gridColumns,targetCount);
        //console.log(items);
        console.log("targets fetched");
		items = this.getFillerItems(gridRows,gridColumns,items[1],items[0],fillerCount);
        console.log("fillers fetched");
        //console.log(items);
		let targetItems = items[0];
		let fillerItems = items[1];
		return this.buildLevel(gridRows,gridColumns,fillerItems,targetItems);
        //return null;
	}
	flattenIndex(row,column,grid) {
		return row * grid[0].length + column;
	}	 
	unflattenIndex(flatIndex,grid) {
		return [Math.floor(flatIndex/grid[0].length),flatIndex%grid[0].length];
	}
	buildLevel(gridRows,gridColumns,fillerItems,targetItems) {
		//get empty level
		let level = this.buildEmptyLevel(gridRows,gridColumns);
		//determing how many of each target item you can have
		let maxGroupSize = Math.floor((gridColumns * gridRows) / (targetItems.length + fillerItems.length));
		let cells = [];
		for(var i=0; i<level.length; i++) {
			for(var j=0; j<level[0].length; j++) {
				cells.push(this.flattenIndex(i,j,level));
			}
		}
		let groupSizes = {};
		//for each target item, assign random cells to its value
		for(var i in targetItems) {
			let count = Math.max(Math.floor(Math.random() * maxGroupSize),maxGroupSize*.8);
			groupSizes[targetItems[i]] = count;
			while(count > 0) {
				let randIndex = Math.floor(Math.random() * cells.length);
				let levelIndex = this.unflattenIndex(cells[randIndex],level);
				level[levelIndex[0]][levelIndex[1]] = targetItems[i];
				cells.splice(randIndex,1);
				count -= 1;
			}
		}
        //console.log(level);
        level = level.slice();
        //console.log(level);
		//fill out the rest of the level
        if(fillerItems.length === 0) {
            fillerItems = targetItems;
        }
        let fillerCopy = fillerItems.slice();
		for(var i in cells) {
			let levelIndex = this.unflattenIndex(cells[i],level);
			//get a random item and place it
			let itemIndex = Math.floor(Math.random() * fillerCopy.length);
			level[levelIndex[0]][levelIndex[1]] = fillerCopy[itemIndex];
            fillerCopy.splice(itemIndex,1);
            if(fillerCopy.length === 0) {
                fillerCopy = fillerItems.slice();
            }
		}
		return [level,targetItems];
	}
}