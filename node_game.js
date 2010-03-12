var Wall = function(name, wallType, xDim, yDim) {
	this.base = new rw.ent(name, wallType, ' ', ' ', xDim, yDim);
	this.hitMap = [[wallType,0,0,xDim,yDim]];
	this.update = function() {};
}

var dot = function(name, type) {
	this.base = new rw.ent(name, type, 'ball', 'png', 40, 40);
	this.up = false;
	this.down = false;
	this.left = false;
	this.right = false;
	this.count = 20;
	this.hitMap = [[type,0,0,40,40]];
	this.update = function() {
		if (this.count>0) {
			this.count--;
		} else {
			this.count = 20;
			var rand = Math.random();
			if (rand<=0.5) {
				if (rand<=0.25) {
					if (this.down==true) {
						this.down=false;
					} else if (this.up==false) {
						this.up=true;
					}
				} else {
					if (this.up==true) {
						this.up=false;
					} else if (this.down==false) {
						this.down=true;
					}
				}
			} else {
				if (rand<=0.75) {
					if (this.right==true) {
						this.right=false;
					} else if (this.left==false) {
						this.left=true;
					}
				} else {
					if (this.left==true) {
						this.left=false;
					} else if (this.right==false) {
						this.right=true;
					}
				}
			}
		}
		// Up/Down Logic
		if (this.up==true) {
			this.base.velY = -1;
		} else if (this.down==true) {
			this.base.velY = 1;
		} else {
			this.base.velY = 0;
		}
		// Left/Right Logic
		if (this.left==true) {
			this.base.velX = -1;
		} else if (this.right==true) {
			this.base.velX = 1;
		} else {
			this.base.velX = 0;
		}
	};
	this.iGotHit = function(by) {
			switch (by) {
			case 'rWall':
				this.right = false;
				this.left = true;
				this.base.velX = -1;
				break;
			case 'lWall':
				this.left = false;
				this.right= true;
				this.base.velX = 1;
				break;
			case 'tWall':
				this.up = false;
				this.down = true;
				this.base.velY = 1;
				break;
			case 'bWall':
				this.down = false;
				this.up = true;
				this.base.velY = -1;
				break;
		}
}
}

// GAME START FUNCTION
var startGame = function() {
	rw.using('maps/map2', 'jpg',['map2'])
	.init(600,600).changeCursor('blank.cur').tilesOn(20, 20)
	.newMap('map1', 'map2', 'jpg', 1200, 600, true)
	.newEnt(new dot('dot1', 'dot'), 'ball', 280, 280, 280)
	.newEnt(new  Wall('tWall', 'tWall', 599, 1), 'blank', 0, 0, 0)
	.newEnt(new  Wall('rWall', 'rWall', 1, 599), 'blank', 600, 0, 0)
	.newEnt(new  Wall('lWall', 'lWall', 1, 599), 'blank', 0, 1, 0)
	.newEnt(new  Wall('bWall', 'bWall', 599, 1), 'blank', 1, 600, 0)
	.start()
}
