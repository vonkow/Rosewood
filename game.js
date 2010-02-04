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
			rw.ents[tempLen].base.display();
			for (var x=0;x<this.blastSize;x++) {
				tPos[1] -= this.base.height;
				lPos[0] += this.base.width;
				bPos[1] += this.base.height;
				rPos[0] -= this.base.width;
				var tempLen = rw.ents.length;
				var tail = false;
				if (x+1==this.blastSize) {
					tail = true;
				}
				rw.newEnt(new blast('blast'+tempLen, 'blast', 'u', tail), true, tPos[0], tPos[1]);
				tempLen = rw.ents.length;
				rw.newEnt(new blast('blast'+tempLen, 'blast', 'l', tail), true, lPos[0], lPos[1]);
				tempLen = rw.ents.length;
				rw.newEnt(new blast('blast'+tempLen, 'blast', 'd', tail), true, bPos[0], bPos[1]);
				tempLen = rw.ents.length;
				rw.newEnt(new blast('blast'+tempLen, 'blast', 'r', tail), true, rPos[0], rPos[1]);
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
					rw.newEnt(new bomb('bomb'+tempLen, 'bomb'), true, this.base.posX, this.base.posY+32);
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
		this.base.posX = this.base.posX+this.base.velX;
		this.base.posY = this.base.posY+this.base.velY;
		//For Now
		this.base.posZ = this.base.posY;
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
	
	//NEW COLLISION TEST FUNCTION
	this.iGotHit = function(by) {
		if (by=='blast') {
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


function newRule(active) {
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
				rw.maps[0].base.offset(-1, 0);
			} else {
				this.forward = false;
			}
		} else {
			if (this.currentOffset<0) {
				this.currentOffset++;
				rw.maps[0].base.offset(1, 0);
			} else {
				this.forward = true;
			}
		}
	}
}

function newMap(name, ext) {
	this.base = new rw.map(name, name, ext, 1200, 600);
}

// Begin Game Function
function startGame() {
	rw.init(600, 600);
	rw.tilesOn(20, 20);

	// MAP TEST
	rw.maps[0] = new newMap('map2', 'jpg');
	rw.maps[0].base.render();
	// END MAP TEST

	rw.rules['rule1'] = new newRule(true);
	rw.rules['rule2'] = new mapRule(true);

	rw.newEnt(new bman('Goon0', 'bman', 'u'), true, 50, 50);
	/* Uncomment for stress test 
	rw.newEnt(new bman('Goon1', 'bman', 'u'), true, 51, 51);
	rw.newEnt(new bman('Goon2', 'bman', 'u'), true, 52, 52);
	rw.newEnt(new bman('Goon3', 'bman', 'u'), true, 53, 53);
	rw.newEnt(new bman('Goon4', 'bman', 'u'), true, 54, 54);
	End stress test */
	rw.newEnt(new  Wall('tWall1', 'tWall', 99, 1), true, 251, 250);
	rw.newEnt(new  Wall('rWall1', 'rWall', 1, 99), true, 350, 251);
	rw.newEnt(new  Wall('lWall1', 'lWall', 1, 99), true, 250, 250);
	rw.newEnt(new  Wall('dWall1', 'dWall', 99, 1), true, 250, 350);
	rw.start();
}
