/**
 * @fileoverview The Rosewood js gaming engine, because simple is better
 * @author Caz vonKow skopsycats@gmail.com
 * @version <1.0
 */

/**
 * The Rosewood object, holds everything else
 * @class rw base class, there should only be one instance
 * @constructor
 */
var rw = new function(){
	var me = this;
	// RunLoop or stop
	var runGame = false; 
	// RunLoop current Timer
	var curT = 0; 
	// RunLoop global Timer
	var globT = 0; 
	/**
	 * Gets the current or global time, in frames.<br>
	 * Current time is the number of frames that have elapsed since the last call to rw.start()
	 * and is reset to 0 when rw.stop() is called.<br>
	 * Global time is the total number of frames that have elapsed since rw.inti() was called.<br>
	 * @param type Opional, if set to 'g', global, not current time will be returned
	 * @returns current time, in frames elapsed.
	 */
	this.getTime = function(type) {
		return (type=='g') ? curT+globT : curT;
	}
	var currentLag = 0;
	// Golbal gameboard dimensions
	var X = 0;
	var Y = 0;
	/**
	 * Gets width of game board.
	 * @returns width of board, in pixels
	 */
	this.Xdim = function() {
		return X;
	}
	/**
	 * Gets height of game board.
	 * @returns height of board, in pixels
	 */
	this.Ydim = function() {
		return Y;
	}
	// Game speed settings
	var speed = 50;
	/**
	 * Sets speed of game, or framerate.
	 * @param fps New game framerate, in Frames Per Second.
	 * @returns rw
	 */
	this.setFPS = function(fps) {
		speed = 1000/parseInt(fps);
		return me;
	}
	/**
	 * Gets game speed
	 * @returns Current game speed, in Frames Per Second
	 */
	this.getFPS = function() {
		return 1000/speed;
	}
	/**
	 * Gets current lag.
	 * @returns current lag, in miliseconds. <br>
	 A negative number indicates no lag and represents the number of spare miliseconds per frame.
	 */
	this.getLag = function() {
		return currentLag;
	}
	// Resource Path Settings
	var resPath = 'sprites/';
	/**
	 * Sets resource path for images, sounds, etc. <br>
	 * 'sprites/' is the default.
	 * @param newPath Filepath to base resource file.
	 * @returns rw
	 */
	this.setPath = function(newPath) {
		resPath = newPath;
		return me;
	}
	/**
	 * Gets current resource path for images, sounds, etc.
	 * @returns Current resource path
	 */
	this.getPath = function() {
		return resPath;
	}
	// Tile settings
	var tiles = false;
	var tileX = 0;
	var tileY = 0;
	/**
	 * Turns on support for tiles and sets tile X & Y dimensions.
	 * @param xDim Tile width
	 * @param yDim Tile height
	 * @returns rw
	 */
	this.tilesOn = function(xDim, yDim) {
		tiles = true;
		tileX = xDim;
		tileY = yDim;
		return me;
	}
	/**
	 * Turns off support for tiles.
	 * @returns rw
	 */
	this.tilesOff = function() {
		tiles = false;
		tileX = 0;
		tileY = 0;
		return me
	};
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
	/**
	 * Checks to see if the specified key is currently being pressed.
	 * @param key Key to check. List of keynames to follow.
	 * @returns true or false based on key's down/up status
	 */
	this.key = function(key) {
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
	/**
	 * Mouse position and click status container.
	 */
	this.mouse = new function() {
		/**
		 * Gets the mouse's current X position, in pixels.
		 * @returns X position of mouse, in pixels.
		 */
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
		//if (e) {
			// Like a normal browser...
			//mouseX= e.pageX;
			//mouseY= e.pageY;
		//} else {
			// THIS IS WHY WE CAN'T HAVE PRETTY THINGS IE!!!
			//var e = window.event;
			//me.mouse.x = e.clientX+(document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
			//me.mouse.y = e.clientY+(document.documentElement.scrollRight ? document.documentElement.scrollRight : document.body.scrollRight);
		//}
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
	// Game Entities
	this.ents = []; 
	/**
	 * @class 
	 * Base constructor for game entities (ents). <br>
	 * Every ent must be an object with a new rw.ent assigned to a property named 'base'. <br>
	 * In addition, ents must also have a funtion method named 'update' (though it may be an empty function). <br>
	 */
	this.ent = function(nameIn, spritesIn, baseSpriteIn, spriteExtIn, widthIn, heightIn) {
		this.ent = '';
		this.name = nameIn;
		this.sprites = spritesIn;
		this.baseSprite = baseSpriteIn;
		this.spriteExt = spriteExtIn;
		this.width = widthIn;
		this.height = heightIn;
		this.posX = 0;
		this.posY = 0;
		this.posZ = 0;
		/**
		 * @returns ent's leftmost position, in pixels
		 */
		this.posX1 = function() {
			return this.posX;
		}
		/**
		 * @returns ent's topmost position, in pixels
		 */
		this.posY1 = function() {
			return this.posY;
		}
		/**
		 * @returns ent's rightmost position, in pixels
		 */
		this.posX2 = function() {
			return this.posX+this.width;
		}
		/**
		 * @returns ent's bottommost position, in pixels
		 */
		this.posY2 = function() {
			return this.posY+this.height;
		}
		this.velX = 0;
		this.velY = 0;
		this.velZ = 0;
		this.active = false; //Bool for is piece in play
		this.visible=false; //Bool for if piece should have a div
		// Display Entity Function, sets ent.base.active to true
		/**
		 * Displays an ent on the board and sets ent.base.active to true.<br>
		 * Creates or re-displays a div, with the id 'ent_'+ent.base.name<br>
		 * Sets ent.base.active to true, causing rosewood to call the ent's update() function one per frame.
		 * @param spriteIn Sprite to be displayed. <br>
		 * If set to '', no div will be created, however the ent will still be active. <br>
		 * Set as ' ' to create a blank div (for ent.base.attach(),etc.)
		 * @param posXIn Ent's X position on the board
		 * @param posYIn Ent's Y position on the board
		 * @param posZIn Optional, Ent's Z position on the board (will default to posYIn if unspecified)
		 * @returns ent.base
		 */
		this.display = function (spriteIn, posXIn, posYIn, posZIn) {
			this.baseSprite=spriteIn;
			this.posX = posXIn;
			this.posY = posYIn;
			if (posZIn) {
				this.posZ = posZIn;
			} else {
				this.posZ = posYIn;
			};
			this.active = true;
			if (spriteIn!=='') {
				this.visible=true;
				var newEnt = document.createElement('div');
				newEnt.id = 'ent_'+this.name;
				newEnt.style.width = this.width; newEnt.style.height = this.height;
				if (spriteIn!=' ') {
					newEnt.style.backgroundImage = "url('"+resPath+this.sprites+"/"+spriteIn+"."+this.spriteExt+"')";
					newEnt.style.backgroundRepeat = 'no-repeat';
				};
				newEnt.style.position = 'absolute';
				newEnt.style.left = this.posX+'px';
				newEnt.style.top = this.posY+'px';
				document.getElementById('board').appendChild(newEnt);
				if (this.children.length>0) {
					for (var x=0;x<this.children.length;x++) {
						blitChildDiv(this,this.children[x])
					}
				}
			} else {
				this.visible=false;
			};
			return this;
		};
		/**
		 * Removes ent from game board.
		 * Sets ent.active & ent.visible to false.
		 * @returns ent.base
		 */
		this.hide = function() {
			if (document.getElementById('ent_'+this.name)) {
				var dying = document.getElementById('ent_'+this.name);
				dying.parentNode.removeChild(dying);
			};
			this.active=false;
			this.visible=false;
			return this;
		};
		/**
		  * Changes the sprite used to display an ent.
		  * @param sprite File name of new sprite. <br>
		  * @returns ent.base
		  */
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
		this.shiftSprite=function(x,y) {
			var entDiv=document.getElementById('ent_'+this.name);
			if (entDiv) {
				entDiv.style.background="url('"+resPath+this.sprites+"/"+this.baseSprite+"."+this.spriteExt+"') "+x+"px "+y+"px no-repeat";
			};
		};
		this.shifts={};
		/**
		 * Adds a named sprite shift to ent.base.shifts.
		 * @param name Name of new shift.
		 * @param x Horizontal position of new shift.
		 * @param y Vertical position of new shift.
		 * @returns ent.base
		 */
		this.addShift=function(name,x,y) {
			this.shifts[name]=[x,y];
			return this;
		};
		/**
		 * Shifts ent's sprite to named sprite shift.
		 * @param name Name of sprite shift.
		 * @returns ent.base
		 */
		this.shiftTo=function(name) {
			if (name in this.shifts) {
				this.shiftSprite(this.shifts[name][0],this.shifts[name][1]);
			};
			return this;
		};
		/**
		 * Moves ent specified distance. <br>
		 * <strong>Note:</strong> This function is additive, subsequent calls within a single frame
		 * will be summed as a single velocity value before being applied at the end of the frame.
		 * To reset velocity mid-frame, use wipeMove(). 
		 * @param x Horizontal distance of move.
		 * @param y Vertical distance of move.
		 * @param z Optional: Distance of z-index (depth) movement. <br>
		 * <strong>Note:</strong> Will default to y if unspecified.
		 * @returns ent.base
		 */
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
		/**
		 * Gets ent's current velocity, or sum total of movement within the current frame.
		 * @returns An array: [x velocity, y velocity, z velocity]
		 */
		this.curMove = function() {
			return [this.velX, this.velY, this.velZ];
		}
		/**
		 * Resets ent's current velocity to 0 (velocity is the sum total of all calls to ent.base.move() thus far within the current frame).
		 * @param axis Optional: Can be set to 'x', 'y', or 'z' to wipe only a single axis of movement.
		 * @returns ent.base
		 */
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
		/**
		 * Immediately moves ent to specified absolute position on the board. <br>
		 * <strong>Note:</strong> Unlike ent.base.move() this action occurs instantaneously and does not effect velocity.
		 * @param x Absolute horizontal position to place ent.
		 * @param y Absolute vertical position to place ent.
		 * @param z Absolute z-index, or depth position to place ent.
		 * @returns ent.base
		 */
		this.moveTo = function(x, y, z) {
			this.posX = x;
			this.posY = y;
			if (z||z==0) {
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
			var newMap = [hitMap[0],hitMap[1]];
			var pt1 = rotatePoint([hitMap[2],hitMap[3]],centerP,angle);
			var pt2 = rotatePoint([hitMap[4],hitMap[5]],centerP,angle);
			var pt3 = rotatePoint([hitMap[6],hitMap[7]],centerP,angle);
			newMap.push(pt1[0]);
			newMap.push(pt1[1]);
			newMap.push(pt2[0]);
			newMap.push(pt2[1]);
			newMap.push(pt3[0]);
			newMap.push(pt3[1]);
			return newMap;
		};
		this.getTileX=function() {
			if (tiles) {
				return Math.floor(this.posY/tileY);
			} else {
				return false;
			};
		};
		this.getTileY=function() {
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
		this. children=[];
		this.addChild=function(name,g,x,y,z,w,h,ox,oy) {
			var oX =(ox) ? ox : 0;
			var oY =(oy) ? oy : 0;
			this.children.push([name,g,x,y,z,w,h,oX,oY]);
			var entDiv=document.getElementById('ent_'+this.name);
			if (entDiv) {
				blitChildDiv(this,this.children[this.children.length-1])
			};
			return this
		};
		var getChild=function(meme,child) {
			if (typeof(child)=='number') {
				var theChild=meme.children[child];
			} else {
				for (var x=0;x<meme.children.length;x++) {
					if (meme.children[x][0]==child) {
						var theChild=meme.children[x];
						break
					}
				}
			};
			if (theChild) return theChild;
			return false
		};
		var blitChildDiv=function(meme,child) {
			var childDiv=document.getElementById('ent_'+meme.name+'_'+child[0]);
			if (childDiv) {
				childDiv.style.left=child[2]+'px';
				childDiv.style.top=child[3]+'px';
				childDiv.style.zIndex=child[4];
				childDiv.style.width=child[5]+'px';
				childDiv.style.height=child[6]+'px';
				childDiv.style.background='url("'+resPath+meme.sprites+'/'+child[1]+'.'+meme.spriteExt+'") no-repeat '+child[7]+'px '+child[8]+'px'
			} else {
				var entDiv=document.getElementById('ent_'+meme.name);
				if (entDiv) {
					var childDiv=document.createElement('div');
					childDiv.id='ent_'+meme.name+'_'+child[0];
					childDiv.style.position='absolute';
					childDiv.style.left=child[2]+'px';
					childDiv.style.top=child[3]+'px';
					childDiv.style.zIndex=child[4];
					childDiv.style.width=child[5]+'px';
					childDiv.style.height=child[6]+'px';
					childDiv.style.overflow='hidden';
					if (child[1]!=' ') {
						childDiv.style.background='url("'+resPath+meme.sprites+'/'+child[1]+'.'+meme.spriteExt+'") no-repeat '+child[7]+'px '+child[8]+'px'
					};
					entDiv.appendChild(childDiv)
				}
			}
		};
		this.moveChild=function(child,x,y,z) {
			var theChild=getChild(this,child);
			if (theChild) {
				theChild[2]=x;
				theChild[3]=y;
				theChild[4]=z;
				blitChildDiv(this,theChild)
			};
			return this
		};
		this.resizeChild=function(child,w,h) {
			var theChild=getChild(this,child);
			if (theChild) {
				theChild[5]=w;
				theChild[6]=h;
				blitChildDiv(this,theChild)
			};
			return this
		};
		this.changeChild=function(child,g,ox,oy) {
			var theChild=getChild(this,child);
			if (theChild) {
				theChild[1] = g;
				theChild[7] = ((ox)||(ox===0)) ? ox : theChild[7];
				theChild[8] = ((oy)||(oy===0)) ? oy : theChild[8];
				blitChildDiv(this,theChild)
			};
			return this
		};
		this.removeChild=function(child) {
			if (typeof(child)=='number') {
				var childId=child
			} else {
				for (var x=0;x<this.children.length;x++) {
					if (this.children[x][0]==child) {
						var childId=x;
						break
					}
				}
			};
			if ((childId)||(childId==0)) {
				var childDiv=document.getElementById('ent_'+this.name+'_'+this.children[childId][0]);
				childDiv.parentNode.removeChild(childDiv);
				this.children.slice(childId,1)
			};
			return this
		};
		this.back = function() {
			return this.ent;
		};
		this.end = function() {
			return me
		};
	};
	/**
	 * Registers a new ent with the engine.
	 * @param ent Ent to be added to rw.ents
	 * @returns ent
	 */
	this.newEnt = function(ent) {
		ent.base.ent = ent;
		var curLength = me.ents.length;
		me.ents[curLength] = ent;
		if (ent.init) ent.init();
		return ent;
	};
	/**
	 * Removes an ent from rw.ents. <br>
	 * <strong>CAUTION:</strong> Don't use unless you know what you're doing, can cause lots of havoc if impropery called. <br>
	 * To remove an ent without creating conflicts, have ent.update(), ent.inactive() or ent.gotHit() return false.
	 * @param entNum Absolute position of ent to be removed in rw.ents array.
	 * @returns rw
	 */
	this.removeEnt = function(entNum) {
		me.ents.splice(entNum, 1);
		return me;
	};
	// Map Entities
	this.maps = {}; 
	/**
	 * @class
	 */
	this.map = function(name, path, extention, xDim, yDim) {
		this.name = name;
		this.path = path;
		this.extention = extention;
		this.active = false;
		this.width = xDim;
		this.height = yDim;
		this.x = 0;
		this.y = 0;
		this.z = -1;
		/**
		 * Moves map the specified number of pixels.
		 * @param x Number of pixels map is to be moved horizontally.
		 * @param y Number of pixels map is to be moved vertically.
		 * @param z Optional: Number of depth levels map is to be moved. <br>
		 * If unspecified, 0 will be assumed.
		 */
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
				mapArea.style.backgroundImage = "url('"+resPath+"maps/"+this.path+"."+this.extention+"')";
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
		/**
		 * Ends map sub-chain and returns to rw chain.
		 * @returns rw
		 */
		this.end = function() {
			return me;
		}

	}
	this.newMap = function(name, map, ext, dimX, dimY) {
		me.maps[name] = new me.map(name, map, ext, dimX, dimY);
		return me.maps[name];
	}
	this.removeMap = function(map) {
		if (me.maps[map]) delete me.maps[map];
		return me;
	}
	// Rule Entities
	this.rules = {};
	this.ruleList = [[],[],[],[]];
	/**
	 * @class
	 */
	this.rule = function(active, pos) {
		this.active = active;
		this.pos = pos;
	}
	this.newRule = function(name, rule) {
		me.rules[name] = rule;
		me.ruleList[rule.base.pos].push(name);
		return me;
	}
	this.removeRule = function(rule) {
		if (me.rules[rule]) {
			var pos = me.rules[rule].base.pos;
			var list = me.ruleList[pos];
			for (var x=0, len=list.length; x<len; x++) {
				if (list[x]==rule) {
					list.splice(x,1);
					break;
				};
			};
			delete me.rules[rule];
		}
		return me;
	}
	var states = {};
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

	/**
	 * Saves current gamestate. <br>
	 * <strong>CAUTION:</strong> Will blindly overwrite a state of the same name.
	 * @param name Name of saved state.
	 * @returns rw
	 */
	this.saveState = function(name) {
		states[name] = {};
		states[name]['ents']=copy(me.ents,me);
		states[name]['maps']=copy(me.maps,me);
		states[name]['rules']=copy(me.rules,me);
		states[name]['ruleList']=copy(me.ruleList,me);
		var len = states[name].ents.length;
		for (var x=0; x<len; x++) {
			states[name]['ents'][x].base.ent = states[name].ents[x];
		}
		return me;
	}
	this.isState=function(name) {
		if (states[name]) return true;
		return false;
	};
	/**
	 * Loads specified state.
	 * @param name Name of state to load
	 * @returns rw
	 */
	this.loadState = function(name) {
		if (states[name]) {
			me.ents = copy(states[name].ents,name);
			me.maps = copy(states[name].maps,name);
			me.rules = copy(states[name].rules,name);
			me.ruleList = copy(states[name].ruleList,name);
			for (map in me.maps) {
				if (me.maps[map].active==true) me.maps[map].display();
			}
			var len = me.ents.length;
			for (var x=0;x<len;x++) {
				me.ents[x].base.ent = me.ents[x];
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
		return me;
	}
	/**
	 * Removes specified state
	 * @param name Name of state to remove
	 * @returns rw
	 */
	this.rmState = function(name) {
		if (states[name]) delete states[name];
		return me;
	}
	// At start and end function assignments
	var doAtStart=null;
	this.atStart=function(arg) {
		doAtStart=arg;
		return me;
	};
	var doAtEnd=null;
	this.atEnd=function(arg) {
		doAtEnd=arg;
		return me;
	};
	// Ajax function, durr
	this.ajax = function(targ, func) {
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
		return me;
	}
	// Inline function call function
	this.func = function() {
		return me;
	}

	//AUDIO!!! NEW!!! Needs work integrating all browsers
	this.soundBank = {};
	this.sounds = [];
	this.playSound = function(sound) {
		var len = me.sounds.length;
		me.sounds[len] = document.createElement('audio');
		me.sounds[len].src = me.soundBank[sound].src;
		me.sounds[len].play();
		return me;
	}
	/** 
	 * Adds a new sound to rw.soundBank.
	 * @param name Name of new sound.
	 * @param src Filepath to sound file. 
	 */
	this.newSound = function(name, src) {
		me.soundBank[name] = new Audio(src);
		return me;
	}

	//Maybe Fixed now?
	// Image pre-loader
	var preImg = [];
	this.using = function(path, ext, imgArray) {
		var len = imgArray.length;
		for (var x=0; x<len;x++) {
			preImg[preImg.length] = new Image();
			preImg[preImg.length-1].src = resPath+path+'/'+imgArray[x]+'.'+ext;
		}
		return me;
	}
	// Changes Cursor
	this.changeCursor = function(cursor) {
		document.getElementById('board').style.cursor="url('"+resPath+cursor+"')";
		return me;
	}
	// Browser-specific values, runs at init
	this.browser = {
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
	/**
	 * Removes all DOM content from the board
	 * @returns rw
	 */
	this.wipeBoard = function() {
		var board = document.getElementById('board');
		var total = board.childNodes.length;
		for (var x=0; x<total; x++) {
			board.removeChild(board.childNodes[0]);
		}
		return me;
	}
	/**
	 * Removes all ents
	 * @returns rw
	 */
	this.wipeEnts = function() {
		me.ents = [];
		return me;
	}
	/**
	 * Removes all maps
	 * @returns rw
	 */
	this.wipeMaps = function() {
		me.maps = {};
		return me;
	}
	/**
	 * Removes all rules
	 * @returns rw
	 */
	this.wipeRules = function() {
		me.rules = {};
		me.ruleList = [[],[],[],[]];
		return me;
	}
	/**
	 * Removes all ents, maps and rules. Removes all DOM content from board.
	 * @returns rw
	 */
	this.wipeAll = function() {
		me.wipeBoard().wipeEnts().wipeMaps().wipeRules();
		return me;
	}
	/**
	 * Initializes Rosewood and creates the game board element.
	 * @param dimX Width of board, in pixels.
	 * @param dimY Height of board, in pixels.
	 * @param Optional, target id of element to attach board to. <br>
	 * If unspecified, the board will be attached to the body.
	 * @returns rw
	 */
	this.init = function(dimX, dimY, target) {
		me.browser.check();
		var board = document.createElement('div');
		board.id = 'board';
		X = dimX;
		Y = dimY;
		board.style.width = dimX+'px';
		board.style.height = dimY+'px';
		board.style.overflow = 'hidden';
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
		//document.onmousemove = mousePos;
		//document.onmousedown = mouseDown;
		//document.onmouseup = mouseUp;
		board.onmousemove = mousePos;
		board.onmousedown = mouseDown;
		board.onmouseup = mouseUp;
		return me;
	}
	/**
	 * Starts the gameloop
	 * @returns rw
	 */
	this.start = function() {
		if (runGame==false) {
			runGame = true;
			curT = setTimeout('rw.run()', speed);
		}
		return me;
	}
	/**
	 * Stops the gameloop. Resets current time to 0.
	 * @returns rw
	 */
	this.stop = function() {
		runGame = false;
		return me;
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
	/**
	 * Gameloop function, not called directly.
	 */
	this.run = function() {
		var startTime = new Date();
		for (var x=0; x<me.sounds.length; x++) {
			if (me.sounds[x].ended) {
				me.sounds.splice(x,1);
				x--;
			}
		}
		// At start function, if any
		if (typeof(doAtStart)=='function') {
			doAtStart();
			doAtStart=null;
		}
		// Rule position 0, pre-update loop
		for (var x=0, l=me.ruleList[0].length; x<l; x++) {
			if (me.rules[me.ruleList[0][x]].base.active) {
				me.rules[me.ruleList[0][x]].rule();
			};
		};
		var toBeRemoved = [];
		var len = me.ents.length;
		// Update Loop
		if (keyChange==true) {
			for (var x=0; x<len; x++) {
				var curEnt = me.ents[x];
				if (curEnt.base.active==true) {
					if (curEnt.keyChange) {
						curEnt.keyChange();
					}
					var currentSprite = curEnt.update(curEnt.base.posX1(), curEnt.base.posX2(), curEnt.base.posY1(), curEnt.base.posY2());
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
				var curEnt = me.ents[x];
				if (curEnt.base.active==true) {
					var currentSprite = curEnt.update(curEnt.base.posX1(), curEnt.base.posX2(), curEnt.base.posY1(), curEnt.base.posY2());
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
		// Rule position 1, pre-collision loop
		for (var x=0, l=me.ruleList[1].length; x<l; x++) {
			if (me.rules[me.ruleList[1][x]].base.active) {
				me.rules[me.ruleList[1][x]].rule();
			};
		};
		// Collision Loop
		var cols = [];
		// For each ent
		for (var x=0;x<len;x++) {
			var eX=me.ents[x];
			if (eX.base.active&&eX.hitMap) {
				for (var y=x+1;y<len;y++) {
					var eY=me.ents[y];
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
								};
							}
						}
					}
				}
			}
			if (eX.postCol) eX.postCol();
		}
		if (cols.length>0) {
			for (var x=0; x<cols.length; x++) {
				if (me.ents[cols[x][0][0]].gotHit) {
					if (me.ents[cols[x][0][0]].gotHit(cols[x][1][1],cols[x][0][1],cols[x][1][0])==false) {
						toBeRemoved.push(cols[x][0][0])
					}
				}
				if (me.ents[cols[x][1][0]].gotHit) {
					if (me.ents[cols[x][1][0]].gotHit(cols[x][0][1],cols[x][1][1],cols[x][0][0])==false) {
						toBeRemoved.push(cols[x][1][0])
					}
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
		// Rule position 2, pre-redraw loop
		for (var x=0, l=me.ruleList[2].length; x<l; x++) {
			if (me.rules[me.ruleList[2][x]].base.active) {
				me.rules[me.ruleList[2][x]].rule();
			};
		};
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
		// Rule position 3, end of frame
		for (var x=0, l=me.ruleList[3].length; x<l; x++) {
			if (me.rules[me.ruleList[3][x]].base.active) {
				me.rules[me.ruleList[3][x]].rule();
			};
		};
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
};
window['rw']=rw;
window['rw']['run']=rw.run;
window['rw']['loadState']=rw.loadState;
