//////// TO-DO ////////
// Preload Images while showing user defined load screen
// Collision detection!!! (and the Ob class...)
// Make Boards (worlds) a class
// Sound support?
// Integrate good parts of old rw, bring back rw.state?
// Move all DOM utils to pussycat
// keyChangeSprite mostly implemented, implement sigChangeSprite


var rw = {}; // The Rosewood Object


rw.ents = []; // Game Entities
rw.maps = []; // Map Entities
rw.curT = 0; // RunLoop current Timer
rw.globT = 0; // RunLoop global Timer
rw.runGame = true; // RunLoop or stop
rw.keyChange = false; //Did a keydown/up change between the last loop and now?
rw.keys = {};
rw.keys.la = false;
rw.keys.ua = false;
rw.keys.ra = false;
rw.keys.da = false;

rw.keyDown = function(e) {
	var ev = e ? e : window.event;
	switch(ev.keyCode) {
		case 37:
			rw.keys.la = true;
			break;
		case 38:
			rw.keys.ua = true;
			break;
		case 39:
			rw.keys.ra = true;
			break;
		case 40:
			rw.keys.da = true;
			break;
	}
	rw.keyChange = true;
}
rw.keyUp = function(e) {
	var ev = e ? e : window.event;
	switch(ev.keyCode) {
		case 37:
			rw.keys.la = false;
			break;
		case 38:
			rw.keys.ua = false;
			break;
		case 39:
			rw.keys.ra = false;
			break;
		case 40:
			rw.keys.da = false;
			break;
	}
	rw.keyChange = true;
}

// Keydown/up event listeners
document.onkeydown=rw.keyDown;
document.onkeyup=rw.keyUp;

// RunLoop Function
rw.run = function() {
	for(var x=0; x<rw.ents.length; x++) {
		var currentSprite = rw.ents[x].update();
		if (currentSprite==false) {
			killSprite(rw.ents[x]);
			x--;
		}
	}
	if (rw.keyChange==true) {
		// Loop through ents and change graphics
		for (var x=0; x<rw.ents.length; x++) {
			if (rw.ents[x].keyChangeSprite) {
				rw.ents[x].keyChangeSprite();
			}
		}
		rw.keyChange = false;
	}
	if (rw.runGame==true) {
		rw.start();
	}
	else {
		rw.stop();
	}
	//if (rw.curT==100) {
	//	rw.hideEnt(rw.ents[0]);
	//}
}

rw.start = function() {
	rw.curT = setTimeout('rw.run()', 50);
}

rw.stop = function() {
	clearTimeout(rw.curT);
	rw.globT = rw.globT+rw.curT;
	rw.curT = 0;
}

rw.board = function(name, path, extention, xDim, yDim) {
	this.name = name;
	this.path =path;
	this.extention = extention
	this.width = xDim;
	this.height = yDim;
}

rw.renderMap = function(map) {
	var gameArea = document.getElementById('rw');
	var mapArea = document.createElement('div');
	mapArea.id = 'map_'+map.board.name;
	mapArea.style.backgroundImage = "url('sprites/boards/"+map.board.path+"/"+map.board.path+"."+map.board.extention+"')";
	mapArea.style.width = map.board.width+'px';
	mapArea.style.height = map.board.height+'px';
	mapArea.style.zIndex = -1;
	gameArea.appendChild(mapArea);
}

// Game Entity Base Factory
rw.ent = function(name, sprites, spriteExt, width, height, heading) {
	this.name = name;
	this.sprites = sprites;
	this.spriteExt = spriteExt
	this.width = width;
	this.height = height;
	this.posX = 0;
	this.posY = 0;
	this.posZ = 0;
	this.heading = heading;
	this.moving = false;
	this.active = false; //Bool for is piece in play
}

// Display Entity Function, sets ent.base.active to true
rw.displayEnt = function(ent, locX, locY) {
	var newEnt = document.createElement('div');
	newEnt.id = 'ent_'+ent.base.name;
	newEnt.style.width = ent.base.width;
	newEnt.style.height = ent.base.height;
	newEnt.style.backgroundImage = "url('sprites/"+ent.base.sprites+"/"+ent.base.heading+"."+ent.base.spriteExt+"')";
	newEnt.style.backgroundRepeat = 'no-repeat';
	newEnt.style.backgroundPosition = 'center';
	newEnt.style.position = 'absolute';
	newEnt.style.left = locX+'px';
	newEnt.style.top = locY+'px';
	ent.base.posX = locX;
	ent.base.posY = locY;
	ent.base.active = true;
	document.getElementById('board').appendChild(newEnt);
}

rw.removeEnt = function(entNum) {
	rw.ents.splice(entNum, 1)
}

rw.hideEnt = function(ent) {
	if (document.getElementById('ent_'+ent.base.name)) {
		var dying = document.getElementById('ent_'+ent.base.name);
		dying.parentNode.removeChild(dying);
		ent.base.active=false;
	}
}


//////// NON RW FUNCTIONS ////////


// Custom Game Entity (calls rw.ent for this.base, requires this.update function)
var goon = function(name, heading) {
	this.base = new rw.ent(name, 'goon', 'gif', 38, 46, heading);
	this.maxSpeed = 2;
	this.update = function() {
		if (this.base.active==true) {
			var entDiv = document.getElementById('ent_'+name);
			if (rw.keys.la==true) {
				this.base.posX = this.base.posX-this.maxSpeed;
			}
			if (rw.keys.ra==true) {
				this.base.posX = this.base.posX+this.maxSpeed;
			}
			if (rw.keys.ua==true) {
				this.base.posY = this.base.posY-this.maxSpeed;
				this.base.posZ = this.base.posY;
			}
			if (rw.keys.da==true) {
				this.base.posY = this.base.posY+this.maxSpeed;
				this.base.posZ = this.base.posY;
			}
			entDiv.style.left = this.base.posX+'px';
			entDiv.style.top = this.base.posY+'px';
			entDiv.style.zIndex = this.base.posZ
		}
	}
	// Detach some of keyChangeSprite and move to engine core, this much code for each ent is unacceptable!
	this.keyChangeSprite = function() {
		if (this.base.active==true) {
			var entDiv = document.getElementById('ent_'+name);
			if (rw.keys.la==true) {
				this.base.heading = 'l';
				this.base.moving = true;
				entDiv.style.backgroundImage = "url('sprites/"+this.base.sprites+"/W"+this.base.heading+"."+this.base.spriteExt+"')";
			}
			else if (rw.keys.ua==true) {
				this.base.heading = 'u';
				this.base.moving = true;
				entDiv.style.backgroundImage = "url('sprites/"+this.base.sprites+"/W"+this.base.heading+"."+this.base.spriteExt+"')";
			}
			else if (rw.keys.ra==true) {
				this.base.heading = 'r';
				this.base.moving = true;
				entDiv.style.backgroundImage = "url('sprites/"+this.base.sprites+"/W"+this.base.heading+"."+this.base.spriteExt+"')";
			}
			else if (rw.keys.da==true) {
				this.base.heading = 'd';
				this.base.moving = true;
				entDiv.style.backgroundImage = "url('sprites/"+this.base.sprites+"/W"+this.base.heading+"."+this.base.spriteExt+"')";
			}
			else {
				this.base.moving = false;
				entDiv.style.backgroundImage = "url('sprites/"+this.base.sprites+"/"+this.base.heading+"."+this.base.spriteExt+"')";
			}
		}
	}
}

// Create new map function
function newMap() {
	
}

// Begin Game Function
function startGame() {
	var board = document.createElement('div');
	board.id = 'board';
	document.getElementsByTagName('body')[0].appendChild(board);
	rw.ents[rw.ents.length] = new goon('Goon0', 'u');
	rw.displayEnt(rw.ents[0], 50, 50);
	rw.ents[rw.ents.length] = new goon('Goon1', 'u');
	rw.displayEnt(rw.ents[1], 100, 100);
	rw.ents[rw.ents.length] = new goon('Goon2', 'u');
	rw.displayEnt(rw.ents[2], 150, 150);
	rw.ents[rw.ents.length] = new goon('Goon3', 'u');
	rw.displayEnt(rw.ents[3], 200, 200);
	rw.ents[rw.ents.length] = new goon('Goon4', 'u');
	rw.displayEnt(rw.ents[4], 250, 250);
	rw.start();
}