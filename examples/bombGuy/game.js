rw.newSound('boom', 'exp.ogg');

function lagTimer() {
	var me = this;
	me.base = new rw.ent('lag', '','','',150,20);
	me.update = function() {
		me.base.detach();
		me.base.attach(document.createTextNode('Lag: '+rw.getLag()+'(ms)'));
	}
}

function Wall(name, wallType, xDim, yDim) {
	var me = this;
	me.base = new rw.ent(name, ' ', ' ', ' ', xDim, yDim);
	me.hitMap = [[wallType,['bman'],0,0,xDim,yDim]];
	me.update = function() {};
}

function blast(name) {
	var me = this;
	me.base = new rw.ent(name, 'blast', 'blast', 'gif', 40, 32);
	me.countdown = 25;
	me.update = function() {
		me.base.posZ = me.base.posY;
		me.countdown -= 1;
		if (me.countdown<=0) {
			me.base.hide();
			return false;
		}
	}
	me.hitMap = [['blast',['bman','baddie','bomb'],0,0,40,32]];
}

function bomb(name, typeClass) {
	var me = this;
	me.base = new rw.ent(name, 'bomb', '1', 'gif', 40, 32);
	me.countdown = 150;
	me.blastSize = 2;
	me.update = function() {
		if (me.countdown == 150) {
			me.base.posZ = me.base.posY;
			me.base.changeSprite('2');
		} else if (me.countdown == 125) {
			me.base.changeSprite('1');
		} else if (me.countdown == 100) {
			me.base.changeSprite('2');
		} else if (me.countdown == 75) {
			me.base.changeSprite('3');
		} else if (me.countdown == 50) {
			me.base.changeSprite('2');
		} else if (me.countdown == 25) {
			me.base.changeSprite('3');
		}
		me.countdown -= 1;
		if (me.countdown<=0) {
			rw.playSound('boom');
			// Do Explody stuff!
			var tPos = [me.base.posX, me.base.posY];
			var lPos = [me.base.posX, me.base.posY];
			var bPos = [me.base.posX, me.base.posY];
			var rPos = [me.base.posX, me.base.posY];
			var tempLen = rw.ents.length;
			rw.newEnt(new blast('blast'+tempLen))
				.base.display('c',tPos[0],tPos[1],tPos[1]);
			for (var x=0;x<me.blastSize;x++) {
				tPos[1] -= me.base.height;
				lPos[0] += me.base.width;
				bPos[1] += me.base.height;
				rPos[0] -= me.base.width;
				var tail = '';
				if (x+1==me.blastSize) {
					tail = 'T';
				}
				rw.newEnt(new blast('blast'+rw.ents.length+"_"+me.base.name))
					.base.display('u'+tail, tPos[0], tPos[1], tPos[1]).end()
				.newEnt(new blast('blast'+rw.ents.length+"_"+me.base.name))
					.base.display('l'+tail, lPos[0], lPos[1], lPos[1]).end()
				.newEnt(new blast('blast'+rw.ents.length+"_"+me.base.name))
					.base.display('d'+tail, bPos[0], bPos[1], bPos[1]).end()
				.newEnt(new blast('blast'+rw.ents.length+"_"+me.base.name))
					.base.display('r'+tail, rPos[0], rPos[1], rPos[1]);
			}
			me.base.hide();
			return false;
		}
	}
	me.hitMap = [[typeClass,['blast'],0,0,40,32]];
	me.gotHit = function(by) {
		if (by=='blast') {
			me.countdown = 1;
		}
	}
}

function badguy(name) {
	var me = this;
	me.base = new rw.ent(name, 'bman', 'l', 'gif', 40, 64);
	me.speed = 5;
	me.ticker = 0;
	me.heading = 'l';
	me.countdown = 100;
	me.inactive = function() {
		me.countdown--;
		if (me.countdown<1) {
			me.base.display('Wr',200,100,132);
		}
	}
	me.update = function() {
		if (me.heading == 'r') {
			if (me.ticker < 39) {
				me.ticker++;
				me.base.velX = me.speed;
			} else {
				me.base.velX = 0;
				me.heading = 'l';
				me.base.changeSprite('Wl');
			}
		} else {
			if (me.ticker > 0) {
				me.ticker--;
				me.base.velX = -me.speed;
			} else {
				me.base.velX = 0;
				me.heading = 'r';
				me.base.changeSprite('Wr');
			}
		}
	}
	me.hitMap = [['baddie',['blast','bman'],0,0,40,64]];
	me.gotHit = function(by) {
		if (by=='blast') {
			me.base.hide();
			return false;
		}
	}
}

// Custom Game Entity (calls rw.ent for this.base, requires this.update function)
function bman(name, typeClass, heading) {
	var me = this;
	me.base = new rw.ent(name, 'bman', 'u', 'gif', 40, 64);
	me.maxSpeed = 5;
	me.bombCooldown = 5;
	me.bombMax = 15;
	me.bombs = [];
	me.heading = 'u';
	me.update = function() {
		me.base.velX = 0;
		me.base.velY = 0;
		if (me.bombCooldown < 5) {
			me.bombCooldown += 1;
		}
		if (me.bombs.length > 0) {
			for (var x=0; x<me.bombs.length; x++) {
				if (me.bombs[x] > 0) {
					me.bombs[x] -= 1;
				} else {
					me.bombs.splice(x, 1);
				}
			}
		}
		if (rw.key('sp')) {
			if (me.bombCooldown == 5) {
				if (me.bombs.length < me.bombMax) {
					me.bombCooldown = 0;
					me.bombs[me.bombs.length] = 150;
					var tempLen = rw.ents.length;
					var tempX = me.base.posX;
					var tempY = me.base.posY+32;
					rw.newEnt(new bomb('bomb'+tempLen))
						.base.display('1', tempX, tempY, tempY);
				}
			}
		}
		if (rw.key('la')) {
			me.base.velX += -me.maxSpeed;
		}
		if (rw.key('ra')) {
			me.base.velX += me.maxSpeed;
		}
		if (rw.key('ua')) {
			me.base.velY += -me.maxSpeed;
		}
		if (rw.key('da')) {
			me.base.velY += me.maxSpeed;
		}
		me.base.velZ = me.base.velY;
	}
	// THis will be the funct that calls the new this.base.changeSprite();
	// heading and moving will possible be split into seperate functions
	// This even brings up the fact that heading and moving may not be part of this.base
	// Detach some of keyChangeSprite and move to engine core, this much code for each ent is unacceptable!
	// Fix logic of displaying non-moving sprites
//!!!!!!!!!!!!! Move most of keyCHangeSprite to ent.base with an rw.keys loop: 
//		where args are sent to ent and keys.
	me.keyChange = function() {
		var entDiv = document.getElementById('ent_'+name);
		if (rw.key('la')) {
			me.heading = 'l';
			me.base.changeSprite('Wl');
		} else if (rw.key('ua')) {
			me.heading = 'u';
			me.base.changeSprite('Wu');
		} else if (rw.key('ra')) {
			me.heading = 'r';
			me.base.changeSprite('Wr');
		} else if (rw.key('da')) {
			me.heading = 'd';
			me.base.changeSprite('Wd');
		} else {
			me.base.changeSprite(me.heading);
		}
	}
	me.hitMap = [['bman',['blast','baddie','lWall','rWall','tWall','dWall'],0,0,40,64]];
	me.gotHit = function(by) {
		if ((by=='blast')||(by=='baddie')) {
			rw.rules['rule1'].dead = true;
			me.base.hide();
			return false;
		}
		if (by=='lWall') {
			if (me.base.velX > 0) {
				me.base.posX += -me.base.velX;
			}
		}
		if (by=='tWall') {
			if (me.base.velY > 0) {
				me.base.posY += -me.base.velY;
			}
		}
		if (by=='rWall') {
			if (me.base.velX < 0) {
				me.base.posX += -me.base.velX;
			}
		}
		if (by=='dWall') {
			if (me.base.velY < 0) {
				me.base.posY += -me.base.velY;
			}
		}
	}
}

function endGameRule(active) {
	var me = this;
	me.base = new rw.rule(true,3);
	me.dead = false;
	me.rule = function() {
		if (me.dead==true) {
			rw.wipeAll()
			.loadState('test')
		}
	}
}

function mapRule() {
	var me = this;
	me.base = new rw.rule(true,2);
	me.currentOffset = 0;
	me.forward = true;
	me.rule = function() {
		if (me.forward==true) {
			if (me.currentOffset>-600) {
				me.currentOffset--;
				rw.maps['map1'].move(-1, 0);
			} else {
				me.forward = false;
			}
		} else {
			if (me.currentOffset<0) {
				me.currentOffset++;
				rw.maps['map1'].move(1, 0);
			} else {
				me.forward = true;
			}
		}
	}
}

// Ajax Function
function addGuy(resp) {
	rw.newEnt(new badguy(resp.name))
		.base.display(resp.display, resp.posX, resp.posY, resp.posZ);
}

// Begin Game Function
var startGame=function() {
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

startGame();
