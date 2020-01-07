let graphics = {};
let testItem = null;

let currentLevel = {};
let topbar = null;
let gameGrid = null;
let bottomBar = null;
let levelFactory = null;

let soundController = null;
let particleController = null;

let loadCount = 0;
let loaded = false;
let shakeCount = 0;

//===This function is called before starting the game
//Load everything here
function preload() {
    graphics['items'] = [];
    for(var i in Koji.config.game.items) {
        graphics['items'].push(loadImage(Koji.config.game.items[i]));
    }
    let VCC = Koji.config.game;
    //load topBar
    if(VCC.topBar.background.backgroundImage !== "" && VCC.topBar.background.backgroundImage !== undefined) {
        graphics['topBar'] = loadImage(VCC.topBar.background.backgroundImage);
    }
    //load grid
    if(VCC.grid.backgroundImage !== "" && VCC.grid.backgroundImage !== undefined) {
        graphics['gridBackground'] = loadImage(VCC.grid.backgroundImage);
    }
    //load page bg
    if(VCC.background.mainBackground.backgroundImage !== "" && VCC.background.mainBackground.backgroundImage !== undefined) {
        graphics['gamePageBackground'] = loadImage(VCC.background.mainBackground.backgroundImage);
    }
    //load column bg
    if(VCC.background.columnBackground.backgroundImage !== "" && VCC.background.columnBackground.backgroundImage !== undefined) {
        graphics['gameColumnBackground'] = loadImage(VCC.background.columnBackground.backgroundImage);
    }
    //load bottom bar
    if(VCC.bottomBar.backgroundImage !== "" && VCC.bottomBar.backgroundImage !== undefined) {
        graphics['bottomBar'] = loadImage(VCC.bottomBar.backgroundImage);
    }
    //load buttons
    graphics['backButton'] = loadImage(VCC.topBar.backbutton.image);
    graphics['soundButton'] = {};
    graphics['soundButton']['off'] = loadImage(VCC.topBar.soundButton.muteImage);
    graphics['soundButton']['on'] = loadImage(VCC.topBar.soundButton.unmuteImage);
}

//This function runs once after the app is loaded
function setup() {
    //Set our canvas size to full window size
    width = window.innerWidth;
    height = window.innerHeight;
    createCanvas(width, height);
    loaded = false;
    //load sounds
    VCC = Koji.config.sounds;
	if(soundController !== null) {
		soundController.mute();
	}
    soundController = new SoundController();
    //load click
    if(VCC.itemClick !== "" && VCC.itemClick !== undefined) {
        soundController.data.sounds[0] = loadSound(VCC.itemClick, () => {loadCount -=1;});
        loadCount += 1;
    }
    //load pass
    if(VCC.roundPassed !== "" && VCC.roundPassed !== undefined) {
        soundController.data.sounds[1] = loadSound(VCC.roundPassed, () => {loadCount -=1;});
        loadCount += 1;
    }
    //load fail
    if(VCC.fail !== "" && VCC.fail !== undefined) {
        soundController.data.sounds[2] = loadSound(VCC.fail, () => {loadCount -=1;});
        loadCount += 1;
    }
    //load music
    if(VCC.gameMusic !== "" && VCC.gameMusic !== undefined) {
        soundController.data.music = loadSound(VCC.gameMusic, () => {loadCount -=1;});
        loadCount += 1;
    }
    
    let items = [];
    for(var i in graphics['items']) {
        items.push(parseInt(i));
    }
    let barHeight = height * .1;
    let gridCols = Koji.config.gameSettings.gridCols;
    let gridRows = Koji.config.gameSettings.gridRows;
    levelFactory = new LevelFactory(items,gridRows,gridCols);
    let level = levelFactory.buildRandomLevel();
    let maxRound = Koji.config.gameSettings.roundCount;
    let timer = Koji.config.gameSettings.maxTime;
    let columnWidth = Math.min(800,width);
    let columnSpacing = (width - columnWidth)/2;
    topBar = new TopBar([columnSpacing,0],[columnWidth,height*.1],maxRound,timer);
    gameGrid = new GameGrid([columnSpacing,barHeight],[columnWidth,height*.8],level,refreshLevel);
    bottomBar = new BottomBar(level[1],[columnSpacing,height*.9],[columnWidth,height*.1]);
	//soundController.mute();
	//soundController.toggleMute();
    particleController = new ParticlePool();
}

function refreshLevel(passed) {
    if(passed) {
        soundController.playSound(1);
        topBar.currentRound += 1;
        if(parseInt(topBar.currentRound) > parseInt(Koji.config.gameSettings.roundCount)) {
			soundController.mute();
            submitScore(Math.round(topBar.timer*100));
        }
    }
    else {
        soundController.playSound(2);
    }
    width = window.innerWidth;
    height = window.innerHeight;
    let barHeight = height * .1;
    let level = levelFactory.buildRandomLevel();
    let columnWidth = Math.min(800,width);
    let columnSpacing = (width - columnWidth)/2;
    gameGrid = new GameGrid([columnSpacing,barHeight],[columnWidth,height*.8],level,refreshLevel);
    bottomBar = new BottomBar(level[1],[columnSpacing,height*.9],[columnWidth,height*.1]);
}

function draw() {
    textFont('Roboto');
    if(loadCount > 0) {
        clear();
        push();
        background(20);
        fill(250);
        textSize(32);
        textAlign(CENTER,CENTER);
        text("Loading...",width/2,height/2);
        pop();
    }
    else {
        if(!loaded) {
            soundController.mute();
            soundController.toggleMute();
            loaded = true;
        }
        const VCC = Koji.config.game;
        clear();
        //draw page bg
        push();
        fill(VCC.background.mainBackground.backgroundColor);
        rect(0,0,width,height);
        if('gamePageBackground' in graphics) {
            let img = graphics['gamePageBackground'];
            image(img,0,0,width,height);
        }
        pop();
        //draw column bg
        push();
        let columnWidth = Math.min(800,width);
        let columnSpacing = width - columnSpacing / 2;
        fill(VCC.background.columnBackground.backgroundColor);
        rect(columnSpacing,0,columnWidth,height);
        if('gameColumnBackground' in graphics) {
            let img = graphics['gameColumnBackground'];
            image(img,columnSpacing,0,columnWidth,height);
        }
        pop();
        topBar.update();
        topBar.render();
        push();
        if(shakeCount > 0) {
            shakeCount -= 1;
            let shakeAngle = Math.floor(random(360));
            let shakeStrength = random(10);
            angleMode(DEGREES);
            translate(shakeStrength*sin(shakeAngle),shakeStrength*cos(shakeAngle));
        }
        gameGrid.render();
        gameGrid.update();
        pop();
        bottomBar.render();
        bottomBar.update();
        gameGrid.handleHover()
        topBar.handleHover();
        particleController.update();
        particleController.render();
        if(topBar.timer == 0) {
            submitScore(0);
        }
    }
}

function mouseReleased() {
    gameGrid.handleClick();
    topBar.handleClick();
}

//Takes the player to the "setScore" view for submitting the score to leaderboard
//Notice that it makes use of the "score" variable. You can change this if you wish.
function submitScore(score) {
    window.setScore(Math.round(score));
    window.setAppView("setScore");
}