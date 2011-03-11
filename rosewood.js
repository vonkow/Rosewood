/**
 * @fileoverview The Rosewood js gaming engine, because games should be fun
 * @author Caz vonKow skopsycats@gmail.com
 * @version <1.0
 */

(function(){
	var rw = {},
		runGame = false,
		curT = 0, 
		globT = 0,
		speed = 0,
		currentLag = 0,
		X = 0,
		Y = 0,
		tiles = false,
		tileX = 0,
		tileY = 0,
		keyChange = false,
		keys = [['bsp',8],['tab',9],['ent',13],['shf',16],['ctr',17],['alt',18],['pau',19],['cap',20],['esc',27],['sp',32],['pgu',33],['pgd',34],['end',35],['hom',36],['la',37],['ua',38],['ra',39],['da',40],['ins',45],['del',46],['d0',48],['d1',49],['d2',50],['d3',51],['d4',52],['d5',53],['d6',54],['d7',55],['d8',56],['d9',57],['sem',59],['eql',61],['a',65],['b',66],['c',67],['d',68],['e',69],['f',70],['g',71],['h',72],['i',73],['j',74],['k',75],['l',76],['m',77],['n',78],['o',79],['p',80],['q',81],['r',82],['s',83],['t',84],['u',85],['v',86],['w',67],['x',88],['y',89],['z',90],['lwn',91],['rwn',92],['sel',93],['n0',96],['n1',97],['n2',98],['n3',99],['n4',100],['n5',101],['n6',102],['n7',103],['n8',104],['n9',105],['mul',106],['add',107],['sub',109],['dec',110],['div',111],['f1',112],['f2',113],['f3',114],['f4',115],['f5',116],['f6',117],['f7',118],['f8',119],['f9',120],['f10',121],['f11',122],['f12',123],['num',144],['scr',145],['com',188],['per',190],['fsl',191],['acc',192],['obr',219],['bsl',220],['cbr',221],['qot',222]],
		mouseX = 0,
		mouseY = 0,
		mouseDown = false,
		moveAllX = 0,
		moveAllY = 0,
		moveAllZ = 0,
		states = {},
		stopCallback = null;
	rw.sprites = {};
	rw.soundBank = {};
	rw.sounds = [];
	rw.ents = []; 
	rw.rules = {};
	rw.ruleList = [];

	rw.loadSprites = function(sprites, callback) {
		function loadNext(arr) {
			if (arr.length) {
				var i = arr.pop();
				var img = new Image();
				img.onload = function() {
					// Add logic for multi-sprite images, check for object vs array
					if (i.length==2) {
						rw.sprites[i[0]] = {};
						for (var x in i[1]) {
							if (x!='src') {
								rw.sprites[i[0]][x] = [this, i[1][x][0], i[1][x][1], i[1][x][2]||0, i[1][x][3]||0];
							}
						}
					} else {
						rw.sprites[i[0]] = [this, i[2], i[3], i[4]||0, i[5]||0];
					}
					loadNext(arr);
				};
				img.onerror = function() { loadNext(arr) };
				//Add check here too
				if (i.length==2) {
					img.src = i[1].src;
				} else {
					img.src = i[1];
				}
			} else {
				callback();
			};
		};
		var x,
			arr = [];
		for (x in sprites) {
			// This may also need checking for multi-sprite images
			var i = sprites[x];
			if (i.length) {
				arr.push([x, i[0], i[1], i[2], i[3], i[4]]);
			} else {
				arr.push([x, i]);
			}
		};
		loadNext(arr);
	};
	rw.playSound = function(sound) {
		var len = rw.sounds.length;
		rw.sounds[len] = document.createElement('audio');
		rw.sounds[len].src = rw.soundBank[sound].src;
		rw.sounds[len].play();
		return rw;
	}
	rw.loadSounds = function(sounds, callback) {
		function loadNext(arr) {
			if (arr.length) {
				var s = arr.pop();
				var snd = new Audio();
				rw.soundBank[s[0]] = snd;
				function nxt() {
					loadNext(arr);
				}
				snd.addEventListener("canplay", nxt, false);
				snd.src = s[1];
			} else {
				callback();
			}
		}
		loadNext(sounds);
	}
	rw.getTime = function(type) {
		return (type=='g') ? curT+globT : curT;
	}
	rw.Xdim = function() {
		return X;
	}
	rw.Ydim = function() {
		return Y;
	}
	rw.setFPS = function(fps) {
		speed = 1000/parseInt(fps);
		return rw;
	}
	rw.getFPS = function() {
		return 1000/speed;
	}
	rw.getLag = function() {
		return currentLag;
	}
	rw.tilesOn = function(xDim, yDim) {
		tiles = true;
		tileX = xDim;
		tileY = yDim;
		return rw;
	}
	rw.tilesOff = function() {
		tiles = false;
		tileX = 0;
		tileY = 0;
		return rw;
	};
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
	rw.key = function(key) {
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
	// These are currently not working correctly, as they will return absolute position of mouse, not relative pos.
	rw.mouse = new function() {
		this.x = function() {
			return mouseX;
		},
		this.y = function() {
			return mouseY;
		},
		this.down = function() {
			return mouseDown;
		}
	};
	var mousePos = function(e) {
		if (!e) var e=window.event;
		if (e.offsetX) {
			mouseX=e.offsetX;
			mouseY=e.offsetY;
		} else {
			mouseX=e.layerX;
			mouseY=e.layerY;
		};
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
	rw.Ent = function(nameIn, spriteIn, widthIn, heightIn) {
		this.ent = '';
		this.name = nameIn;
		this.sprite = spriteIn;
		this.width = widthIn;
		this.height = heightIn;
		this.posX = 0;
		this.posY = 0;
		this.posZ = 0;
		this.velX = 0;
		this.velY = 0;
		this.velZ = 0;
		this.active = false;
		this.visible=false;
	};
	rw.Ent.prototype.back = function() {
		return this.ent;
	};
	rw.Ent.prototype.end = function() {
		return rw
	};
	rw.Ent.prototype.posX1 = function() {
		return this.posX;
	}
	rw.Ent.prototype.posY1 = function() {
		return this.posY;
	}
	rw.Ent.prototype.posX2 = function() {
		return this.posX+this.width;
	}
	rw.Ent.prototype.posY2 = function() {
		return this.posY+this.height;
	}
	rw.Ent.prototype.display = function (posXIn, posYIn, posZIn) {
		this.posX = posXIn;
		this.posY = posYIn;
		(posZIn) ? this.posZ = posZIn : this.posZ = posYIn;
		this.active = true;
		this.visible = (this.sprite!==' ') ? true : false;
		return this;
	};
	rw.Ent.prototype.hide = function() {
		this.active=false;
		this.visible=false;
		return this;
	};
	rw.Ent.prototype.changeSprite = function(sprite) {
		this.sprite = sprite;
		(this.sprite != '') ?  this.visible=true : this.visible=false;
		return this;
	};
	rw.Ent.prototype.curMove = function() {
		return [this.velX, this.velY, this.velZ];
	}
	rw.Ent.prototype.wipeMove = function(axis) {
		if (axis) {
			(axis=='x') ? this.velX = 0 :
			(axis=='y') ? this.velY = 0 :
			(axis=='z') ? this.velZ = 0 : true;
		} else {
			this.velX = 0;
			this.velY = 0;
			this.velZ = 0;
		}
		return this;
	}
	rw.Ent.prototype.moveTo = function(x, y, z) {
		this.posX = x;
		this.posY = y;
		(z||z===0) ? this.posZ = z : this.posZ = y;
		return this;
	}
	rw.Ent.prototype.getTileX=function() {
		return (tiles) ? Math.floor(this.posY/tileY) : false;
	};
	rw.Ent.prototype.getTileY=function() {
		return (tiles) ? Math.floor(this.posY/tileY) : false;
	};
	rw.Ent.prototype.clicked = function() {
		if (rw.mouse.down()) {
			if ((rw.mouse.x()>this.posX1())&&(rw.mouse.x()<this.posX2())) {
				if ((rw.mouse.y()>this.posY1())&&(rw.mouse.y()<this.posY2())) {
					return true;
				};
			};
		};
		return false;
	};
	rw.Ent.prototype.move = function(x,y,z) {
		this.velX += x;
		this.velY += y;
		(z||z===0) ? this.velZ += z : this.velZ += y;
		return this;
	}

	rw.newEnt = function(ent) {
		ent.base['ent'] = ent;
		rw.ents.push(ent);
		if (ent.base.sprite!=='') ent.base.visible = true;
		if (ent.init) ent.init();
		return ent;
	};
	rw.removeEnt = function(entNum) {
		rw.ents.splice(entNum, 1);
		return rw;
	};
	rw.moveAll = function(x,y,z) {
		moveAllX = x;
		moveAllY = y;
		moveAllZ = z || 0;
	};
	rw.Rule = function(active, pos) {
		this.active = active;
		this.pos = pos;
	}
	rw.newRule = function(name, rule) {
		rw.rules[name] = rule;
		rw.ruleList[rule.base.pos].push(name);
		return rw;
	}
	rw.removeRule = function(rule) {
		if (rw.rules[rule]) {
			var pos = rw.rules[rule].base.pos;
			var list = rw.ruleList[pos];
			for (var x=0, len=list.length; x<len; x++) {
				if (list[x]==rule) {
					list.splice(x,1);
					break;
				};
			};
			delete rw.rules[rule];
		}
		return rw;
	}
	var copy = function(obj,par) {
		var newCopy = (obj instanceof Array) ? [] : {};
		for (prop in obj) {
			// Don't add ent.base.ent, as this gets all loopy (in the infinite sense)
			// rw.loadState() handles re-adding ent.base.ent on state load.
			if (prop=='ent') {
				newCopy[prop]='';
			} else {
				if (obj[prop] && typeof obj[prop] == 'object') {
					newCopy[prop] = copy(obj[prop],newCopy);
				} else {
					newCopy[prop] = obj[prop];
				}
			}
		}
		return newCopy;
	}

	rw.saveState = function(name) {
		states[name] = {};
		states[name]['ents']=copy(rw.ents,rw);
		states[name]['maps']=copy(rw.maps,rw);
		states[name]['rules']=copy(rw.rules,rw);
		states[name]['ruleList']=copy(rw.ruleList,rw);
		var len = states[name]['ents'].length;
		for (var x=0; x<len; x++) {
			states[name]['ents'][x].base['ent'] = states[name]['ents'][x];
		}
		return rw;
	}
	rw.isState=function(name) {
		if (states[name]) return true;
		return false;
	};
	rw.loadState = function(name) {
		if (states[name]) {
			rw.ents = copy(states[name]['ents'],name);
			rw.rules = copy(states[name]['rules'],name);
			rw.ruleList = copy(states[name]['ruleList'],name);
			var len = rw.ents.length;
			for (var x=0;x<len;x++) {
				rw.ents[x].base.ent = rw.ents[x];
				if (rw.ents[x].base.active==true) {
					rw.ents[x].base.display(
						rw.ents[x].base.posX,
						rw.ents[x].base.posY,
						rw.ents[x].base.posZ
					);
				}
			}
			keyChange = true;
		}
		return rw;
	}
	rw.rmState = function(name) {
		if (states[name]) delete states[name];
		return rw;
	}
	// Needs serious re-writing, one of these days
	rw.ajax = function(targ, func) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET",targ,true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState==4) {
				var resp = xhr.responseText;
				eval(func+'(resp)');
			}
		}
		xhr.send(null);
		return rw;
	}
	rw.func = function() {
		return rw;
	}
	rw.changeCursor = function(cursor) {
		document.getElementById('board').style.cursor="url('"+cursor+"')";
		return rw;
	}
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
		trans_name: 'none'
	}
	rw.wipeBoard = function() {
		var board = document.getElementById('board');
		var total = board.childNodes.length;
		for (var x=0; x<total; x++) {
			board.removeChild(board.childNodes[0]);
		}
		return rw;
	}
	rw.wipeEnts = function() {
		rw.ents = [];
		return rw;
	}
	rw.wipeRules = function() {
		rw.rules = {};
		rw.ruleList = [[],[],[],[]];
		return rw;
	}
	rw.wipeAll = function() {
		rw.wipeBoard().wipeEnts().wipeRules();
		return rw;
	}
	rw.init = function(target, uSet, callback) {
		var settings = {
			x: uSet.x||0,
			y: uSet.y||0,
			FPS: uSet.FPS||30,
			keys: (((uSet.keys)||(uSet.keys===false)) ? uSet.keys : true),
			mouse: (((uSet.mouse)||(uSet.mouse===false)) ? uSet.mouse : true),
			sound: (((uSet.sound)||(uSet.sound===false)) ? uSet.sound : true),
			// if you set canvas=false, there's no dom fallback, so you're basically screwed, for now.
			canvas: (((uSet.canvas)||(uSet.canvas===false)) ? uSet.canvas : true),
			sequence: uSet.sequence || [
				'rule',
				'ents',
				'rule',
				'cols',
				'kill',
				'rule',
				'blit',
				'rule'
			]
		};
		rw.browser.check();
		rw.setFPS(settings.FPS);
		X = settings.x
		Y = settings.y
		if (settings.canvas) {
			var board = document.createElement('canvas');
			board.id = 'board';
			board.width = settings.x
			board.height = settings.y
			board.style.width = settings.x
			board.style.height = settings.y
			//board.style.overflow = 'hidden'; // Not needed?
			//board.style.position = "relative"; // Not needed?
			document.getElementById(target).appendChild(board);
		}
		if (settings.keys) {
			if (settings.keys instanceof Array) {
				for (var x = 0; x<keys.length; x++) {
					var needed = false;
					for (var y = 0; y<settings.keys.length; y++) {
						if (keys[x][0]==settings.keys[y]) needed = true;
					}
					if (!needed) keys.splice(x--, 1);
				}
			}
			if (window.document.addEventListener) {
				window.document.addEventListener("keydown", keyDown, false);
				window.document.addEventListener("keyup", keyUp, false);
			} else {
				window.document.attachEvent("onkeydown", keyDown);
				window.document.attachEvent("onkeyup", keyUp);
			}
		}
		if (settings.mouse) {
			board.onmousemove = mousePos;
			board.onmousedown = mouseDown;
			board.onmouseup = mouseUp;
		}
		var runFunc = composeLoop(settings.sequence, 0, 0, function(){return [];});
		rw.run = function() {
			var startTime = new Date(),
				toBeRemoved = [];
			moveAllX = 0;
			moveAllY = 0;
			moveAllZ = 0;
			killFinishedSounds();
			runFunc([]);
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
				clearTimeout(rw.curT);
				globT += curT;
				curT = 0;
				if (typeof(stopCallback)=='function') stopCallback();
				stopCallback = null;
			}
		}
		return rw;
	}
	// Here lies witchcraft and hints of erlang...
	function composeLoop(seq, count, ruleCount, func) {
		var f = function(tbk) {func(tbk)};
		if (count<seq.length) {
			var cur = seq[seq.length-count-1];
			if (cur=='rule') {
				var rl = ruleLoop(ruleCount);
				f = function(tbk) {func(rl(tbk))};
				rw.ruleList.push([]);
				ruleCount++;
			}else if (cur=='ents') {
				f = function(tbk) {func(updateEnts(tbk))};
			} else if (cur=='cols') {
				f = function(tbk) {func(collisionLoop(tbk))};
			} else if (cur=='kill') {
				f = function(tbk) {func(killLoop(tbk))};
			} else if (cur=='blit') {
				f = function(tbk) {func(redrawLoop(tbk))};
			}

			return composeLoop(seq, count+1, ruleCount, f);
		} else {
			return f;
		}
	}
	rw.start = function() {
		if (runGame==false) {
			runGame = true;
			curT = setTimeout('rw.run()', speed);
		}
		return rw;
	}
	rw.stop = function(callback) {
		stopCallback = callback;
		runGame = false;
		return rw;
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


	function killFinishedSounds() {
		for (var x=0; x<rw.sounds.length; x++) {
			if (rw.sounds[x].ended) {
				rw.sounds.splice(x,1);
				x--;
			}
		}
	}


	function ruleLoop(listId) {
		return function(tbk) {
			for (var x=0, l=rw.ruleList[listId].length; x<l; x++) {
				if (rw.rules[rw.ruleList[listId][x]].base.active) {
					rw.rules[rw.ruleList[listId][x]].rule();
				}
			}
			return tbk;
		}
	}

	function updateEnts(toBeRemoved) {
		// Start Update Loop
		var len = rw.ents.length;
		// Update Loop
		if (keyChange==true) {
			for (var x=0; x<len; x++) {
				var curEnt = rw.ents[x];
				if (curEnt.base.active==true) {
					if (curEnt.keyChange) {
						curEnt.keyChange();
					}
					var currentSprite = curEnt.update(curEnt.base.posX, curEnt.base.posY, curEnt.base.posX+curEnt.base.width, curEnt.base.posY+curEnt.base.height);
					if (currentSprite==false) {
						toBeRemoved.push(x)
					} else {
						//Nothing for now
					}
				} else if (curEnt.inactive) {
					var currentSprite = curEnt.inactive();
					if (currentSprite==false) {
						toBeRemoved.push(x)
					}
				}
			}
			keyChange = false;
		} else {
			for(var x=0; x<len; x++) {
				// Could change curEnt to ent.base and use .ent to access update(), make things cleaner
				var curEnt = rw.ents[x];
				if (curEnt.base.active==true) {
					var currentSprite = curEnt.update(curEnt.base.posX, curEnt.base.posY, curEnt.base.posX+curEnt.base.width, curEnt.base.posY+curEnt.base.height);
					if (currentSprite==false) {
						toBeRemoved.push(x)
					} else {
						//Nothing for now
					}
				} else if (curEnt.inactive) {
					var currentSprite = curEnt.inactive();
					if (currentSprite==false) {
						toBeRemoved.push(x)
					}
				}
			}
		}
		return toBeRemoved;
	}

	function collisionLoop(toBeRemoved) {
		var len = rw.ents.length;
		var cols = [];
		// For each ent
		for (var x=0;x<len;x++) {
			var eX=rw.ents[x];
			if (eX.base.active&&eX.hitMap) {
				for (var y=x+1;y<len;y++) {
					var eY=rw.ents[y];
					if (eY.base.active&&eY.hitMap) {
						for (var z=0;z<eX.hitMap.length;z++) {
							var eXm=eX.hitMap[z];
							for (var w=0;w<eY.hitMap.length;w++) {
								var eYm=eY.hitMap[w];
								var canHit=false;
								var canHitMap=eXm[1];
								if (canHitMap) {
									var hitLen=canHitMap.length;
									for (var v=0;v<hitLen;v++) {
										if (canHitMap[v]==eYm[0]) {
											canHit=true;
										};
									};
								};
								if (canHit) {
									var eXx=eX.base.posX+eX.base.velX;
									var eXy=eX.base.posY+eX.base.velY;
									var eYx=eY.base.posX+eY.base.velX;
									var eYy=eY.base.posY+eY.base.velY;
									var hit = true;
									// If ent 1 hitMap is triangle
									if (eXm[7]) {
										// If ent 2 hitMap is triangle
										if (eYm[7]) {
											// Test tri tri
											var eXp1 = [eXm[2]+eXx,eXm[3]+eXy];
											var eXp2 = [eXm[4]+eXx,eXm[5]+eXy];
											var eXp3 = [eXm[6]+eXx,eXm[7]+eXy];
											var eYp1 = [eYm[2]+eYx,eYm[3]+eYy];
											var eYp2 = [eYm[4]+eYx,eYm[5]+eYy];
											var eYp3 = [eYm[6]+eYx,eYm[7]+eYy];
											checkTriCol(eXp1,eYp1,eYp2,eYp3) ? hit=true :
											checkTriCol(eXp2,eYp1,eYp2,eYp3) ? hit=true :
											checkTriCol(eXp3,eYp1,eYp2,eYp3) ? hit=true :
											checkTriCol(eYp1,eXp1,eXp2,eXp3) ? hit=true :
											checkTriCol(eYp2,eXp1,eXp2,eXp3) ? hit=true :
											checkTriCol(eYp3,eXp1,eXp2,eXp3) ? hit=true : hit=false;
										} else if (eYm[5]) {
											// Test tri rec
											var eXp1 = [eXm[2]+eXx,eXm[3]+eXy];
											var eXp2 = [eXm[4]+eXx,eXm[5]+eXy];
											var eXp3 = [eXm[6]+eXx,eXm[7]+eXy];
											var eYp1 = [eYm[2]+eYx,eYm[3]+eYy];
											var eYp2 = [eYm[2]+eYx,eYm[5]+eYy];
											var eYp3 = [eYm[4]+eYx,eYm[5]+eYy];
											var eYp4 = [eYm[4]+eYx,eYm[3]+eYy];
											checkRecCol(eXp1,eYp1,eYp3) ? hit=true :
											checkRecCol(eXp2,eYp1,eYp3) ? hit=true :
											checkRecCol(eXp3,eYp1,eYp3) ? hit=true :
											checkTriCol(eYp1,eXp1,eXp2,eXp3) ? hit=true :
											checkTriCol(eYp2,eXp1,eXp2,eXp3) ? hit=true :
											checkTriCol(eYp3,eXp1,eXp2,eXp3) ? hit=true :
											checkTriCol(eYp4,eXp1,eXp2,eXp3) ? hit=true : hit=false;
										} else if (eYm[4]) {
											// Test tri circ
											var c = [eYm[2]+eYx,eYm[3]+eYy,eYm[4]];
											var tp1 = [eXm[2]+eXx,eXm[3]+eXy];
											var tp2 = [eXm[4]+eXx,eXm[5]+eXy];
											var tp3 = [eXm[6]+eXx,eXm[7]+eXy];
											checkTriCol([c[0],c[1]],tp1,tp2,tp3) ? hit=true :
											checkCircLine(tp1,tp2,c) ? hit=true :
											checkCircLine(tp2,tp3,c) ? hit=true :
											checkCircLine(tp1,tp3,c) ? hit=true : hit=false;
										} else {
											// Test tri point
											var eXp1 = [eXm[2]+eXx,eXm[3]+eXy];
											var eXp2 = [eXm[4]+eXx,eXm[5]+eXy];
											var eXp3 = [eXm[6]+eXx,eXm[7]+eXy];
											var eYp1 = [eYm[2]+eYx,eYm[3]+eYy];
											hit = checkTriCol(eYp1,eXp1,eXp2,eXp3);
										}
									} else if (eXm[5]) {
										// Ent 1 is rec
										if (eYm[7]) {
											// Test rec tri
											var eXp1 = [eXm[2]+eXx,eXm[3]+eXy];
											var eXp2 = [eXm[2]+eXx,eXm[5]+eXy];
											var eXp3 = [eXm[4]+eXx,eXm[5]+eXy];
											var eXp4 = [eXm[4]+eXx,eXm[3]+eXy];
											var eYp1 = [eYm[2]+eYx,eYm[3]+eYy];
											var eYp2 = [eYm[4]+eYx,eYm[5]+eYy];
											var eYp3 = [eYm[6]+eYx,eYm[7]+eYy];
											checkRecCol(eYp1,eXp1,eXp3) ? hit=true :
											checkRecCol(eYp2,eXp1,eXp3) ? hit=true :
											checkRecCol(eYp3,eXp1,eXp3) ? hit=true :
											checkTriCol(eXp1,eYp1,eYp2,eYp3) ? hit=true :
											checkTriCol(eXp2,eYp1,eYp2,eYp3) ? hit=true :
											checkTriCol(eXp3,eYp1,eYp2,eYp3) ? hit=true :
											checkTriCol(eXp4,eYp1,eYp2,eYp3) ? hit=true : hit=false;
										} else if (eYm[5]) {
											// Test rec rec
											if (eXx+eXm[4]<=eYx+eYm[2]) {
												hit = false;
											} else if (eXx+eXm[2]>=eYx+eYm[4]) {
												hit = false;
											} else if (eXy+eXm[5]<=eYy+eYm[3]) {
												hit = false;
											} else if (eXy+eXm[3]>=eYy+eYm[5]) {
												hit = false;
											}
										} else if (eYm[4]) {
											// Test rec circ
											var cx=eYm[2]+eYx;
											var cy=eYm[3]+eYy;
											var cr=eYm[4];
											var rx1 = eXm[2]+eXx;
											var rx2 = eXm[4]+eXx;
											var ry1 = eXm[3]+eXy;
											var ry2 = eXm[5]+eXy;
											hit = checkCircRec(cx,cy,cr,rx1,ry1,rx2,ry2);
										} else {
											// Test rec pt
											var rp1 = [eXm[2]+eXx,eXm[3]+eXy];
											var rp2 = [eXm[4]+eXx,eXm[5]+eXy];
											var p = [eYm[2]+eYx,eYm[5]+eYy];
											hit = checkRecCol(p,rp1,rp2);
										}
									} else if (eXm[4]) {
										// Ent 1 is circ
										if (eYm[7]) {
											// Test circ tri
											var c = [eXm[2]+eXx,eXm[3]+eXy,eXm[4]];
											var tp1 = [eYm[2]+eYx,eYm[3]+eYy];
											var tp2 = [eYm[4]+eYx,eYm[5]+eYy];
											var tp3 = [eYm[6]+eYx,eYm[7]+eYy];
											checkTriCol([c[0],c[1]],tp1,tp2,tp3) ? hit=true :
											checkCircLine(tp1,tp2,c) ? hit=true :
											checkCircLine(tp2,tp3,c) ? hit=true :
											checkCircLine(tp1,tp3,c) ? hit=true : hit=false;
										} else if (eYm[5]) {
											// Test circ rec
											var cx=eXm[2]+eXx;
											var cy=eXm[3]+eXy;
											var cr=eXm[4];
											var rx1 = eYm[2]+eYx;
											var rx2 = eYm[4]+eYx;
											var ry1 = eYm[3]+eYy;
											var ry2 = eYm[5]+eYy;
											hit = checkCircRec(cx,cy,cr,rx1,ry1,rx2,ry2);
										} else if (eYm[4]) {
											// Test circ circ
											var c1x = eXm[2]+eXx;
											var c1y = eXm[3]+eXy;
											var c1r = eXm[4];
											var c2x = eYm[2]+eYx;
											var c2y = eYm[3]+eYy;
											var c2r = eYm[4];
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
			};
			// does this still work?
			if (eX.postCol) eX.postCol();
		}
		if (cols.length>0) {
			for (var x=0; x<cols.length; x++) {
				if (rw.ents[cols[x][0][0]].gotHit) {
					if (rw.ents[cols[x][0][0]].gotHit(cols[x][1][1],cols[x][0][1],cols[x][1][0])==false) {
						toBeRemoved.push(cols[x][0][0])
					}
				}
				if (rw.ents[cols[x][1][0]].gotHit) {
					if (rw.ents[cols[x][1][0]].gotHit(cols[x][0][1],cols[x][1][1],cols[x][0][0])==false) {
						toBeRemoved.push(cols[x][1][0])
					}
				}
			}
		}
		return toBeRemoved;
	}

	function killLoop(toBeRemoved) {
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
		return [];
	}

	function redrawLoop(toBeRemoved) {
		var zOrder = {},
			zKey = [],
			board = document.getElementById('board').getContext('2d');
		for (var x=0, l=rw.ents.length; x<l; x++) {
			var z = rw.ents[x].base.posZ;
			if (!zOrder[z]) {
				zOrder[z]= [];
				zKey.push(z);
			};
			zOrder[z].push(x);
		};
		zKey = zKey.sort(function(a,b){return a-b});
		// Clear old board
		board.clearRect(0,0,X,Y);
		// Redraw all ents, starting with the lowest z-Index
		for (var x=0, xl=zKey.length; x<xl;x++) {
			var curOrder = zOrder[zKey[x]];
			for (var y=0, yl=curOrder.length; y<yl; y++) {
				var curEnt = rw.ents[curOrder[y]].base;
				// !!! Move ent movement to previous loop, so zIndex is properly calc'd
				curEnt.posX += curEnt.velX+moveAllX;
				curEnt.posY += curEnt.velY+moveAllY;
				curEnt.posZ += curEnt.velZ+moveAllZ;
				curEnt.wipeMove();
				if (curEnt.visible) {
					if (curEnt.sprite=='text') {
						var txt = curEnt.ent.text;
						board.font = txt.style.font || board.font || '10px sans-serif';
						board.textAlign = txt.style.align || board.textAlign || 'start';
						board.textBaseline = txt.style.baseline || board.textBaseline || 'alphabetic';
						if (txt.form=='fill') {
							board.fillStyle = txt.style.color || board.fillStyle || '#000';
							board.fillText(txt.text, curEnt.posX, curEnt.posY);
						} else if (txt.form=='stroke') {
							board.strokeStyle = txt.style.color || board.strokeStyle || '#000';
							board.strokeText(txt.text, curEnt.posX, curEnt.posY);
						}
					} else if (curEnt.sprite!='') {
						if (curEnt.sprite.indexOf('.')!=-1) {
							var str = curEnt.sprite.split('.');
							var sprite = rw.sprites[str[0]][str[1]];
						} else {
							var sprite = rw.sprites[curEnt.sprite];
						}
						board.drawImage(
							sprite[0],
							sprite[3],
							sprite[4],
							sprite[1],
							sprite[2],
							curEnt.posX,
							curEnt.posY,
							curEnt.width,
							curEnt.height
						);
					}
				}
			}
		}
		zOrder = null;
		zKey = null;
		return toBeRemoved;
	}
	// for closure compiler
	window['rw']=rw;
	window['rw']['run']=rw.run;
	window['rw']['ents']=rw.ents;
	window['rw']['rules']=rw.rules;
	window['rw']['ruleList']=rw.ruleList;
})();
