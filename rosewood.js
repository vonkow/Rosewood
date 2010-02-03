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

// The Rosewood Object
var rw = {}; 
// Game Entities
rw.ents = []; 
// Map Entities
rw.maps = []; 
// Rule Entities
rw.rules = {};
// RunLoop current Timer
rw.curT = 0; 
// RunLoop global Timer
rw.globT = 0; 
// RunLoop or stop
rw.runGame = true; 
//Did a keydown/up change between the last loop and now?
rw.keyChange = false; 

rw.keys = {
	sp: false,
	la: false,
	ua: false,
	ra: false,
	da: false
};

rw.mouse = {
	x: 0,
	y: 0
};

rw.init = function(dimX, dimY) {
	var board = document.createElement('div');
	board.id = 'board';
	board.style.width = dimX+'px';
	board.style.height = dimY+'px';
	board.style.border = '1px solid black';
	document.getElementsByTagName('body')[0].appendChild(board);
	// Mousemove object, maybe eval during runloop and not onmousemve
	document.onmousemove = rw.mousePos;
	// Keydown/up event listeners
	document.onkeydown=rw.keyDown;
	document.onkeyup=rw.keyUp;
	// This hides the mouse, set as option
	document.getElementsByTagName('body')[0].style.cursor="url(sprites/blank.cur), wait";
}

rw.mousePos = function(e) {
	// THIS IS WHY WE CAN'T HAVE PRETTY THINGS IE!!!
	rw.mouse.x = (e) ? e.pageX : window.event.clientX+(document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft); 
	rw.mouse.y = (e) ? e.pageY : window.event.clientY+(document.documentElement.scrollRight ? document.documentElement.scrollRight : document.body.scrollRight); 
}



// Key Down and Up triggers
// NEEDS FLESHING OUT
rw.keyDown = function(e) {
	var ev = e ? e : window.event;
	switch(ev.keyCode) {
		case 32:
			rw.keys.sp = true;
			break;
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
		case 32:
			rw.keys.sp = false;
			break;
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

// RunLoop Function
rw.run = function() {
	// Update all sprites and remove those that are "dead"

	if (rw.keyChange==true) {
		// Loop through ents and change graphics
		for (var x=0; x<rw.ents.length; x++) {
			if (rw.ents[x].base.active==true) {
				if (rw.ents[x].keyChangeSprite) {
					rw.ents[x].keyChangeSprite();
				}
				var currentSprite = rw.ents[x].update();
				if (currentSprite==false) {
					rw.removeEnt(x);
					x--;
				} else {
					//Nothing for now
				}
			}

		}
		rw.keyChange = false;
	} else {
		for(var x=0; x<rw.ents.length; x++) {
			if (rw.ents[x].base.active==true) {
				var currentSprite = rw.ents[x].update();
				if (currentSprite==false) {
					rw.removeEnt(x);
					x--;
				} else {
					//Nothing for now
				}
			}
		}
	}
	rw.colCheck();
	// Run Through all rules;
	for (var x in rw.rules) {
		if (rw.rules[x].base.active==true) {
			rw.rules[x].rule();
		}
	}
	//If game has not ended or been paused, continue
	if (rw.runGame==true) {
		rw.start();
	} else {
		rw.stop();
	}
}

rw.speed = 25;
rw.start = function() {
	rw.curT = setTimeout('rw.run()', this.speed);
}

rw.stop = function() {
	clearTimeout(rw.curT);
	rw.globT = rw.globT+rw.curT;
	rw.curT = 0;
}

rw.rule = function(active) {
	this.active = active;
}

rw.removeRule = function(rule) {
	if (rw.rules[rule]) {
		delete rw.rules[rule];
		return true;
	} else {
		return false;
	}
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
rw.ent = function(name, typeClass, sprites, spriteExt, width, height, heading) {
	this.name = name;
	this.typeClass = typeClass;
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

rw.newEnt = function(ent, display, posX, posY) {
	var curLength = rw.ents.length;
	rw.ents[curLength] = ent;
	if (display==true) {
		rw.ents[curLength].base.posX = posX;
		rw.ents[curLength].base.posY = posY;
		rw.ents[curLength].base.display();
	}
}

rw.removeEnt = function(entNum) {
	rw.ents.splice(entNum, 1)
}

//THIS IS THE NEW COLLISION DETECTION FUNCTION!!!
rw.colCheck = function() {
	var len = rw.ents.length;
	var cols = [];
	// For each ent
	for (var x=0;x<len;x++) {
		// For each ent above this ent, check collisions
		for (var y=x+1;y<len;y++) {
			var hit = true;
			// Left Check
			if (rw.ents[x].base.posX+rw.ents[x].base.width<=rw.ents[y].base.posX) {
				hit = false;
			}
			// Right Check
			if (rw.ents[x].base.posX>=rw.ents[y].base.posX+rw.ents[y].base.width) {
				hit = false;
			}
			// Top Check
			if (rw.ents[x].base.posY+rw.ents[x].base.height<=rw.ents[y].base.posY) {
				hit = false;
			}
			// Bottom Check
			if (rw.ents[x].base.posY>=rw.ents[y].base.posY+rw.ents[y].base.height) {
				hit = false;
			}
			// If collision, add to list.
			if (hit==true) {
				// Maybe change this to call a collision resolution function for each ent?
				cols[cols.length]=[x,y];
			}
		}
	}
	if (cols.length>0) {
		var toBeRemoved = [];
		for (var x=0; x<cols.length; x++) {
			hit0 = true;
			hit1 = true;
			if (rw.ents[cols[x][0]].iGotHit) {
				hit0 = rw.ents[cols[x][0]].iGotHit(rw.ents[cols[x][1]].base.typeClass);
			}
			if (rw.ents[cols[x][1]].iGotHit) {
				hit1 = rw.ents[cols[x][1]].iGotHit(rw.ents[cols[x][0]].base.typeClass);
			}
			if (hit0==false) {
				toBeRemoved[toBeRemoved.length] = cols[x][0];
			}
			if (hit1==false) {
				toBeRemoved[toBeRemoved.length] = cols[x][1];
			}
		}
		if (toBeRemoved.length>0) {
			toBeRemoved.sort(function(a,b){return a - b});
			toBeRemoved.reverse();
			for (var x=0;x<toBeRemoved.length;x++) {
				rw.ents[toBeRemoved[x]].base.hide();
				rw.removeEnt(toBeRemoved[x]);
			}
		}
	}
}
