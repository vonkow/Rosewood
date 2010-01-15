// Custom Game Entity (calls rw.ent for this.base, requires this.update function)
var goon = function(name, heading) {
	this.base = new rw.ent(name, 'goon', 'gif', 38, 46, heading);
	this.maxSpeed = 2;
	this.update = function() {
		var entDiv = document.getElementById('ent_'+name);
		this.base.velX = 0;
		this.base.velY = 0;
		if (rw.keys.la==true) {
			this.base.velX += -this.maxSpeed;
			rw.checkBounds(this, 'l');
		}
		if (rw.keys.ra==true) {
			this.base.velX += this.maxSpeed;
			rw.checkBounds(this, 'r');
		}
		if (rw.keys.ua==true) {
			this.base.velY += -this.maxSpeed;
			rw.checkBounds(this, 'u');
		}
		if (rw.keys.da==true) {
			this.base.velY += this.maxSpeed;
			rw.checkBounds(this, 'd');
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
	rw.ents[rw.ents.length] = new goon('Goon0', 'u');
	rw.ents[0].base.posX = 50;
	rw.ents[0].base.posY = 50;
	rw.ents[0].base.display();
	rw.ents[rw.ents.length] = new goon('Goon1', 'u');
	rw.ents[1].base.posX = 51;
	rw.ents[1].base.posY = 51;
	rw.ents[1].base.display();
	for(var x=0;x<38;x++) {
		var num = rw.ents.length;
		rw.ents[num] = new goon ('Goon'+num, 'u');
		rw.ents[num].base.posX = 50+num;
		rw.ents[num].base.posY = 50+num;
		rw.ents[num].base.display();
	}
	rw.bars[rw.bars.length] = new rw.bar('r', 300, 300, 350, 350, 1)
	rw.start();
}
