//////// TO-DO ////////
// Integrate good parts of old rw, bring back rw.state?
// finish implementing keyChangeSprite for less ent sprite code, also, rename to keyChange
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
rw.keyChange = false; 
rw.keys = {};
rw.keySwitch = function(code, bit) {
	var keyArray = [['bsp',8],['tab',9],['ent',13],['shf',16],['ctr',17],['alt',18],['pau',19],['cap',20],['esc',27],['sp',32],['pgu',33],['pgd',34],['end',35],['hom',36],['la',37],['ua',38],['ra',39],['da',40],['ins',45],['del',46],['d0',48],['d1',49],['d2',50],['d3',51],['d4',52],['d5',53],['d6',54],['d7',55],['d8',56],['d9',57],['sem',59],['eql',61],['a',65],['b',66],['c',67],['d',68],['e',69],['f',70],['g',71],['h',72],['i',73],['j',74],['k',75],['l',76],['m',77],['n',78],['o',79],['p',80],['q',81],['r',82],['s',83],['t',84],['u',85],['v',86],['w',67],['x',88],['y',89],['z',90],['lwn',91],['rwn',92],['sel',93],['n0',96],['n1',97],['n2',98],['n3',99],['n4',100],['n5',101],['n6',102],['n7',103],['n8',104],['n9',105],['mul',106],['add',107],['sub',109],['dec',110],['div',111],['f1',112],['f2',113],['f3',114],['f4',115],['f5',116],['f6',117],['f7',118],['f8',119],['f9',120],['f10',121],['f11',122],['f12',123],['num',144],['scr',145],['com',188],['per',190],['fsl',191],['acc',192],['obr',219],['bsl',220],['cbr',221],['qot',222]];
	var len = keyArray.length;
	for (var x=0;x<len;x++) {
		if (keyArray[x][1]==code) {
			if (bit) {
				rw.keys[keyArray[x][0]] = true;
			} else {
				rw.keys[keyArray[x][0]] = false;
			}
		}
	}
}
rw.keyDown = function(e) {
	var ev = e ? e : window.event;
	rw.keySwitch(ev.keyCode, true);
	rw.keyChange = true;
}
rw.keyUp = function(e) {
	var ev = e ? e : window.event;
	rw.keySwitch(ev.keyCode, false);
	rw.keyChange = true;
}
rw.keyCheck = function(key) {
	if (rw.keys[key]) {
		return true;
	} else {
		return false;
	}
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
	this.rotate = function(deg) {
		var entDiv = document.getElementById('ent_'+this.name);
		if (entDiv) {
			entDiv.style[rw.browser.trans_name] = 'rotate('+deg+'deg)';
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
// Object and Ent Library, helper functions
rw.lib = {
	ent : function(name, type, xDim, yDim) {
		this.base = new rw.ent(name, type, ' ', ' ', xDim, yDim);
		this.hitMap = [[0,0,xDim,yDim,type]];
		this.update = function(){};
		this.iGotHit = function(){};
	}
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
	return this;
}
// Inline function call function
rw.func = function() {
	return this;
}
//Maybe Fixed now?
// Image pre-loader
rw.preImg = [];
rw.using = function(path, ext, imgArray) {
	var len = imgArray.length;
	for (var x=0; x<len;x++) {
		rw.preImg[rw.preImg.length] = new Image();
		rw.preImg[rw.preImg.length-1].src = 'sprites/'+path+'/'+imgArray[x]+'.'+ext;
	}
	return this;
}
// Changes Cursor
rw.changeCursor = function(cursor) {
	document.getElementById('board').style.cursor="url(sprites/"+cursor+"), wait";
	return this;
}
// Browser-specific values, runs at init
rw.browser = {
	check: function() {
		var trans = function() {
			var body = document.getElementsByTagName('body')[0];
			var properties = ['transform', 'WebkitTransform', 'MozTransform'];
			var p;
			while (p = properties.shift()){
				if (typeof body.style[p]!='undefined') {
					return p;
				}
			}
			return false;
		}
		if (trans()) {
			this.trans_name = trans();
		} else {
			this.trans_name = 'none';
		}
	},
	trans_name: 'none',
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
	rw.browser.check();
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
	if (rw.runGame==false) {
		rw.runGame = true;
		rw.curT = setTimeout('rw.run()', this.speed);
	}
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
	// FIX THIS SO IT'S LESS REPETITIVE CODE, or don't cuz this is FAST
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
		if (rw.ents[x].hitMap) {
			for (var z=0;z<rw.ents[x].hitMap.length;z++) {
				for (var y=x+1;y<len;y++) {
					if (rw.ents[y].hitMap) {
						for (var w=0;w<rw.ents[y].hitMap.length;w++) {
							var hit = true;
							// Left Check
							if (rw.ents[x].base.posX+rw.ents[x].hitMap[z][2]<=rw.ents[y].base.posX+rw.ents[y].hitMap[w][0]) {
								hit = false;
							}
							// Right Check
							if (rw.ents[x].base.posX+rw.ents[x].hitMap[z][0]>=rw.ents[y].base.posX+rw.ents[y].hitMap[w][2]) {
								hit = false;
							}
							// Top Check
							if (rw.ents[x].base.posY+rw.ents[x].hitMap[z][3]<=rw.ents[y].base.posY+rw.ents[y].hitMap[w][1]) {
								hit = false;
							}
							// Bottom Check
							if (rw.ents[x].base.posY+rw.ents[x].hitMap[z][1]>=rw.ents[y].base.posY+rw.ents[y].hitMap[w][3]) {
								hit = false;
							}
							// If collision, add to list.
							if (hit==true) {
								// Maybe change this to call a collision resolution function for each ent?
								cols[cols.length]=[[x,rw.ents[x].hitMap[z][4]],[y,rw.ents[y].hitMap[w][4]]];
							}
						}
					}
				}
			}
		}
	}
	if (cols.length>0) {
		var toBeRemoved = [];
		for (var x=0; x<cols.length; x++) {
			if (rw.ents[cols[x][0][0]].iGotHit) {
				if (rw.ents[cols[x][0][0]].iGotHit(cols[x][1][1])==false) {
					toBeRemoved[toBeRemoved.length] = cols[x][0][0];
				}
			}
			if (rw.ents[cols[x][1][0]].iGotHit) {
				if(rw.ents[cols[x][1][0]].iGotHit(cols[x][0][1])==false) {
					toBeRemoved[toBeRemoved.length] = cols[x][1][0];
				}
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
		rw.curT = setTimeout('rw.run()', this.speed);
	} else {
		rw.stop();
	}
}
