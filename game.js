var Wall = function(name, wallType, xDim, yDim) {
	this.base = new rw.ent(name, wallType, ' ', ' ', xDim, yDim, 'l');
	this.update = function() {};
}

var blast = function(name, typeClass, heading, tail) {
	if (tail==true) {
		heading = heading+'T';
	}
	this.base = new rw.ent(name, typeClass, 'blast', 'gif', 40, 32, heading);
	this.countdown = 25;
	this.update = function() {
		this.base.posZ = this.base.posY;
		this.countdown -= 1;
		if (this.countdown<=0) {
			this.base.hide();
			return false;
		}
	}
}
var bomb = function(name, typeClass) {
	this.base = new rw.ent(name, typeClass, 'bomb', 'gif', 40, 32, '1');
	this.countdown = 150;
	this.blastSize = 2;
	this.update = function() {
		if (this.countdown == 150) {
			this.base.posZ = this.base.posY;
			this.base.changeSprite('2');
		} else if (this.countdown == 125) {
			this.base.changeSprite('1');
		} else if (this.countdown == 100) {
			this.base.changeSprite('2');
		} else if (this.countdown == 75) {
			this.base.changeSprite('3');
		} else if (this.countdown == 50) {
			this.base.changeSprite('2');
		} else if (this.countdown == 25) {
			this.base.changeSprite('3');
		}
		this.countdown -= 1;
		if (this.countdown<=0) {
			// Do Explody stuff!
			var tPos = [this.base.posX, this.base.posY];
			var lPos = [this.base.posX, this.base.posY];
			var bPos = [this.base.posX, this.base.posY];
			var rPos = [this.base.posX, this.base.posY];
			var tempLen = rw.ents.length;
			rw.ents[tempLen] = new blast('blast'+tempLen, 'blast', 'c');
			rw.ents[tempLen].base.posX = tPos[0];
			rw.ents[tempLen].base.posY = tPos[1];
			rw.ents[tempLen].base.display('c');
			for (var x=0;x<this.blastSize;x++) {
				tPos[1] -= this.base.height;
				lPos[0] += this.base.width;
				bPos[1] += this.base.height;
				rPos[0] -= this.base.width;
				var tempLen = rw.ents.length;
				var tail = '';
				if (x+1==this.blastSize) {
					tail = 'T';
				}
				rw.newEnt(new blast('blast'+tempLen+"_"+this.base.name, 'blast', 'u', tail), 'u'+tail, tPos[0], tPos[1]);
				tempLen = rw.ents.length;
				rw.newEnt(new blast('blast'+tempLen+"_"+this.base.name, 'blast', 'l', tail), 'l'+tail, lPos[0], lPos[1]);
				tempLen = rw.ents.length;
				rw.newEnt(new blast('blast'+tempLen+"_"+this.base.name, 'blast', 'd', tail), 'd'+tail, bPos[0], bPos[1]);
				tempLen = rw.ents.length;
				rw.newEnt(new blast('blast'+tempLen+"_"+this.base.name, 'blast', 'r', tail), 'r'+tail, rPos[0], rPos[1]);
			}
			this.base.hide();
			return false;
		}
	}
	this.iGotHit = function(by) {
		if (by=='blast') {
			this.countdown = 1;
		}
	}
}
var badguy = function(name) {
	this.base = new rw.ent(name, 'baddie', 'bman', 'gif', 40, 64, 'l');
	this.speed = 5;
	this.ticker = 0;
	this.update = function() {
		if (this.base.heading == 'r') {
			if (this.ticker < 39) {
				this.ticker++;
				this.base.velX = this.speed;
				this.base.moving = true;
			} else {
				this.base.velX = 0;
				this.base.heading = 'l';
				this.base.changeSprite('Wl');
			}
		} else {
			if (this.ticker > 0) {
				this.ticker--;
				this.base.velX = -this.speed;
				this.base.moving = true;
			} else {
				this.base.velX = 0;
				this.base.heading = 'r';
				this.base.changeSprite('Wr');
			}
		}
	}
	this.iGotHit = function(by) {
		if (by=='blast') {
			this.base.hide();
			return false;
		}
	}
}
// Custom Game Entity (calls rw.ent for this.base, requires this.update function)
var bman = function(name, typeClass, heading) {
	this.base = new rw.ent(name, typeClass, 'bman', 'gif', 40, 64, heading);
	this.maxSpeed = 5;
	this.bombCooldown = 5;
	this.bombMax = 15;
	this.bombs = [];
	this.update = function() {
		this.base.velX = 0;
		this.base.velY = 0;
		if (this.bombCooldown < 5) {
			this.bombCooldown += 1;
		}
		if (this.bombs.length > 0) {
			for (var x=0; x<this.bombs.length; x++) {
				if (this.bombs[x] > 0) {
					this.bombs[x] -= 1;
				} else {
					this.bombs.splice(x, 1);
				}
			}
		}
		if (rw.keys.sp==true) {
			if (this.bombCooldown == 5) {
				if (this.bombs.length < this.bombMax) {
					this.bombCooldown = 0;
					this.bombs[this.bombs.length] = 150;
					var tempLen = rw.ents.length;
					rw.newEnt(new bomb('bomb'+tempLen, 'bomb'), '1', this.base.posX, this.base.posY+32);
				}
			}
		}
		if (rw.keys.la==true) {
			this.base.velX += -this.maxSpeed;
		}
		if (rw.keys.ra==true) {
			this.base.velX += this.maxSpeed;
		}
		if (rw.keys.ua==true) {
			this.base.velY += -this.maxSpeed;
		}
		if (rw.keys.da==true) {
			this.base.velY += this.maxSpeed;
		}
		this.base.velZ = this.base.velY;
	}
	// THis will be the funct that calls the new this.base.changeSprite();
	// heading and moving will possible be split into seperate functions
	// This even brings up the fact that heading and moving may not be part of this.base
	// Detach some of keyChangeSprite and move to engine core, this much code for each ent is unacceptable!
	// Fix logic of displaying non-moving sprites
//!!!!!!!!!!!!! Move most of keyCHangeSprite to ent.base with an rw.keys loop: 
//		where args are sent to ent and keys.
	this.keyChangeSprite = function() {
		var entDiv = document.getElementById('ent_'+name);
		if (rw.keys.la==true) {
			this.base.heading = 'l';
			this.base.moving = true;
			this.base.changeSprite('Wl');
		} else if (rw.keys.ua==true) {
			this.base.heading = 'u';
			this.base.moving = true;
			this.base.changeSprite('Wu');
		} else if (rw.keys.ra==true) {
			this.base.heading = 'r';
			this.base.moving = true;
			this.base.changeSprite('Wr');
		} else if (rw.keys.da==true) {
			this.base.heading = 'd';
			this.base.moving = true;
			this.base.changeSprite('Wd');
		} else {
			this.base.moving = false;
			this.base.changeSprite(this.base.heading);
		}
	}
	this.iGotHit = function(by) {
		if ((by=='blast')||(by=='baddie')) {
			rw.rules['rule1'].dead = true;
			this.base.hide();
			return false;
		}
		if (by=='lWall') {
			if (this.base.velX > 0) {
				this.base.posX += -this.base.velX;
			}
		}
		if (by=='tWall') {
			if (this.base.velY > 0) {
				this.base.posY += -this.base.velY;
			}
		}
		if (by=='rWall') {
			if (this.base.velX < 0) {
				this.base.posX += -this.base.velX;
			}
		}
		if (by=='dWall') {
			if (this.base.velY < 0) {
				this.base.posY += -this.base.velY;
			}
		}
	}
}

function endGameRule(active) {
	this.base = new rw.rule(true);
	this.dead = false;
	this.rule = function() {
		if (this.dead==true) {
			rw.runGame = false;
		}
	}
}

function mapRule() {
	this.base = new rw.rule(true);
	this.currentOffset = 0;
	this.forward = true;
	this.rule = function() {
		if (this.forward==true) {
			if (this.currentOffset>-600) {
				this.currentOffset--;
				rw.maps['map1'].offset(-1, 0);
			} else {
				this.forward = false;
			}
		} else {
			if (this.currentOffset<0) {
				this.currentOffset++;
				rw.maps['map1'].offset(1, 0);
			} else {
				this.forward = true;
			}
		}
	}
}

// Ajax Function
var addGuy = function(resp) {
	rw.newEnt(new badguy(resp.name), resp.display, resp.posX, resp.posY, resp.posZ);
}

// Begin Game Function
function startGame() {
	rw.using('bman','gif', ['u','d','l','r','Wu','Wd','Wl','Wr'])
	.using('blast','gif',['c','u','d','l','r','uT','dT','lT','rT'])
	.using('bomb','gif',['1','2','3'])
	.using('maps/map2','jpg',['map2'])
	.init(600, 600).changeCursor('blank.cur').tilesOn(20, 20)
	.newMap('map1', 'map2', 'jpg', 1200, 600, true)
	.newRule('rule1', new endGameRule(true))
	.newRule('rule2', new mapRule())
	.newEnt(new badguy('baddie_1'), 'Wr', 200, 100, 132)
	.newEnt(new badguy('baddie_2'), 'Wr', 150, 200, 232)
	.newEnt(new badguy('baddie_3'), 'Wr', 100, 400, 432)
	.newEnt(new badguy('baddie_4'), 'Wr', 50, 500, 532)
	.newEnt(new bman('Goon0', 'bman', 'u'), 'u', 50, 50, 82)
	.newEnt(new  Wall('tWall1', 'tWall', 99, 1), 'blank', 251, 250, 0)
	.newEnt(new  Wall('rWall1', 'rWall', 1, 99), 'blank', 350, 251, 0)
	.newEnt(new  Wall('lWall1', 'lWall', 1, 99), 'blank', 250, 250, 0)
	.newEnt(new  Wall('dWall1', 'dWall', 99, 1), 'blank', 250, 350, 0)
	.start()
	.ajax('ajaxtest.json', 'addGuy');
	/* Uncomment and put before start() for stress test 
	rw.newEnt(new bman('Goon1', 'bman', 'u'), true, 51, 51);
	rw.newEnt(new bman('Goon2', 'bman', 'u'), true, 52, 52);
	rw.newEnt(new bman('Goon3', 'bman', 'u'), true, 53, 53);
	rw.newEnt(new bman('Goon4', 'bman', 'u'), true, 54, 54);
	End stress test */
}
