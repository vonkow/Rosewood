var Wall = function(name, wallType, xDim, yDim) {
	this.base = new rw.ent(name, wallType, ' ', ' ', xDim, yDim, 'l');
	this.update = function() {};
}

var ball = function(name, dirX, dirY) {
	this.base = new rw.ent(name, 'ball', 'ball', 'png', 40, 40, 'ball');
	this.dirX = dirX;
	this.dirY = dirY;
	this.speed = 5;
	this.hit = false;
	this.update = function() {
		this.base.moving = true;
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
				this.base.velX = rw.Xdim-(this.base.posX+this.base.width);
				break;
			case 'lWall':
				this.dirX = 'r';
				this.base.velX = -this.base.posX+1;
				break;
			case 'tWall':
				this.dirY = 'd';
				this.base.velY = -this.base.posY+1;
				break;
			case 'bWall':
				this.dirY = 'u';
				this.base.velY = rw.Ydim-(this.base.posY+this.base.height);
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
	.newEnt(new ball('ball_1', 'r', 'd'), true, 362, 426, 50)
	.newEnt(new ball('ball_2', 'l', 'd'), true, 347, 32, 50)
	.newEnt(new ball('ball_3', 'r', 'u'), true, 209, 433, 50)
	.newEnt(new ball('ball_4', 'l', 'u'), true, 65, 145, 50)
	.newEnt(new ball('ball_5', 'r', 'd'), true, 413, 221, 50)
	.newEnt(new ball('ball_6', 'l', 'd'), true, 165, 370, 50)
	.newEnt(new ball('ball_7', 'r', 'u'), true, 250, 245, 50)
	.newEnt(new ball('ball_8', 'l', 'u'), true, 453, 399, 50)
	.newEnt(new  Wall('tWall', 'tWall', 599, 1), true, 0, 0, 0)
	.newEnt(new  Wall('rWall', 'rWall', 1, 599), true, 600, 0, 0)
	.newEnt(new  Wall('lWall', 'lWall', 1, 599), true, 0, 1, 0)
	.newEnt(new  Wall('bWall', 'bWall', 599, 1), true, 1, 600, 0)
	.call(alert('Bouncy Ball Test 2'))
	.start();
}
