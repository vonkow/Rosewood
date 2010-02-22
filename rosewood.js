//////// TO-DO ////////
// Integrate good parts of old rw, bring back rw.state?
// finish implementing keyChangeSprite for less ent sprite code, also, rename to keyChange
// Function for setting/unsetting used keys
// Add Inactive function for ents

// The Rosewood Object
var rw = {}; 
// RunLoop or stop
rw.runGame = false; 
// RunLoop current Timer
rw.curT = 0; 
// RunLoop global Timer
rw.globT = 0; 
// Golbal gameboard dimensions
rw.Xdim = 0;
rw.Ydim = 0;
// Inline function call function
rw.func = function() {
	return this;
}
// Game speed settings
rw.speed = 50;
rw.setFPS = function(fps) {
	rw.speed = 1000/parseInt(fps);
}
// Tile settings
rw.tiles = false;
rw.tileX = 0;
rw.tileY = 0;
rw.tilesOn = function(xDim, yDim) {
	rw.tiles = true;
	rw.tileX = xDim;
	rw.tileY = yDim;
	return this;
}
rw.tilesOff = function() {
	rw.tiles = false;
	rw.tileX = 0;
	rw.tileY = 0;
	return this;
}
//KeyDown/Up settings
// Obviously not done
rw.keyChange = false; 
rw.keys = {
	sp: false,
	la: false,
	ua: false,
	ra: false,
	da: false
};
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
// Mouse Position settings
rw.mouse = {
	x: 0,
	y: 0,
	down : false
};
rw.mousePos = function(e) {
	if (!e) {
		// THIS IS WHY WE CAN'T HAVE PRETTY THINGS IE!!!
		var e = window.event;
		rw.mouse.x = e.clientX+(document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
		rw.mouse.y = e.clientY+(document.documentElement.scrollRight ? document.documentElement.scrollRight : document.body.scrollRight);
	} else {
		rw.mouse.x = e.pageX;
		rw.mouse.y = e.pageY;
	}
	// OLD METHOD, LEAVE TIL TESTED ON IE
	//rw.mouse.x = (e) ? e.pageX : window.event.clientX+(document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft); 
	//rw.mouse.y = (e) ? e.pageY : window.event.clientY+(document.documentElement.scrollRight ? document.documentElement.scrollRight : document.body.scrollRight); 
}
rw.mouseDown = function(e) {
	if (!e) var e = window.event;
	rw.mouse.down = true;
}
rw.mouseUp = function(e) {
	if (!e) var e = window.event;
	rw.mouse.down = false;

}
// Game Entities
rw.ents = []; 
rw.ent = function(name, typeClass, sprites, spriteExt, width, height) {
	this.name = name;
	this.typeClass = typeClass;
	this.sprites = sprites;
	this.spriteExt = spriteExt
	this.width = width;
	this.height = height;
	this.posX = 0;
	this.posY = 0;
	this.posZ = 0;
	this.posX1 = function() {
		return this.posX;
	}
	this.posY1 = function() {
		return this.posY;
	}
	this.posX2 = function() {
		return this.posX+this.width;
	}
	this.posY2 = function() {
		return this.posY+this.height;
	}
	this.velX = 0;
	this.velY = 0;
	this.velZ = 0;
	this.tileX = 0;
	this.tileY = 0;
	this.active = false; //Bool for is piece in play
	// Display Entity Function, sets ent.base.active to true
	this.display = function (graphic) {
		var newEnt = document.createElement('div');
		newEnt.id = 'ent_'+this.name;
		newEnt.style.width = this.width;
		newEnt.style.height = this.height;
		if (graphic!='blank') {
			newEnt.style.backgroundImage = "url('sprites/"+this.sprites+"/"+graphic+"."+this.spriteExt+"')";
		}
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
	this.tilePos = function() {
		this.tileX = Math.floor(this.posX/rw.tileX);
		this.tileY = Math.floor(this.posY/rw.tileY);
	}
}
rw.newEnt = function(ent, display, posX, posY, posZ) {
	var curLength = rw.ents.length;
	rw.ents[curLength] = ent;
	if (display!=false) {
		rw.ents[curLength].base.posX = posX;
		rw.ents[curLength].base.posY = posY;
		rw.ents[curLength].base.posZ = posZ;
		rw.ents[curLength].base.display(display);
	}
	return this;
}
rw.removeEnt = function(entNum) {
	rw.ents.splice(entNum, 1);
	return this;
}
// Map Entities
rw.maps = {}; 
rw.map = function(name, path, extention, xDim, yDim) {
	this.name = name;
	this.path = path;
	this.extention = extention
	this.width = xDim;
	this.height = yDim;
	this.offX = 0;
	this.offY = 0;
	this.offset = function(oX, oY) {
		if (document.getElementById('map_'+this.name)) {
			var mapDiv = document.getElementById('map_'+this.name);
			this.offX += oX;
			this.offY += oY;
			mapDiv.style.marginLeft = this.offX+'px';
			mapDiv.style.marginTop = this.offY+'px';
		}
	}
	this.show = function() {
		if (document.getElementById('map_'+this.name)) {
			var mapDiv = document.getElementById('map_'+this.name);
			mapDiv.style.zIndex = '-1';
			mapDiv.style.display = 'block';
		} else {
			this.render();
		}
	}
	this.hide = function() {
		if (document.getElementById('map_'+this.name)) {
			var mapDiv = document.getElementById('map_'+this.name);
			mapDiv.style.display = 'none';
		}
	}
	this.render = function() {
		if (document.getElementById('map_'+this.name)) {
			this.show();
		} else {
			var mapArea = document.createElement('div');
			mapArea.id = 'map_'+this.name;
			mapArea.style.backgroundImage = "url('sprites/maps/"+this.path+"/"+this.path+"."+this.extention+"')";
			mapArea.style.width = this.width+'px';
			mapArea.style.height = this.height+'px';
			mapArea.style.overflow = 'hidden';
			mapArea.style.zIndex = -1;
			mapArea.style.marginLeft = this.offX+'px';
			mapArea.style.marginTop = this.offY+'px';
			var board = document.getElementById('board');
			board.appendChild(mapArea);
		}
	}
	this.remove = function() {
		if (document.getElementById('map_'+this.name)) {
			var mapArea = document.getElementById('map_'+this.name);
			mapArea.parentNode.removeChild(mapArea);
		}
	}

}
rw.newMap = function(name, map, ext, dimX, dimY, render) {
	rw.maps[name] = new rw.map(map, map, ext, dimX, dimY);
	if (render==true) {
		rw.maps[name].render();
	}
	return this;
}
rw.removeMap = function(map) {
	if (rw.maps[map]) {
		delete rw.maps[map];
		return true;
	} else {
		return false;
	}
	return this;
}
// Rule Entities
rw.rules = {};
rw.rule = function(active) {
	this.active = active;
}
rw.newRule = function(name, rule) {
	rw.rules[name] = rule;
	return this;
}
rw.removeRule = function(rule) {
	if (rw.rules[rule]) {
		delete rw.rules[rule];
		return true;
	} else {
		return false;
	}
	return this;
}
// Ajax function, durr
rw.ajax = function(targ, func) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET",targ,true);
	xhr.overrideMimeType("application/json");
	xhr.onreadystatechange = function() {
		if (xhr.readyState==4) {
			var resp = eval('('+xhr.responseText+')');
			eval(func+'(resp)');
		}
	}
	xhr.send(null);
}
// Image pre-loader
rw.preImg = new Image();
rw.using = function(path, ext, imgArray) {
	var len = imgArray.length;
	for (var x=0; x<len;x++) {
		rw.preImg.src = 'sprites/'+path+'/'+imgArray[x]+'.'+ext;
	}
	rw.preImg.src = '';
	return this;
}
// Changes Cursor
rw.changeCursor = function(cursor) {
	document.getElementById('board').style.cursor="url(sprites/"+cursor+"), wait";
	return this;
}
// Wipe Functions
// Removes all children of the board
rw.wipeBoard = function() {
	var board = document.getElementById('board');
	var total = board.childNodes.length;
	for (var x=0; x<total; x++) {
		board.removeChild(board.childNodes[0]);
	}
	return this;
}
rw.wipeEnts = function() {
	rw.ents = [];
	return this;
}
rw.wipeMaps = function() {
	rw.maps = {};
	return this;
}
rw.wipeRules = function() {
	rw.rules = {};
	return this;
}
rw.wipeAll = function() {
	rw.wipeBoard().wipeEnts().wipeMaps().wipeRules();
	return this;
}
// Initilization Function
rw.init = function(dimX, dimY) {
	var board = document.createElement('div');
	board.id = 'board';
	this.Xdim = dimX;
	this.Ydim = dimY;
	board.style.width = dimX+'px';
	board.style.height = dimY+'px';
	board.style.overflow = 'hidden';
	board.style.border = '1px solid black';
	document.getElementsByTagName('body')[0].appendChild(board);
	document.onmousemove = rw.mousePos;
	document.onmousedown = rw.mouseDown;
	document.onmouseup = rw.mouseUp;
	document.onkeydown=rw.keyDown;
	document.onkeyup=rw.keyUp;
	return this;
}
// Start FUnction
rw.start = function() {
	rw.runGame = true;
	rw.curT = setTimeout('rw.run()', this.speed);
	return this;
}
// Stop Function
rw.stop = function() {
	clearTimeout(rw.curT);
	rw.globT = rw.globT+rw.curT;
	rw.curT = 0;
	rw.runGame = false;
	return this;
}
// RunLoop Function
rw.run = function() {
	// Update all sprites and remove those that are "dead"
	// FIX THIS SO IT'S LESS REPETITIVE CODE
	if (rw.tiles==true) {
		if (rw.keyChange==true) {
			for (var x=0; x<rw.ents.length; x++) {
				if (rw.ents[x].base.active==true) {
					rw.ents[x].base.tilePos();
					if (rw.ents[x].keyChangeSprite) {
						rw.ents[x].keyChangeSprite();
					}
					var currentSprite = rw.ents[x].update(rw.ents[x].base.posX1(), rw.ents[x].base.posX2(), rw.ents[x].base.posY1(), rw.ents[x].base.posY2());
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
					rw.ents[x].base.tilePos();
					var currentSprite = rw.ents[x].update(rw.ents[x].base.posX1(), rw.ents[x].base.posX2(), rw.ents[x].base.posY1(), rw.ents[x].base.posY2());
					if (currentSprite==false) {
						rw.removeEnt(x);
						x--;
					} else {
						//Nothing for now
					}
				}
			}
		}
	} else {
		if (rw.keyChange==true) {
			for (var x=0; x<rw.ents.length; x++) {
				if (rw.ents[x].base.active==true) {
					if (rw.ents[x].keyChangeSprite) {
						rw.ents[x].keyChangeSprite();
					}
					var currentSprite = rw.ents[x].update(rw.ents[x].base.posX1(), rw.ents[x].base.posX2(), rw.ents[x].base.posY1(), rw.ents[x].base.posY2());
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
					var currentSprite = rw.ents[x].update(rw.ents[x].base.posX1(), rw.ents[x].base.posX2(), rw.ents[x].base.posY1(), rw.ents[x].base.posY2());
					if (currentSprite==false) {
						rw.removeEnt(x);
						x--;
					} else {
						//Nothing for now
					}
				}
			}
		}
	}
	// Check collisions
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
			var killThese = [];
			o:for(var x=0; x<toBeRemoved.length; x++) {
	  			for(var y=0; y<killThese.length; y++) {
					if (killThese[y]==toBeRemoved[x]) {
						continue o;
					}
				}
				killThese[killThese.length] = toBeRemoved[x];
			}
			for (var x=0;x<killThese.length;x++) {
				rw.removeEnt(killThese[x]);
			}
		}
	}
	// Run Through all rules;
	for (var x in rw.rules) {
		if (rw.rules[x].base.active==true) {
			rw.rules[x].rule();
		}
	}
	// Run Through all ents and update position
	for (var x=0; x<rw.ents.length; x++) {
		if (rw.ents[x].base.active==true) {
			rw.ents[x].base.posX += rw.ents[x].base.velX;
			rw.ents[x].base.posY += rw.ents[x].base.velY;
			rw.ents[x].base.posZ += rw.ents[x].base.velZ;
			var entDiv = document.getElementById('ent_'+rw.ents[x].base.name);
			entDiv.style.left = rw.ents[x].base.posX+'px';
			entDiv.style.top = rw.ents[x].base.posY+'px';
			entDiv.style.zIndex = rw.ents[x].base.posZ;
		}
	}
	//If game has not ended or been paused, continue
	if (rw.runGame==true) {
		rw.start();
	} else {
		rw.stop();
	}
}
