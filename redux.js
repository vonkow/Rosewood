var rw = {}; // The Rosewood Object


rw.ents = []; // Game Entities
rw.curT = 0; // RunLoop current Timer
rw.globT = 0; // RunLoop global Timer
rw.runGame = true; // RunLoop or stop
rw.keys = {};
rw.keys.la = false;
rw.keys.ua = false;
rw.keys.ra = false;
rw.keys.da = false;

rw.keyDown = function(e) {
	var ev = e ? e : window.event;
	switch(ev.keyCode) {
		case 37:
			rw.keys.la = true;
			break;
		case 38:
			rw.keys.ua = true;
			break;
		case 39:
			rw.keys.ra = true;
			break;
		case 40:
			rw.keys.da = true;
			break;
	}
}
rw.keyUp = function(e) {
	var ev = e ? e : window.event;
	switch(ev.keyCode) {
		case 37:
			rw.keys.la = false;
			break;
		case 38:
			rw.keys.ua = false;
			break;
		case 39:
			rw.keys.ra = false;
			break;
		case 40:
			rw.keys.da = false;
			break;
	}
}

// Keydown/up event listeners
document.onkeydown=rw.keyDown;
document.onkeyup=rw.keyUp;

// RunLoop Function
rw.run = function() {
	for(var x=0; x<rw.ents.length; x++) {
		var currentSprite = rw.ents[x].update();
		if (currentSprite==false) {
			killSprite(rw.ents[x]);
			x--;
		}
	}
	if (rw.runGame==true) {
		rw.curT = setTimeout('rw.run()', 50);
	}
}

// Game Entity Base Factory
rw.ent = function(name, sprites, spriteExt, width, height, heading) {
	this.name = name;
	this.sprites = sprites;
	this.spriteExt = spriteExt
	this.width = width;
	this.height = height;
	this.posX = 0;
	this.posY = 0;
	this.heading = heading;
	this.active = false; //Bool for is piece in play
}

// Display Entity Function, sets ent.base.active to true
rw.displayEnt = function(ent, locX, locY) {
	var newEnt = document.createElement('div');
	newEnt.id = 'ent_'+ent.base.name;
	newEnt.style.width = ent.base.width;
	newEnt.style.height = ent.base.height;
	newEnt.style.backgroundImage = "url('sprites/"+ent.base.sprites+"/"+ent.base.heading+"."+ent.base.spriteExt+"')";
	newEnt.style.backgroundRepeat = 'no-repeat';
	newEnt.style.backgroundPosition = 'center';
	newEnt.style.position = 'absolute';
	newEnt.style.left = locX+'px';
	newEnt.style.top = locY+'px';
	ent.base.posX = locX;
	ent.base.posY = locY;
	ent.base.active = true;
	document.getElementById('board').appendChild(newEnt);
}


// Custom Game Entity (calls rw.ent for this.base, requires this.update function)
var goon = function(name, heading) {
	this.base = new rw.ent(name, 'goon', 'gif', 38, 46, heading);
	this.maxSpeed = 2;
	this.update = function() {
		if (this.base.active==true) {
			var entDiv = document.getElementById('ent_'+name);
			if (rw.keys.la==true) {
				this.base.posX = this.base.posX-this.maxSpeed;
			}
			if (rw.keys.ra==true) {
				this.base.posX = this.base.posX+this.maxSpeed;
			}
			if (rw.keys.ua==true) {
				this.base.posY = this.base.posY-this.maxSpeed;
			}
			if (rw.keys.da==true) {
				this.base.posY = this.base.posY+this.maxSpeed;
			}
			entDiv.style.left = this.base.posX+'px';
			entDiv.style.top = this.base.posY+'px';
		}
	}
}



// Begin Game Function
function startGame() {
	var board = document.createElement('div');
	board.id = 'board';
	document.getElementsByTagName('body')[0].appendChild(board);
	rw.ents[rw.ents.length] = new goon('Goon', 'u');
	rw.displayEnt(rw.ents[0], 50, 50);
	rw.run();
}