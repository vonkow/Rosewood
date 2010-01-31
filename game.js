var Wall = function(name, wallType, xDim, yDim) {
	this.base = new rw.ent(name, wallType, ' ', ' ', xDim, yDim, 'l');
	this.update = function() {};

}

var blast = function(name, typeClass, heading, tail) {
	this.base = new rw.ent(name, typeClass, 'goon', 'gif', 38, 46, heading);
	this.countdown = 10;
	this.update = function() {
		this.countdown -= 1;
		if (this.countdown<=0) {
			this.base.hide();
			return false;
		}
	}
}
var bomb = function(name, typeClass, heading) {
	this.base = new rw.ent(name, typeClass, 'goon', 'gif', 38, 46, heading);
	this.countdown = 100;
	this.blastSize = 2;
	this.update = function() {
		this.countdown -= 1;
		if (this.countdown<=0) {
			// Do Explody stuff!
			var tPos = [this.base.posX, this.base.posY];
			var lPos = [this.base.posX, this.base.posY];
			var bPos = [this.base.posX, this.base.posY];
			var rPos = [this.base.posX, this.base.posY];
			var tempLen = rw.ents.length;
			rw.ents[tempLen] = new blast('blast'+tempLen, 'blast', 'd');
			rw.ents[tempLen].base.posX = tPos[0];
			rw.ents[tempLen].base.posY = tPos[1];
			rw.ents[tempLen].base.display();
			for (var x=0;x<this.blastSize;x++) {
				tPos[1] -= this.base.height;
				lPos[0] += this.base.width;
				bPos[1] += this.base.height;
				rPos[0] -= this.base.width;
				var tempLen = rw.ents.length;
				rw.ents[tempLen] = new blast('blast'+tempLen, 'blast', 'u');
				rw.ents[tempLen].base.posX = tPos[0];
				rw.ents[tempLen].base.posY = tPos[1];
				rw.ents[tempLen].base.display();
				var tempLen = rw.ents.length;
				rw.ents[tempLen] = new blast('blast'+tempLen, 'blast', 'l');
				rw.ents[tempLen].base.posX = lPos[0];
				rw.ents[tempLen].base.posY = lPos[1];
				rw.ents[tempLen].base.display();
				var tempLen = rw.ents.length;
				rw.ents[tempLen] = new blast('blast'+tempLen, 'blast', 'd');
				rw.ents[tempLen].base.posX = bPos[0];
				rw.ents[tempLen].base.posY = bPos[1];
				rw.ents[tempLen].base.display();
				var tempLen = rw.ents.length;
				rw.ents[tempLen] = new blast('blast'+tempLen, 'blast', 'r');
				rw.ents[tempLen].base.posX = rPos[0];
				rw.ents[tempLen].base.posY = rPos[1];
				rw.ents[tempLen].base.display();

			}

			this.base.hide();
			return false;
		}
	}
}
// Custom Game Entity (calls rw.ent for this.base, requires this.update function)
var bman = function(name, typeClass, heading) {
	this.base = new rw.ent(name, typeClass, 'goon', 'gif', 38, 46, heading);
	this.maxSpeed = 2;
	this.update = function() {
		var entDiv = document.getElementById('ent_'+name);
		this.base.velX = 0;
		this.base.velY = 0;
		if (rw.keys.sp==true) {
			var tempLen = rw.ents.length;
			rw.ents[tempLen] = new bomb('bomb'+tempLen, 'bomb', 'u');
			rw.ents[tempLen].base.posX = this.base.posX;
			rw.ents[tempLen].base.posY = this.base.posY;
			rw.ents[tempLen].base.display();
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
		entDiv.style.left = this.base.posX+'px';
		entDiv.style.top = this.base.posY+'px';
		entDiv.style.zIndex = this.base.posZ
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
			this.base.hide();
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
	}
}

// Create new map function
function newMap() {
	
}

// Begin Game Function
function startGame() {
	rw.init();
	var board = document.createElement('div');
	board.id = 'board';
	board.style.width='600px';
	board.style.height='300px';
	document.getElementsByTagName('body')[0].appendChild(board);
	// Move cursor hiding logic to rw.init()
	document.getElementsByTagName('body')[0].style.cursor="url(sprites/blank.cur), wait";
	rw.ents[rw.ents.length] = new bman('Goon0', 'bman', 'u');
	rw.ents[0].base.posX = 50;
	rw.ents[0].base.posY = 50;
	rw.ents[0].base.display();
	rw.ents[rw.ents.length] = new Wall('lWall1', 'lWall', 1, 500);
	rw.ents[1].base.posX = 100;
	rw.ents[1].base.posY = 100;
	rw.ents[1].base.display();
	rw.ents[rw.ents.length] = new Wall('tWall1', 'tWall', 499, 1);
	rw.ents[2].base.posX = 101;
	rw.ents[2].base.posY = 100;
	rw.ents[2].base.display();
	rw.start();
}
