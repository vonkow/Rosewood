var rw = new function(){
	var me = this;
	// RunLoop or stop
	var runGame = false; 
	// RunLoop current Timer
	var curT = 0; 
	// RunLoop global Timer
	var globT = 0; 
	me.getTime = function(type) {
		return (type=='g') ? curT+globT : curT;
	}
	var currentLag = 0;
	// Golbal gameboard dimensions
	var X = 0;
	var Y = 0;
	me.Xdim = function() {
		return X;
	}
	me.Ydim = function() {
		return Y;
	}
	// Game speed settings
	var speed = 50;
	me.setFPS = function(fps) {
		speed = 1000/parseInt(fps);
		return this;
	}
	me.getFPS = function() {
		return 1000/speed;
	}
	me.getLag = function() {
		return currentLag;
	}
	// Resource Path Settings
	var resPath = 'sprites/';
	me.setPath = function(newPath) {
		resPath = newPath;
		return this;
	}
	me.getPath = function() {
		return resPath;
	}
	// Tile settings
	var tiles = false;
	var tileX = 0;
	var tileY = 0;
	me.tilesOn = function(xDim, yDim) {
		tiles = true;
		tileX = xDim;
		tileY = yDim;
		return this;
	}
	me.tilesOff = function() {
		tiles = false;
		tileX = 0;
		tileY = 0;
		return this;
	}
	//KeyDown/Up settings
	var keyChange = false; 
	var keys = [['bsp',8],['tab',9],['ent',13],['shf',16],['ctr',17],['alt',18],['pau',19],['cap',20],['esc',27],['sp',32],['pgu',33],['pgd',34],['end',35],['hom',36],['la',37],['ua',38],['ra',39],['da',40],['ins',45],['del',46],['d0',48],['d1',49],['d2',50],['d3',51],['d4',52],['d5',53],['d6',54],['d7',55],['d8',56],['d9',57],['sem',59],['eql',61],['a',65],['b',66],['c',67],['d',68],['e',69],['f',70],['g',71],['h',72],['i',73],['j',74],['k',75],['l',76],['m',77],['n',78],['o',79],['p',80],['q',81],['r',82],['s',83],['t',84],['u',85],['v',86],['w',67],['x',88],['y',89],['z',90],['lwn',91],['rwn',92],['sel',93],['n0',96],['n1',97],['n2',98],['n3',99],['n4',100],['n5',101],['n6',102],['n7',103],['n8',104],['n9',105],['mul',106],['add',107],['sub',109],['dec',110],['div',111],['f1',112],['f2',113],['f3',114],['f4',115],['f5',116],['f6',117],['f7',118],['f8',119],['f9',120],['f10',121],['f11',122],['f12',123],['num',144],['scr',145],['com',188],['per',190],['fsl',191],['acc',192],['obr',219],['bsl',220],['cbr',221],['qot',222]];
	var keySwitch = function(code, bit) {
		var len = keys.length;
		for (var x=0;x<len;x++) {
			if (keys[x][1]==code) {
				keys[x][2] = bit;
			}
		}
	}
	var keyDown = function(e) {
		var ev = e ? e : window.event;
		keySwitch(ev.keyCode, true);
		keyChange = true;
	}
	var keyUp = function(e) {
		var ev = e ? e : window.event;
		keySwitch(ev.keyCode, false);
		keyChange = true;
	}
	me.key = function(key) {
		var len=keys.length;
		for (var x=0; x<len;x++) {
			if (keys[x][0]==key) {
				if (keys[x][2]) {
					return true;
				} else {
					return false;
				}
			}
		}
	}
	// Mouse Position settings
	// These are currently not working correctly, as they will return absolute position of mouse, not relative pos.
	var mouseX = 0;
	var mouseY = 0;
	var mouseDown = false;
	me.mouse = {
		x: function() {
			return mouseX
		},
		y: function() {
			return mouseY
		},
		down: function() {
			return mouseDown
		}
	};
	var mousePos = function(e) {
		if (e) {
			// Like a normal browser...
			mouseX= e.pageX;
			mouseY= e.pageY;
		} else {
			// THIS IS WHY WE CAN'T HAVE PRETTY THINGS IE!!!
			var e = window.event;
			me.mouse.x = e.clientX+(document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
			me.mouse.y = e.clientY+(document.documentElement.scrollRight ? document.documentElement.scrollRight : document.body.scrollRight);
		}
	}
	var mouseDown = function(e) {
		if (!e) var e = window.event;
		mouseDown= true;
	}
	var mouseUp = function(e) {
		if (!e) var e = window.event;
		mouseDown= false;

	}
	var rotatePoint=function(p,o,a) {
		var ang = a*0.0174532925;
		var trans=[p[0]-o[0],p[1]-o[1]];
		var newP=[(trans[0]*Math.cos(ang))-(trans[1]*Math.sin(ang)),(trans[0]*Math.sin(ang))+(trans[1]*Math.cos(ang))];
		newP[0]+=o[0];
		newP[1]+=o[1];
		return newP;
	}
	// Game Entities
	me.ents = []; 
	me.ent = function(name, sprites, baseSprite, spriteExt, width, height) {
		this.name = name;
		this.sprites = sprites;
		this.baseSprite = baseSprite;
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
		this.active = false; //Bool for is piece in play
		this.visible=false; //Bool for if piece should have a div
		// Display Entity Function, sets ent.base.active to true
		this.display = function (sprite, posX, posY, posZ) {
			this.baseSprite=sprite;
			this.posX = posX;
			this.posY = posY;
			if (posZ) {
				this.posZ = posZ;
			} else {
				this.posZ = posY;
			};
			this.active = true;
			if (sprite!=='') {
				this.visible=true;
				var newEnt = document.createElement('div');
				newEnt.id = 'ent_'+this.name;
				newEnt.style.width = this.width; newEnt.style.height = this.height;
				if (sprite!=' ') {
					newEnt.style.backgroundImage = "url('"+resPath+this.sprites+"/"+sprite+"."+this.spriteExt+"')";
					newEnt.style.backgroundRepeat = 'no-repeat';
					newEnt.style.backgroundPosition = 'center';
				};
				newEnt.style.position = 'absolute';
				newEnt.style.left = this.posX+'px';
				newEnt.style.top = this.posY+'px';
				document.getElementById('board').appendChild(newEnt);
			} else {
				this.visible=false;
			};
			return this;
		};
		this.hide = function() {
			if (document.getElementById('ent_'+this.name)) {
				var dying = document.getElementById('ent_'+this.name);
				dying.parentNode.removeChild(dying);
			};
			this.active=false;
			this.visible=false;
			return this;
		};
		this.changeSprite = function(sprite) {
			this.baseSprite=sprite;
			var entDiv = document.getElementById('ent_'+this.name);
			if (entDiv) {
				if (sprite!='') {
					this.visible=true;
					entDiv.style.backgroundImage = "url('"+resPath+this.sprites+"/"+sprite+"."+this.spriteExt+"')";
				} else {
					entDiv.parentNode.removeChild(entDiv);
					this.visible=false;
				};
			} else {
				if (sprite!='') {
					this.display(sprite,this.posX,this.posY,this.posX);
				} else {
					this.visible=false;
				};
			};
			return this;
		};
		this.move = function(x,y,z) {
			this.velX += x;
			this.velY += y;
			if (z) {
				this.velZ += z;
			} else {
				this.velZ += y;
			}
			return this;
		}
		this.curMove = function() {
			return [this.velX, this.velY, this.velZ];
		}
		this.wipeMove = function(axis) {
			if (axis) {
				if (axis=='x') {
					this.velX = 0;
				} else if (axis=='y') {
					this.velY = 0;
				} else if (axis=='z') {
					this.velZ = 0;
				}
			} else {
				this.velX = 0;
				this.velY = 0;
				this.velZ = 0;
			}
			return this;
		}
		this.moveTo = function(x, y, z) {
			this.posX = x;
			this.posY = y;
			if (z) {
				this.posZ = z;
			} else {
				this.posZ = y;
			}
			return this;
		}
		this.rotate = function(deg) {
			var entDiv = document.getElementById('ent_'+this.name);
			if (entDiv) {
				entDiv.style[me.browser.trans_name] = 'rotate('+deg+'deg)';
			}
			return this;
		}
		this.rotMap=function(hitMap, angle) {
			var centerP = [this.width/2,this.height/2];
			var newMap = [hitMap[0]];
			var pt1 = rotatePoint([hitMap[1],hitMap[2]],centerP,angle);
			var pt2 = rotatePoint([hitMap[3],hitMap[4]],centerP,angle);
			var pt3 = rotatePoint([hitMap[5],hitMap[6]],centerP,angle);
			newMap.push(pt1[0]);
			newMap.push(pt1[1]);
			newMap.push(pt2[0]);
			newMap.push(pt2[1]);
			newMap.push(pt3[0]);
			newMap.push(pt3[1]);
			return newMap;
		};
		this.tileX=function() {
			if (tiles) {
				return Math.floor(this.posY/tileY);
			} else {
				return false;
			};
		};
		this.tileY=function() {
			if (tiles) {
				return Math.floor(this.posY/tileY);
			} else {
				return false;
			};
		};
		this.clicked = function() {
			if (me.mouse.down()) {
				if ((me.mouse.x()>this.posX1())&&(me.mouse.x()<this.posX2())) {
					if ((me.mouse.y()>this.posY1())&&(me.mouse.y()<this.posY2())) {
						return true;
					};
				};
			};
			return false;
		};
		this.attach = function(content) {
			var entDiv=document.getElementById('ent_'+this.name);
			if (entDiv) {
				entDiv.appendChild(content);
			};
			return this;
		};
		this.detach = function() {
			var ele = document.getElementById('ent_'+this.name);
			if (ele) {
				var tot = ele.childNodes.length;
				for (var x=0;x<tot;x++) {
					ele.removeChild(ele.childNodes[0]);
				};
			};
			return this;
		};
		this.end = function() {
			return me;
		};
	};
	me.newEnt = function(ent) {
		var curLength = me.ents.length;
		me.ents[curLength] = ent;
		return ent;
	};
	me.removeEnt = function(entNum) {
		me.ents.splice(entNum, 1);
		return this;
	};
	// Object and Ent Library, helper functions
	me.lib = {
		ent : function(name, type, xDim, yDim) {
			this.base = new me.ent(name, type, ' ', ' ', xDim, yDim);
			this.hitMap = [[type,0,0,xDim,yDim]];
			this.update = function(){};
			this.iGotHit = function(){};
		}
	};
	// Map Entities
	me.maps = {}; 
	me.map = function(name, path, extention, xDim, yDim) {
		this.name = name;
		this.path = path;
		this.extention = extention;
		this.active = false;
		this.width = xDim;
		this.height = yDim;
		this.x = 0;
		this.y = 0;
		this.z = -1;
		this.move=function(x,y,z) {
			this.x+=x;
			this.y+=y;
			if (z) this.z+=z;
			if (document.getElementById('map_'+this.name)) {
				var mapDiv = document.getElementById('map_'+this.name);
				mapDiv.style.marginLeft = this.x+'px';
				mapDiv.style.marginTop = this.y+'px';
				mapDiv.style.zIndex=this.z;
			};
			return this;
		};
		this.moveTo=function(x,y,z) {
			this.x=x;
			this.y=y;
			if (z) this.z=z;
			if (document.getElementById('map_'+this.name)) {
				var mapDiv = document.getElementById('map_'+this.name);
				mapDiv.style.marginLeft = this.x+'px';
				mapDiv.style.marginTop = this.y+'px';
				mapDiv.style.zIndex=this.z;
			};
			return this;
		};
		this.display = function() {
			this.active = true;
			if (document.getElementById('map_'+this.name)) {
				var mapDiv = document.getElementById('map_'+this.name);
				mapDiv.style.display = 'block';
			} else {
				var mapArea = document.createElement('div');
				mapArea.id = 'map_'+this.name;
				mapArea.style.backgroundImage = "url('sprites/maps/"+this.path+"."+this.extention+"')";
				mapArea.style.width = this.width+'px';
				mapArea.style.height = this.height+'px';
				mapArea.style.position = 'absolute';
				mapArea.style.overflow = 'hidden';
				mapArea.style.marginLeft = this.x+'px';
				mapArea.style.marginTop = this.y+'px';
				mapArea.style.zIndex = this.z;
				var board = document.getElementById('board');
				board.appendChild(mapArea);
			}
			return this;
		}
		this.hide = function() {
			this.active = false;
			if (document.getElementById('map_'+this.name)) {
				var mapDiv = document.getElementById('map_'+this.name);
				mapDiv.style.display = 'none';
			}
			return this;
		}
		this.remove = function() {
			this.active = false;
			if (document.getElementById('map_'+this.name)) {
				var mapArea = document.getElementById('map_'+this.name);
				mapArea.parentNode.removeChild(mapArea);
			}
			return this;
		}
		this.end = function() {
			return me;
		}

	}
	me.newMap = function(name, map, ext, dimX, dimY) {
		me.maps[name] = new me.map(name, map, ext, dimX, dimY);
		return me.maps[name];
	}
	me.removeMap = function(map) {
		if (me.maps[map]) {
			delete me.maps[map];
			return true;
		} else {
			return false;
		}
		return this;
	}
	// Rule Entities
	me.rules = {};
	me.rule = function(active) {
		this.active = active;
	}
	me.newRule = function(name, rule) {
		me.rules[name] = rule;
		return this;
	}
	me.removeRule = function(rule) {
		if (me.rules[rule]) {
			delete me.rules[rule];
			return true;
		} else {
			return false;
		}
		return this;
	}
	var states = {};
	var copy = function(obj) {
		var newCopy = (obj instanceof Array) ? [] : {};
		for (prop in obj) {
			if (obj[prop] && typeof obj[prop] == 'object') {
				newCopy[prop] = copy(obj[prop]);
			} else {
				newCopy[prop] = obj[prop];
			}
		}
		return newCopy;
	}

	me.saveState = function(name) {
		states[name] = {
			ents : copy(rw.ents),
			maps : copy(rw.maps),
			rules : copy(rw.rules)
		};
		return this;
	}
	me.loadState = function(name) {
		if (states[name]) {
			me.ents = copy(states[name].ents);
			me.maps = copy(states[name].maps);
			me.rules = copy(states[name].rules);
			for (map in me.maps) {
				if (me.maps[map].active==true) me.maps[map].display();
			}
			var len = me.ents.length;
			for (var x=0;x<len;x++) {
				if (me.ents[x].base.active==true) {
					me.ents[x].base.display(
						me.ents[x].base.baseSprite,
						me.ents[x].base.posX,
						me.ents[x].base.posY,
						me.ents[x].base.posZ
					);
				}
			}
			keyChange = true;
		}
		return this;
	}
	me.rmState = function(name) {
		if (states[name]) delete states[name];
		return this;
	}
	var doAtEnd=null;
	me.atEnd=function(arg) {
		doAtEnd=arg;
		return this;
	}
	// Ajax function, durr
	me.ajax = function(targ, func) {
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
	me.func = function() {
		return this;
	}

	//AUDIO!!! NEW!!! Needs work integrating all browsers
	me.soundBank = {};
	me.sounds = [];
	me.playSound = function(sound) {
		var len = me.sounds.length;
		me.sounds[len] = document.createElement('audio');
		me.sounds[len].src = me.soundBank[sound].src;
		me.sounds[len].play();
		return me;
	}
	me.newSound = function(name, src) {
		me.soundBank[name] = new Audio(src);
		return me;
	}

	//Maybe Fixed now?
	// Image pre-loader
	var preImg = [];
	me.using = function(path, ext, imgArray) {
		var len = imgArray.length;
		for (var x=0; x<len;x++) {
			preImg[preImg.length] = new Image();
			preImg[preImg.length-1].src = 'sprites/'+path+'/'+imgArray[x]+'.'+ext;
		}
		return this;
	}
	// Changes Cursor
	me.changeCursor = function(cursor) {
		document.getElementById('board').style.cursor="url(sprites/"+cursor+"), wait";
		return this;
	}
	// Browser-specific values, runs at init
	me.browser = {
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
		trans_name: 'none'
	}
	// Wipe Functions
	// Removes all children of the board
	me.wipeBoard = function() {
		var board = document.getElementById('board');
		var total = board.childNodes.length;
		for (var x=0; x<total; x++) {
			board.removeChild(board.childNodes[0]);
		}
		return this;
	}
	me.wipeEnts = function() {
		me.ents = [];
		return this;
	}
	me.wipeMaps = function() {
		me.maps = {};
		return this;
	}
	me.wipeRules = function() {
		me.rules = {};
		return this;
	}
	me.wipeAll = function() {
		me.wipeBoard().wipeEnts().wipeMaps().wipeRules();
		return this;
	}
	// Initilization Function
	me.init = function(dimX, dimY, target) {
		me.browser.check();
		var board = document.createElement('div');
		board.id = 'board';
		X = dimX;
		Y = dimY;
		board.style.width = dimX+'px';
		board.style.height = dimY+'px';
		board.style.overflow = 'hidden';
		//board.style.border = '1px solid black';
		board.style.position = "relative";
		if (target) {
			document.getElementById(target).appendChild(board);
		} else {
			document.getElementsByTagName('body')[0].appendChild(board);
		}
		if (window.document.addEventListener) {
			window.document.addEventListener("keydown", keyDown, false);
			window.document.addEventListener("keyup", keyUp, false);
		} else {
			window.document.attachEvent("onkeydown", keyDown);
			window.document.attachEvent("onkeyup", keyUp);
		}
		document.onmousemove = mousePos;
		document.onmousedown = mouseDown;
		document.onmouseup = mouseUp;
		return this;
	}
	// Start FUnction
	me.start = function() {
		if (runGame==false) {
			runGame = true;
			curT = setTimeout('rw.run()', speed);
		}
		return this;
	}
	// Stop Function
	me.stop = function() {
		runGame = false;
		return this;
	}
	// Point in Triangle Test
	var pointInTri=function(p,a,b,c) {
		var cp = ((b[0]-a[0])*(p[1]-a[1]))-((b[1]-a[1])*(p[0]-a[0]));
		var cp_ref = ((b[0]-a[0])*(c[1]-a[1]))-((b[1]-a[1])*(c[0]-a[0]));
		if (cp_ref>=0) {
			if (cp>=0) {
				return true;
			} else {
				return false;
			}
		} else if (cp<=0) {
			return true;
		} else {
			return false;
		}
	}
	// Check Point in tri
	var checkTriCol=function(p,a,b,c) {
		if (pointInTri(p,a,b,c)) {
			if (pointInTri(p,b,c,a)) {
				if (pointInTri(p,c,a,b)) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
	// Check Point in rec
	var checkRecCol=function(p,a,b) {
		if (p[0]<a[0]) {
			return false;
		}
		if (p[0]>b[0]) {
			return false;
		}
		if (p[1]<a[1]) {
			return false;
		}
		if (p[1]>b[1]) {
			return false;
		}
		return true;
	}
	// Check Point in circle
	var checkPtCirc=function(px,py,cx,cy,cr) {
		var hit = true;
		var dist = ((cx-px)*(cx-px))+((cy-py)*(cy-py));
		(dist<(cr*cr)) ? hit=true : hit=false;
		return hit;
	}
	// Check Circle in circle
	var checkCircCirc=function(c1x,c1y,c1r,c2x,c2y,c2r) {
		var hit = true;
		var dist = ((c1x-c2x)*(c1x-c2x))+((c1y-c2y)*(c1y-c2y));
		(dist<((c1r+c2r)*(c1r+c2r))) ? hit=true : hit=false;
		return hit;
	}
	// Check circle cross line
	var checkCircLine=function(a,b,c) {
		if ((c[0]-c[2]>a[0])&&(c[0]-c[2]>b[0])) {
			return false;
		} else if ((c[0]+c[2]<a[0])&&(c[0]+c[2]<b[0])) {
			return false;
		} else if ((c[1]-c[2]>a[1])&&(c[1]-c[2]>b[1])) {
			return false;
		} else if ((c[1]+c[2]<a[1])&&(c[1]+c[2]<b[1])) {
			return false;
		} else {
			var doubleArea=(a[0]*b[1])+(b[0]*c[1])+(c[0]*a[1])-(b[0]*a[1])-(c[0]*b[1])-(a[0]*c[1]);
			if (doubleArea<0) doubleArea=-doubleArea;
			var base=Math.sqrt(((b[0]-a[0])*(b[0]-a[0]))+((b[1]-a[1])*(b[1]-a[1])));
			var dist=doubleArea/base;
			if (c[2]>dist) {
				return true;
			} else {
				return false;
			}
		}
	}
	// Check Circle in rec
	var checkCircRec=function(cx,cy,cr,rx1,ry1,rx2,ry2) {
		var hit = true;
		var rW = (rx2-rx1)/2;
		var circDistX = cx-(rx1+rW);
		if (circDistX<0) circDistX=-circDistX;
		if (circDistX>rW+cr) {
			hit=false;
		} else {
			var rH = (ry2-ry1)/2;
			var circDistY = cy-(ry1+rH);
			if (circDistY<0) circDistY=-circDistY;
			if (circDistY>rH+cr) {
				hit = false;
			} else {
				if (circDistX<=rW) {
					hit=true;
				} else if (circDistY<=rH) {
					hit=true;
				} else {
					var cornerDistSq = ((circDistX+rW)*(circDistX+rW))+((circDistY+rH)*(circDistY+rH));
					if (cornerDistSq<=cr*cr) {
						hit=true;
					} else {
						hit=false;
					}
				}
			}
		}
		return hit;
	}
	// RunLoop Function
	me.run = function() {
		var startTime = new Date();
		for (var x=0; x<me.sounds.length; x++) {
			if (me.sounds[x].ended) {
				me.sounds.splice(x,1);
				x--;
			}
		}
		// Update Loop
		if (keyChange==true) {
			for (var x=0; x<me.ents.length; x++) {
				if (me.ents[x].base.active==true) {
					if (me.ents[x].keyChange) {
						me.ents[x].keyChange();
					}
					var currentSprite = me.ents[x].update(me.ents[x].base.posX1(), me.ents[x].base.posX2(), me.ents[x].base.posY1(), me.ents[x].base.posY2());
					if (currentSprite==false) {
						me.removeEnt(x);
						x--;
					} else {
						//Nothing for now
					}
				} else if (me.ents[x].inactive) {
					var currentSprite = me.ents[x].inactive();
					if (currentSprite==false) {
						me.removeEnt(x);
						x--;
					}
				}
			}
			keyChange = false;
		} else {
			for(var x=0; x<me.ents.length; x++) {
				if (me.ents[x].base.active==true) {
					var currentSprite = me.ents[x].update(me.ents[x].base.posX1(), me.ents[x].base.posX2(), me.ents[x].base.posY1(), me.ents[x].base.posY2());
					if (currentSprite==false) {
						me.removeEnt(x);
						x--;
					} else {
						//Nothing for now
					}
				} else if (me.ents[x].inactive) {
					var currentSprite = me.ents[x].inactive();
					if (currentSprite==false) {
						me.removeEnt(x);
						x--;
					}
				}
			}
		}
		// Collision Loop
		var len = me.ents.length;
		var cols = [];
		// For each ent
		for (var x=0;x<len;x++) {
			var eX=me.ents[x];
			if (eX.hitMap) {
				for (var z=0;z<eX.hitMap.length;z++) {
					var eXm=eX.hitMap[z];
					for (var y=x+1;y<len;y++) {
						var eY=me.ents[y];
						if (eY.hitMap) {
							for (var w=0;w<eY.hitMap.length;w++) {
								var eYm=eY.hitMap[w];
								var eXx=eX.base.posX+eX.base.velX;
								var eXy=eX.base.posY+eX.base.velY;
								var eYx=eY.base.posX+eY.base.velX;
								var eYy=eY.base.posY+eY.base.velY;
								var hit = true;
								// If ent 1 hitMap is triangle
								if (eXm[6]) {
									// If ent 2 hitMap is triangle
									if (eYm[6]) {
										// Test tri tri
										var eXp1 = [eXm[1]+eXx,eXm[2]+eXy];
										var eXp2 = [eXm[3]+eXx,eXm[4]+eXy];
										var eXp3 = [eXm[5]+eXx,eXm[6]+eXy];
										var eYp1 = [eYm[1]+eYx,eYm[2]+eYy];
										var eYp2 = [eYm[3]+eYx,eYm[4]+eYy];
										var eYp3 = [eYm[5]+eYx,eYm[6]+eYy];
										checkTriCol(eXp1,eYp1,eYp2,eYp3) ? hit=true :
										checkTriCol(eXp2,eYp1,eYp2,eYp3) ? hit=true :
										checkTriCol(eXp3,eYp1,eYp2,eYp3) ? hit=true :
										checkTriCol(eYp1,eXp1,eXp2,eXp3) ? hit=true :
										checkTriCol(eYp2,eXp1,eXp2,eXp3) ? hit=true :
										checkTriCol(eYp3,eXp1,eXp2,eXp3) ? hit=true : hit=false;
									} else if (eYm[4]) {
										// Test tri rec
										var eXp1 = [eXm[1]+eXx,eXm[2]+eXy];
										var eXp2 = [eXm[3]+eXx,eXm[4]+eXy];
										var eXp3 = [eXm[5]+eXx,eXm[6]+eXy];
										var eYp1 = [eYm[1]+eYx,eYm[2]+eYy];
										var eYp2 = [eYm[1]+eYx,eYm[4]+eYy];
										var eYp3 = [eYm[3]+eYx,eYm[4]+eYy];
										var eYp4 = [eYm[3]+eYx,eYm[2]+eYy];
										checkRecCol(eXp1,eYp1,eYp3) ? hit=true :
										checkRecCol(eXp2,eYp1,eYp3) ? hit=true :
										checkRecCol(eXp3,eYp1,eYp3) ? hit=true :
										checkTriCol(eYp1,eXp1,eXp2,eXp3) ? hit=true :
										checkTriCol(eYp2,eXp1,eXp2,eXp3) ? hit=true :
										checkTriCol(eYp3,eXp1,eXp2,eXp3) ? hit=true :
										checkTriCol(eYp4,eXp1,eXp2,eXp3) ? hit=true : hit=false;
									} else if (eYm[3]) {
										// Test tri circ
										var c = [eYm[1]+eYx,eYm[2]+eYy,eYm[3]];
										var tp1 = [eXm[1]+eXx,eXm[2]+eXy];
										var tp2 = [eXm[3]+eXx,eXm[4]+eXy];
										var tp3 = [eXm[5]+eXx,eXm[6]+eXy];
										checkTriCol([c[0],c[1]],tp1,tp2,tp3) ? hit=true :
										checkCircLine(tp1,tp2,c) ? hit=true :
										checkCircLine(tp2,tp3,c) ? hit=true :
										checkCircLine(tp1,tp3,c) ? hit=true : hit=false;
									} else {
										// Test tri point
										var eXp1 = [eXm[1]+eXx,eXm[2]+eXy];
										var eXp2 = [eXm[3]+eXx,eXm[4]+eXy];
										var eXp3 = [eXm[5]+eXx,eXm[6]+eXy];
										var eYp1 = [eYm[1]+eYx,eYm[2]+eYy];
										hit = checkTriCol(eYp1,eXp1,eXp2,eXp3);
									}
								} else if (eXm[4]) {
									// Ent 1 is rec
									if (eYm[6]) {
										// Test rec tri
										var eXp1 = [eXm[1]+eXx,eXm[2]+eXy];
										var eXp2 = [eXm[1]+eXx,eXm[4]+eXy];
										var eXp3 = [eXm[3]+eXx,eXm[4]+eXy];
										var eXp4 = [eXm[3]+eXx,eXm[2]+eXy];
										var eYp1 = [eYm[1]+eYx,eYm[2]+eYy];
										var eYp2 = [eYm[3]+eYx,eYm[4]+eYy];
										var eYp3 = [eYm[5]+eYx,eYm[6]+eYy];
										checkRecCol(eYp1,eXp1,eXp3) ? hit=true :
										checkRecCol(eYp2,eXp1,eXp3) ? hit=true :
										checkRecCol(eYp3,eXp1,eXp3) ? hit=true :
										checkTriCol(eXp1,eYp1,eYp2,eYp3) ? hit=true :
										checkTriCol(eXp2,eYp1,eYp2,eYp3) ? hit=true :
										checkTriCol(eXp3,eYp1,eYp2,eYp3) ? hit=true :
										checkTriCol(eXp4,eYp1,eYp2,eYp3) ? hit=true : hit=false;
									} else if (eYm[4]) {
										// Test rec rec
										if (eXx+eXm[3]<=eYx+eYm[1]) {
											hit = false;
										} else if (eXx+eXm[1]>=eYx+eYm[3]) {
											hit = false;
										} else if (eXy+eXm[4]<=eYy+eYm[2]) {
											hit = false;
										} else if (eXy+eXm[2]>=eYy+eYm[4]) {
											hit = false;
										}
									} else if (eYm[3]) {
										// Test rec circ
										var cx=eYm[1]+eYx;
										var cy=eYm[2]+eYy;
										var cr=eYm[3];
										var rx1 = eXm[1]+eXx;
										var rx2 = eXm[3]+eXx;
										var ry1 = eXm[2]+eXy;
										var ry2 = eXm[4]+eXy;
										hit = checkCircRec(cx,cy,cr,rx1,ry1,rx2,ry2);
									} else {
										// Test rec pt
										var rp1 = [eXm[1]+eXx,eXm[2]+eXy];
										var rp2 = [eXm[3]+eXx,eXm[4]+eXy];
										var p = [eYm[1]+eYx,eYm[4]+eYy];
										hit = checkRecCol(p,rp1,rp2);
									}
								} else if (eXm[3]) {
									// Ent 1 is circ
									if (eYm[6]) {
										// Test circ tri
										var c = [eXm[1]+eXx,eXm[2]+eXy,eXm[3]];
										var tp1 = [eYm[1]+eYx,eYm[2]+eYy];
										var tp2 = [eYm[3]+eYx,eYm[4]+eYy];
										var tp3 = [eYm[5]+eYx,eYm[6]+eYy];
										checkTriCol([c[0],c[1]],tp1,tp2,tp3) ? hit=true :
										checkCircLine(tp1,tp2,c) ? hit=true :
										checkCircLine(tp2,tp3,c) ? hit=true :
										checkCircLine(tp1,tp3,c) ? hit=true : hit=false;
									} else if (eYm[4]) {
										// Test circ rec
										var cx=eXm[1]+eXx;
										var cy=eXm[2]+eXy;
										var cr=eXm[3];
										var rx1 = eYm[1]+eYx;
										var rx2 = eYm[3]+eYx;
										var ry1 = eYm[2]+eYy;
										var ry2 = eYm[4]+eYy;
										hit = checkCircRec(cx,cy,cr,rx1,ry1,rx2,ry2);
									} else if (eYm[3]) {
										// Test circ circ
										var c1x = eXm[1]+eXx;
										var c1y = eXm[2]+eXy;
										var c1r = eXm[3];
										var c2x = eYm[1]+eYx;
										var c2y = eYm[2]+eYy;
										var c2r = eYm[3];
										hit = checkCircCirc(c1x,c1y,c1r,c2x,c2y,c2r);
									} else {
										// Test circ pt
									}
								} else {
									// Ent 1 is point
								}
								// If collision, add to list.
								if (hit==true) {
									// Maybe change this to call a collision resolution function for each ent?
									cols[cols.length]=[[x,eXm[0]],[y,eYm[0]]];
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
				if (me.ents[cols[x][0][0]].gotHit) {
					if (me.ents[cols[x][0][0]].gotHit(cols[x][1][1],cols[x][0][1],cols[x][1][0])==false) {
						toBeRemoved[toBeRemoved.length] = cols[x][0][0];
					}
				}
				if (me.ents[cols[x][1][0]].gotHit) {
					if (me.ents[cols[x][1][0]].gotHit(cols[x][0][1],cols[x][1][1],cols[x][0][0])==false) {
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
					me.removeEnt(killThese[x]);
				}
			}
		}
		// Run Through all rules;
		for (var x in me.rules) {
			if (me.rules[x].base.active==true) {
				me.rules[x].rule();
			}
		}
		// Run Through all ents and update position
		for (var x=0; x<me.ents.length; x++) {
			me.ents[x].base.posX += me.ents[x].base.velX;
			me.ents[x].base.posY += me.ents[x].base.velY;
			me.ents[x].base.posZ += me.ents[x].base.velZ;
			if (me.ents[x].base.visible) {
				var entDiv = document.getElementById('ent_'+me.ents[x].base.name);
				entDiv.style.left = me.ents[x].base.posX+'px';
				entDiv.style.top = me.ents[x].base.posY+'px';
				entDiv.style.zIndex = me.ents[x].base.posZ;
			}
			me.ents[x].base.wipeMove();
		}
		// At end function, if any
		if (typeof(doAtEnd)=='function') {
			doAtEnd();
			doAtEnd=null;
		}
		//If game has not ended or been paused, continue
		var endTime = new Date();
		var timeTotal = endTime-startTime;
		if (runGame==true) {
			if (timeTotal<speed) {
				curT = setTimeout('rw.run()', speed-timeTotal);
			} else {
				curT = setTimeout('rw.run()', 1);
			}
			currentLag = timeTotal-speed;
		} else {
			clearTimeout(me.curT);
			globT += curT;
			curT = 0;
		}
	}
} 
