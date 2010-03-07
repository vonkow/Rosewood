var ball = function(name, dirX, dirY) {
	this.base = new rw.ent(name, 'ball', 'ball', 'png', 40, 40);
	this.dirX = dirX;
	this.dirY = dirY;
	this.speed = 5;
	this.hit = false;
	this.update = function() {
		this.hit = false;
		switch (this.dirX) {
			case 'r':
				this.base.velX = this.speed;
				break;
			case 'l':
				this.base.velX = -this.speed;
				break;
		}
		switch (this.dirY) {
			case 'd':
				this.base.velY = this.speed;
				break;
			case 'u':
				this.base.velY = -this.speed;
				break;
		}
	}
	this.iGotHit = function(by) {
		switch (by) {
			case 'rWall':
				this.dirX = 'l';
				this.base.velX = rw.Xdim-this.base.posX2();
				break;
			case 'lWall':
				this.dirX = 'r';
				this.base.velX = 1+(-this.base.posX1());
				break;
			case 'tWall':
				this.dirY = 'd';
				this.base.velY = 1+(-this.base.posY1());
				break;
			case 'bWall':
				this.dirY = 'u';
				this.base.velY = rw.Ydim-this.base.posY2();
				break;
			case 'ball':
				if (this.hit==false) {
					if (this.dirX=='r') {
						this.dirX = 'l';
					} else {
						this.dirX = 'r';
					}
					if (this.dirY=='u') {
						this.dirY = 'd';
					} else {
						this.dirY = 'u';
					}
					this.base.velX = -this.base.velX;
					this.base.velY = -this.base.velY;
					this.hit = true;
				}
				break;
		}
	}
}
function startGame() {
	rw.init(600, 600)
	.newEnt(new ball('ball_1', 'r', 'd'), 'ball', 362, 426, 50)
	.newEnt(new ball('ball_2', 'l', 'd'), 'ball', 347, 32, 50)
	.newEnt(new ball('ball_3', 'r', 'u'), 'ball', 209, 433, 50)
	.newEnt(new ball('ball_4', 'l', 'u'), 'ball', 65, 145, 50)
	.newEnt(new ball('ball_5', 'r', 'd'), 'ball', 413, 221, 50)
	.newEnt(new ball('ball_6', 'l', 'd'), 'ball', 165, 370, 50)
	.newEnt(new ball('ball_7', 'r', 'u'), 'ball', 250, 245, 50)
	.newEnt(new ball('ball_8', 'l', 'u'), 'ball', 453, 399, 50)
	.newEnt(new  rw.lib.ent('tWall', 'tWall', 599, 1), 'blank', 0, 0, 0)
	.newEnt(new  rw.lib.ent('rWall', 'rWall', 1, 599), 'blank', 600, 0, 0)
	.newEnt(new  rw.lib.ent('lWall', 'lWall', 1, 599), 'blank', 0, 1, 0)
	.newEnt(new  rw.lib.ent('bWall', 'bWall', 599, 1), 'blank', 1, 600, 0)
	.func(alert('Bouncy Ball Test 2'))
	.start();
}
