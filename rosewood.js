//////// TO-DO ////////
// Preload Images while showing user defined load screen
// Sound support?
// Integrate good parts of old rw, bring back rw.state?
// Move all DOM utils to pussycat
// keyChangeSprite mostly implemented, implement sigChangeSprite
// Change rw.checkBounds(ent, direction) to ent.base.checkBounds(self, direction)
// Fix rw.checkBounds() so that ents stop EXACTLY at the border of a bar.
// Finish implementing maps and add function for scrolling
// Create standardized functions for swapping a sprit image onKeyChange

var rw = {}; // The Rosewood Object


rw.ents = []; // Game Entities
rw.bars = []; // Barrier Entitles
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
rw.mouse = {};
rw.mouse.x = 0;
rw.mouse.y = 0;

rw.init = function() {
	// Mousemove object, maybe eval during runloop and not onmousemve
	document.onmousemove = rw.mousePos;
	// Keydown/up event listeners
	document.onkeydown=rw.keyDown;
	document.onkeyup=rw.keyUp;
}

rw.mousePos = function(e) {
	rw.mouse.x = (e) ? e.pageX : window.event.clientX+(document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft); // THIS IS WHY WE CAN'T HAVE PRETTY THINGS IE!!!
	rw.mouse.y = (e) ? e.pageY : window.event.clientY+(document.documentElement.scrollRight ? document.documentElement.scrollRight : document.body.scrollRight); // THIS IS WHY WE CAN'T HAVE PRETTY THINGS IE!!!
}



// Key Down and Up triggers
// NEEDS FLESHING OUT
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
	// Update all sprites and remove those that are "dead"

	if (rw.keyChange==true) {
		// Loop through ents and change graphics
		for (var x=0; x<rw.ents.length; x++) {
			if (rw.ents[x].keyChangeSprite) {
				rw.ents[x].keyChangeSprite();
			}
			var currentSprite = rw.ents[x].update();
			if (currentSprite==false) {
				killSprite(rw.ents[x]);
				x--;
			}
			else {
				rw.checkBounds(rw.ents[x]);
			}

		}
		rw.keyChange = false;
	}
	else {
		for(var x=0; x<rw.ents.length; x++) {
			var currentSprite = rw.ents[x].update();
			if (currentSprite==false) {
				killSprite(rw.ents[x]);
				x--;
			}
			else {
				//rw.checkBounds(rw.ents[x]);
			}
		}
	}
	//If game has not ended or been paused, continue
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
	this.path = path;
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
	this.velX = 0;
	this.velY = 0;
	this.velZ = 0;
	this.heading = heading;
	this.moving = false;
	this.active = false; //Bool for is piece in play
	// Display Entity Function, sets ent.base.active to true
	this.display = function () {
		var newEnt = document.createElement('div');
		newEnt.id = 'ent_'+this.name;
		newEnt.style.width = this.width;
		newEnt.style.height = this.height;
		newEnt.style.backgroundImage = "url('sprites/"+this.sprites+"/"+this.heading+"."+this.spriteExt+"')";
		newEnt.style.backgroundRepeat = 'no-repeat';
		newEnt.style.backgroundPosition = 'center';
		newEnt.style.position = 'absolute';
		newEnt.style.left = this.posX+'px';
		newEnt.style.top = this.posY+'px';
		this.active = true;
		document.getElementById('board').appendChild(newEnt);
	}
	this.hide = function() {
		if (document.getElementById('ent_'+this.name)) {
			var dying = document.getElementById('ent_'+this.name);
			dying.parentNode.removeChild(dying);
			this.active=false;
		}
	}
	this.changeSprite = function(spriteName) {
		var entDiv = document.getElementById('ent_'+this.name);
		if (entDiv) {
			entDiv.style.backgroundImage = "url('sprites/"+this.sprites+"/"+spriteName+"."+this.spriteExt+"')";
		}
	}
}

rw.removeEnt = function(entNum) {
	rw.ents.splice(entNum, 1)
}


// Barrier Generator
rw.bar = function(shape, x1, y1, x2, y2, level) {
	this.shape = shape;
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.level = level;
}


rw.checkBounds = function(ent, direction) {
	var hit = true;
	var len = rw.bars.length;
	for (var x=0; x<len; x++) {
		if (ent.base.posX+ent.base.width+ent.base.velX<rw.bars[x].x1) {
			hit = false;
		}
		if (ent.base.posX+ent.base.velX>rw.bars[x].x2) {
			hit = false;
		}
		if (ent.base.posY+ent.base.height+ent.base.velY<rw.bars[x].y1) {
			hit = false;
		}
		if (ent.base.posY+ent.base.velY>rw.bars[x].y2) {
			hit = false;
		}
	}
	if (hit==true) {
		//See if we can make a flag for each movestate, that can be triggered by keydowns or other signals
		// This method only works at slow speeds: an ent with velX of 50 and a distance of 49 to a bar will be stopped 49 away
		switch (direction) {
			case 'u':
				ent.base.velY = 0;
				break;
			case 'd':
				ent.base.velY = 0;
				break;
			case 'l':
				ent.base.velX = 0;
				break;
			case 'r':
				ent.base.velX = 0;
				break;
		}	
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
			this.base.velX = 0;
			this.base.velY = 0;
			if (rw.keys.la==true) {
				this.base.velX += -this.maxSpeed;
				rw.checkBounds(this, 'l');
			}
			if (rw.keys.ra==true) {
				this.base.velX += this.maxSpeed;
				rw.checkBounds(this, 'r');
			}
			if (rw.keys.ua==true) {
				this.base.velY += -this.maxSpeed;
				rw.checkBounds(this, 'u');
			}
			if (rw.keys.da==true) {
				this.base.velY += this.maxSpeed;
				rw.checkBounds(this, 'd');
			}
			this.base.posX = this.base.posX+this.base.velX;
			this.base.posY = this.base.posY+this.base.velY;
			//For Now
			this.base.posZ = this.base.posY;
			entDiv.style.left = this.base.posX+'px';
			entDiv.style.top = this.base.posY+'px';
			entDiv.style.zIndex = this.base.posZ
		}
	}
	// THis will be the funct that calls the new this.base.changeSprite();
	// heading and moving will possible be split into seperate functions
	// This even brings up the fact that heading and moving may not be part of this.base
	// Detach some of keyChangeSprite and move to engine core, this much code for each ent is unacceptable!
	// Fix logic of displaying non-moving sprites
	this.keyChangeSprite = function() {
		if (this.base.active==true) {
			var entDiv = document.getElementById('ent_'+name);
			if (rw.keys.la==true) {
				this.base.heading = 'l';
				this.base.moving = true;
				this.base.changeSprite('Wl');
			}
			else if (rw.keys.ua==true) {
				this.base.heading = 'u';
				this.base.moving = true;
				this.base.changeSprite('Wu');
			}
			else if (rw.keys.ra==true) {
				this.base.heading = 'r';
				this.base.moving = true;
				this.base.changeSprite('Wr');
			}
			else if (rw.keys.da==true) {
				this.base.heading = 'd';
				this.base.moving = true;
				this.base.changeSprite('Wd');
			}
			else {
				this.base.moving = false;
				this.base.changeSprite(this.base.heading);
			}
		}
	}
}

// Create new map function
function newMap() {
	
}

// Begin Game Function
function startGame() {
	rw.init();
	var board = document.createElement('div');
	board.id = 'board';
	board.style.width='600px';
	board.style.height='300px';
	document.getElementsByTagName('body')[0].appendChild(board);
	// Move cursor hiding logic to rw.init()
	document.getElementsByTagName('body')[0].style.cursor="url(sprites/blank.cur), wait";
	rw.ents[rw.ents.length] = new goon('Goon0', 'u');
	//rw.displayEnt(rw.ents[0], 50, 50);
	rw.ents[0].base.posX = 50;
	rw.ents[0].base.posY = 50;
	rw.ents[0].base.display();
//	rw.ents[rw.ents.length] = new goon('Goon1', 'u');
//	rw.displayEnt(rw.ents[1], 100, 100);
//	rw.ents[rw.ents.length] = new goon('Goon2', 'u');
//	rw.displayEnt(rw.ents[2], 150, 150);
//	rw.ents[rw.ents.length] = new goon('Goon3', 'u');
//	rw.displayEnt(rw.ents[3], 200, 200);
//	rw.ents[rw.ents.length] = new goon('Goon4', 'u');
//	rw.displayEnt(rw.ents[4], 250, 250);
	rw.bars[rw.bars.length] = new rw.bar('r', 300, 300, 350, 350, 1)
	rw.start();
}
