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
rw.keyChange = false; 
rw.keys = {
	bsp : false, //8 backspace
	tab: false, //9 tab
	ent: false, //13 enter
	shf: false, //16 shift
	ctr: false, //17 ctrl
	alt: false, //18 alt
	pau: false, //19 pause / break
	cap: false, //20 caps lock
	esc: false, //27 escape
	sp: false,  //32 space bar
	pgu: false, //33 page up
	pgd: false, //34 page down
	end: false, //35 end
	hom: false, //36 home
	la: false,  //37 left arrow
	ua: false,  //38 up arrow
	ra: false,  //39 right arrow
	da: false,  //40 down arrow
	ins: false, //45 isert
	del: false, //46 delete
	d0: false,  //48 0
	d1: false,  //49 1
	d2: false,  //50 2
	d3: false,  //51 3
	d4: false,  //52 4
	d5: false,  //53 5
	d6: false,  //54 6
	d7: false,  //55 7
	d8: false,  //56 8
	d9: false,  //57 9
	sem: false, //59 semicolon
	eql: false, //61 equals
	a: false,   //65 a
	b: false,   //66 b
	c: false,   //67 c
	d: false,   //68 d
	e: false,   //69 e
	f: false,   //70 f
	g: false,   //71 g
	h: false,   //72 h
	i: false,   //73 i
	j: false,   //74 j
	k: false,   //75 k
	l: false,   //76 l
	m: false,   //77 m
	n: false,   //78 n
	o: false,   //79 o
	p: false,   //80 p
	q: false,   //81 q
	r: false,   //82 r
	s: false,   //83 s
	t: false,   //84 t
	u: false,   //85 u
	v: false,   //86 v
	w: false,   //67 w
	x: false,   //88 x
	y: false,   //89 y
	z: false,   //90 z
	lwn: false, //91 left windows
	rwn: false, //92 right windows
	sel: false, //93 select
	n0: false,  //96 num 0
	n1: false,  //97 num 1
	n2: false,  //98 num 2
	n3: false,  //99 num 3
	n4: false,  //100 num 4
	n5: false,  //101 num 5
	n6: false,  //102 num 6
	n7: false,  //103 num 7
	n8: false,  //104 num 8
	n9: false,  //105 num 9
	mul: false, //106 num multiply
	add: false, //107 num add
	sub: false, //109 num subtract (also normal subtract)
	dec: false, //110 num decimal point
	div: false, //111 num divide
	f1: false,  //112 f1
	f2: false,  //113 f2
	f3: false,  //114 f3
	f4: false,  //115 f4
	f5: false,  //116 f5
	f6: false,  //117 f6
	f7: false,  //118 f7
	f8: false,  //119 f8
	f9: false,  //120 f9
	f10: false, //121 f10
	f11: false, //122 f11
	f12: false, //123 f12
	num: false, //144 numlock
	scr: false, //145 scroll lock
	com: false, //188 comma
	per: false, //190 period
	fsl: false, //191 forward slash
	acc: false, //192 accent
	obr: false, //219 open bracket
	bsl: false, //220 backslash
	cbr: false, //221 close bracket
	qot: false  //222 quote
};
rw.keySwitch = function(code, bit) {
	switch(code) {
		case 8:
			rw.keys.bsp = bit; //8 backspace
			break;
		case 9:
			rw.keys.tab= bit; //9 tab
			break;
		case 13:
			rw.keys.ent= bit; //13 enter
			break;
		case 16:
			rw.keys.shf= bit; //16 shift
			break;
		case 17:
			rw.keys.ctr= bit; //17 ctrl
			break;
		case 18:
			rw.keys.alt= bit; //18 alt
			break;
		case 19:
			rw.keys.pau= bit; //19 pause / break
			break;
		case 20:
			rw.keys.cap= bit; //20 caps lock
			break;
		case 27:
			rw.keys.esc= bit; //27 escape
			break;
		case 32:
			rw.keys.sp= bit;  //32 space bar
			break;
		case 33:
			rw.keys.pgu= bit; //33 page up
			break;
		case 34:
			rw.keys.pgd= bit; //34 page down
			break;
		case 35:
			rw.keys.end= bit; //35 end
			break;
		case 36:
			rw.keys.hom= bit; //36 home
			break;
		case 37:
			rw.keys.la= bit;  //37 left arrow
			break;
		case 38:
			rw.keys.ua= bit;  //38 up arrow
			break;
		case 39:
			rw.keys.ra= bit;  //39 right arrow
			break;
		case 40:
			rw.keys.da= bit;  //40 down arrow
			break;
		case 45:
			rw.keys.ins= bit; //45 isert
			break;
		case 46:
			rw.keys.del= bit; //46 delete
			break;
		case 48:
			rw.keys.d0= bit;  //48 0
			break;
		case 49:
			rw.keys.d1= bit;  //49 1
			break;
		case 50:
			rw.keys.d2= bit;  //50 2
			break;
		case 51:
			rw.keys.d3= bit;  //51 3
			break;
		case 52:
			rw.keys.d4= bit;  //52 4
			break;
		case 53:
			rw.keys.d5= bit;  //53 5
			break;
		case 54:
			rw.keys.d6= bit;  //54 6
			break;
		case 55:
			rw.keys.d7= bit;  //55 7
			break;
		case 56:
			rw.keys.d8= bit;  //56 8
			break;
		case 57:
			rw.keys.d9= bit;  //57 9
			break;
		case 59:
			rw.keys.sem= bit; //59 semicolon
			break;
		case 61:
			rw.keys.eql= bit; //61 equals
			break;
		case 65:
			rw.keys.a= bit;   //65 a
			break;
		case 66:
			rw.keys.b= bit;   //66 b
			break;
		case 67:
			rw.keys.c= bit;   //67 c
			break;
		case 68:
			rw.keys.d= bit;   //68 d
			break;
		case 69:
			rw.keys.e= bit;   //69 e
			break;
		case 70:
			rw.keys.f= bit;   //70 f
			break;
		case 71:
			rw.keys.g= bit;   //71 g
			break;
		case 72:
			rw.keys.h= bit;   //72 h
			break;
		case 73:
			rw.keys.i= bit;   //73 i
			break;
		case 74:
			rw.keys.j= bit;   //74 j
			break;
		case 75:
			rw.keys.k= bit;   //75 k
			break;
		case 76:
			rw.keys.l= bit;   //76 l
			break;
		case 77:
			rw.keys.m= bit;   //77 m
			break;
		case 78:
			rw.keys.n= bit;   //78 n
			break;
		case 79:
			rw.keys.o= bit;   //79 o
			break;
		case 80:
			rw.keys.p= bit;   //80 p
			break;
		case 81:
			rw.keys.q= bit;   //81 q
			break;
		case 82:
			rw.keys.r= bit;   //82 r
			break;
		case 83:
			rw.keys.s= bit;   //83 s
			break;
		case 84:
			rw.keys.t= bit;   //84 t
			break;
		case 85:
			rw.keys.u= bit;   //85 u
			break;
		case 86:
			rw.keys.v= bit;   //86 v
			break;
		case 87:
			rw.keys.w= bit;   //67 w
			break;
		case 88:
			rw.keys.x= bit;   //88 x
			break;
		case 89:
			rw.keys.y= bit;   //89 y
			break;
		case 90:
			rw.keys.z= bit;   //90 z
			break;
		case 91:
			rw.keys.lwn= bit; //91 left windows
			break;
		case 92:
			rw.keys.rwn= bit; //92 right windows
			break;
		case 93:
			rw.keys.sel= bit; //93 select
			break;
		case 96:
			rw.keys.n0= bit;  //96 num 0
			break;
		case 97:
			rw.keys.n1= bit;  //97 num 1
			break;
		case 98:
			rw.keys.n2= bit;  //98 num 2
			break;
		case 99:
			rw.keys.n3= bit;  //99 num 3
			break;
		case 100:
			rw.keys.n4= bit;  //100 num 4
			break;
		case 102:
			rw.keys.n5= bit;  //101 num 5
			break;
		case 102:
			rw.keys.n6= bit;  //102 num 6
			break;
		case 103:
			rw.keys.n7= bit;  //103 num 7
			break;
		case 104:
			rw.keys.n8= bit;  //104 num 8
			break;
		case 105:
			rw.keys.n9= bit;  //105 num 9
			break;
		case 106:
			rw.keys.mul= bit; //106 num multiply
			break;
		case 107:
			rw.keys.add= bit; //107 num add
			break;
		case 109:
			rw.keys.sub= bit; //109 num subtract (also normal subtract)
			break;
		case 110:
			rw.keys.dec= bit; //110 num decimal point
			break;
		case 111:
			rw.keys.div= bit; //111 num divide
			break;
		case 112:
			rw.keys.f1= bit;  //112 f1
			break;
		case 113:
			rw.keys.f2= bit;  //113 f2
			break;
		case 114:
			rw.keys.f3= bit;  //114 f3
			break;
		case 115:
			rw.keys.f4= bit;  //115 f4
			break;
		case 116:
			rw.keys.f5= bit;  //116 f5
			break;
		case 117:
			rw.keys.f6= bit;  //117 f6
			break;
		case 118:
			rw.keys.f7= bit;  //118 f7
			break;
		case 119:
			rw.keys.f8= bit;  //119 f8
			break;
		case 120:
			rw.keys.f9= bit;  //120 f9
			break;
		case 121:
			rw.keys.f10= bit; //121 f10
			break;
		case 122:
			rw.keys.f11= bit; //122 f11
			break;
		case 123:
			rw.keys.f12= bit; //123 f12
			break;
		case 144:
			rw.keys.num= bit; //144 numlock
			break;
		case 145:
			rw.keys.scr= bit; //145 scroll lock
			break;
		case 188:
			rw.keys.com= bit; //188 comma
			break;
		case 190:
			rw.keys.per= bit; //190 period
			break;
		case 191:
			rw.keys.fsl= bit; //191 forward slash
			break;
		case 192:
			rw.keys.acc= bit; //192 accent
			break;
		case 219:
			rw.keys.obr= bit; //219 open bracket
			break;
		case 220:
			rw.keys.bsl= bit; //220 backslash
			break;
		case 221:
			rw.keys.cbr= bit; //221 close bracket
			break;
		case 222:
			rw.keys.qot= bit; //222 quote
			break;
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
					} else {
						var hit = true;
						// Left Check
						if (rw.ents[x].base.posX+rw.ents[x].hitMap[z][2]<=rw.ents[y].base.posX) {
							hit = false;
						}
						// Right Check
						if (rw.ents[x].base.posX+rw.ents[x].hitMap[z][0]>=rw.ents[y].base.posX+rw.ents[y].base.width) {
							hit = false;
						}
						// Top Check
						if (rw.ents[x].base.posY+rw.ents[x].hitMap[z][3]<=rw.ents[y].base.posY) {
							hit = false;
						}
						// Bottom Check
						if (rw.ents[x].base.posY+rw.ents[x].hitMap[z][1]>=rw.ents[y].base.posY+rw.ents[y].base.height) {
							hit = false;
						}
						// If collision, add to list.
						if (hit==true) {
							// Maybe change this to call a collision resolution function for each ent?
							cols[cols.length]=[[x,rw.ents[x].hitMap[z][4]],[y,rw.ents[y].base.typeClass]];
						}
					}
				}
			}

		} else {
			// For each ent above this ent, check collisions
			for (var y=x+1;y<len;y++) {
				if (rw.ents[y].hitMap) {
					for (var w=0;w<rw.ents[y].hitMap.length;w++) {
						var hit = true;
						// Left Check
						if (rw.ents[x].base.posX+rw.ents[x].base.width<=rw.ents[y].base.posX+rw.ents[y].hitMap[w][0]) {
							hit = false;
						}
						// Right Check
						if (rw.ents[x].base.posX>=rw.ents[y].base.posX+rw.ents[y].hitMap[w][2]) {
							hit = false;
						}
						// Top Check
						if (rw.ents[x].base.posY+rw.ents[x].base.height<=rw.ents[y].base.posY+rw.ents[y].hitMap[w][1]) {
							hit = false;
						}
						// Bottom Check
						if (rw.ents[x].base.posY>=rw.ents[y].base.posY+rw.ents[y].hitMap[w][3]) {
							hit = false;
						}
						// If collision, add to list.
						if (hit==true) {
							// Maybe change this to call a collision resolution function for each ent?
							cols[cols.length]=[[x,rw.ents[x].base.typeClass],[y,rw.ents[y].hitMap[w][4]]];
						}

					}
				} else {
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
						cols[cols.length]=[[x,rw.ents[x].base.typeClass],[y,rw.ents[y].base.typeClass]];
					}
				}
			}
		}
	}
	if (cols.length>0) {
		var toBeRemoved = [];
		for (var x=0; x<cols.length; x++) {
			var hit0 = true;
			var hit1 = true;
			if (rw.ents[cols[x][0][0]].iGotHit) {
				hit0 = rw.ents[cols[x][0][0]].iGotHit(cols[x][1][1]);
			}
			if (rw.ents[cols[x][1][0]].iGotHit) {
				hit1 = rw.ents[cols[x][1][0]].iGotHit(cols[x][0][1]);
			}
			if (hit0==false) {
				toBeRemoved[toBeRemoved.length] = cols[x][0][0];
			}
			if (hit1==false) {
				toBeRemoved[toBeRemoved.length] = cols[x][1][0];
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
