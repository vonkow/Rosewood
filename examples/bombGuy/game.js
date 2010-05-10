rw.newSound('boom', 'exp.ogg');

var lagTimer = function() {
	this.base = rw.ent('lag', '','','',150,20);
	this.update = function() {
		this.base.detach();
		this.base.attach(document.createTextNode('Lag: '+rw.getLag()+'(ms)'));
	}
}
var Wall = function(name, wallType, xDim, yDim) {
	this.base = rw.ent(name, ' ', ' ', ' ', xDim, yDim);
	this.hitMap = [[wallType,['bman'],0,0,xDim,yDim]];
	this.update = function() {};
}

var blast = function(name) {
	this.base = rw.ent(name, 'blast', 'blast', 'gif', 40, 32);
	this.countdown = 25;
	this.update = function() {
		this.base.posZ = this.base.posY;
		this.countdown -= 1;
		if (this.countdown<=0) {
			this.base.hide();
			return false;
		}
	}
	this.hitMap = [['blast',['bman','baddie','bomb'],0,0,40,32]];
}
var bomb = function(name, typeClass) {
	this.base = rw.ent(name, 'bomb', '1', 'gif', 40, 32);
	this.countdown = 150;
	this.blastSize = 2;
	//this.spin = 0;
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
		//this.base.rotate(this.spin++);
		this.countdown -= 1;
		if (this.countdown<=0) {
			rw.playSound('boom');
			// Do Explody stuff!
			var tPos = [this.base.posX, this.base.posY];
			var lPos = [this.base.posX, this.base.posY];
			var bPos = [this.base.posX, this.base.posY];
			var rPos = [this.base.posX, this.base.posY];
			var tempLen = rw.ents.length;
			rw.newEnt(new blast('blast'+tempLen))
				.base.display('c',tPos[0],tPos[1],tPos[1]);
			for (var x=0;x<this.blastSize;x++) {
				tPos[1] -= this.base.height;
				lPos[0] += this.base.width;
				bPos[1] += this.base.height;
				rPos[0] -= this.base.width;
				var tail = '';
				if (x+1==this.blastSize) {
					tail = 'T';
				}
				rw.newEnt(new blast('blast'+rw.ents.length+"_"+this.base.name))
					.base.display('u'+tail, tPos[0], tPos[1], tPos[1]).end()
				.newEnt(new blast('blast'+rw.ents.length+"_"+this.base.name))
					.base.display('l'+tail, lPos[0], lPos[1], lPos[1]).end()
				.newEnt(new blast('blast'+rw.ents.length+"_"+this.base.name))
					.base.display('d'+tail, bPos[0], bPos[1], bPos[1]).end()
				.newEnt(new blast('blast'+rw.ents.length+"_"+this.base.name))
					.base.display('r'+tail, rPos[0], rPos[1], rPos[1]);
			}
			this.base.hide();
			return false;
		}
	}
	this.hitMap = [[typeClass,['blast'],0,0,40,32]];
	this.gotHit = function(by) {
		if (by=='blast') {
			this.countdown = 1;
		}
	}
}
var badguy = function(name) {
	this.base = rw.ent(name, 'bman', 'l', 'gif', 40, 64);
	this.speed = 5;
	this.ticker = 0;
	this.heading = 'l';
	this.countdown = 100;
	this.inactive = function() {
		this.countdown--;
		if (this.countdown<1) {
			this.base.display('Wr',200,100,132);
		}
	}
	this.update = function() {
		if (this.heading == 'r') {
			if (this.ticker < 39) {
				this.ticker++;
				this.base.velX = this.speed;
			} else {
				this.base.velX = 0;
				this.heading = 'l';
				this.base.changeSprite('Wl');
			}
		} else {
			if (this.ticker > 0) {
				this.ticker--;
				this.base.velX = -this.speed;
			} else {
				this.base.velX = 0;
				this.heading = 'r';
				this.base.changeSprite('Wr');
			}
		}
	}
	this.hitMap = [['baddie',['blast','bman'],0,0,40,64]];
	this.gotHit = function(by) {
		if (by=='blast') {
			this.base.hide();
			return false;
		}
	}
}
// Custom Game Entity (calls rw.ent for this.base, requires this.update function)
var bman = function(name, typeClass, heading) {
	this.base = rw.ent(name, 'bman', 'u', 'gif', 40, 64);
	this.maxSpeed = 5;
	this.bombCooldown = 5;
	this.bombMax = 15;
	this.bombs = [];
	this.heading = 'u';
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
		if (rw.key('sp')) {
			if (this.bombCooldown == 5) {
				if (this.bombs.length < this.bombMax) {
					this.bombCooldown = 0;
					this.bombs[this.bombs.length] = 150;
					var tempLen = rw.ents.length;
					var tempX = this.base.posX;
					var tempY = this.base.posY+32;
					rw.newEnt(new bomb('bomb'+tempLen))
						.base.display('1', tempX, tempY, tempY);
				}
			}
		}
		if (rw.key('la')) {
			this.base.velX += -this.maxSpeed;
		}
		if (rw.key('ra')) {
			this.base.velX += this.maxSpeed;
		}
		if (rw.key('ua')) {
			this.base.velY += -this.maxSpeed;
		}
		if (rw.key('da')) {
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
	this.keyChange = function() {
		var entDiv = document.getElementById('ent_'+name);
		if (rw.key('la')) {
			this.heading = 'l';
			this.base.changeSprite('Wl');
		} else if (rw.key('ua')) {
			this.heading = 'u';
			this.base.changeSprite('Wu');
		} else if (rw.key('ra')) {
			this.heading = 'r';
			this.base.changeSprite('Wr');
		} else if (rw.key('da')) {
			this.heading = 'd';
			this.base.changeSprite('Wd');
		} else {
			this.base.changeSprite(this.heading);
		}
	}
	this.hitMap = [['bman',['blast','baddie','lWall','rWall','tWall','dWall'],0,0,40,64]];
	this.gotHit = function(by) {
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
			rw.wipeAll()
			.loadState('test')
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
				rw.maps['map1'].move(-1, 0);
			} else {
				this.forward = false;
			}
		} else {
			if (this.currentOffset<0) {
				this.currentOffset++;
				rw.maps['map1'].move(1, 0);
			} else {
				this.forward = true;
			}
		}
	}
}

// Ajax Function
var addGuy = function(resp) {
	rw.newEnt(new badguy(resp.name))
		.base.display(resp.display, resp.posX, resp.posY, resp.posZ);
}

// Begin Game Function
function startGame() {
	rw.using('bman','gif', ['u','d','l','r','Wu','Wd','Wl','Wr'])
	.using('blast','gif',['c','u','d','l','r','uT','dT','lT','rT'])
	.using('bomb','gif',['1','2','3'])
	.using('maps','jpg',['map'])
	.init(600, 600, 'game').changeCursor('blank.cur').tilesOn(20, 20)
	.newMap('map1', 'map', 'jpg', 1200, 600).display().end()
	.newRule('rule1', new endGameRule(true))
	.newRule('rule2', new mapRule())
	.newEnt(new badguy('baddie_1')).base.end()
	.newEnt(new badguy('baddie_2')).base.display( 'Wr', 150, 200, 232).end()
	.newEnt(new badguy('baddie_3')).base.display( 'Wr', 100, 400, 432).end()
	.newEnt(new badguy('baddie_4')).base.display( 'Wr', 50, 500, 532).end()
	.newEnt(new bman('Goon0', 'bman')).base.display( 'u', 50, 50, 82).end()
	.newEnt(new  Wall('tWall1', 'tWall', 99, 1)).base.display('blank', 251, 250, 0).end()
	.newEnt(new  Wall('rWall1', 'rWall', 1, 99)).base.display('blank', 350, 251, 0).end()
	.newEnt(new  Wall('lWall1', 'lWall', 1, 99)).base.display('blank', 250, 250, 0).end()
	.newEnt(new  Wall('dWall1', 'dWall', 99, 1)).base.display('blank', 250, 350, 0).end()
	.newEnt(new lagTimer()).base.display('blank',0,0,0).end()
	.start()
	.saveState('test')
	.ajax('ajaxtest.json', 'addGuy');
}
