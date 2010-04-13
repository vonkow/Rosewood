var ball = function(name, dirX, dirY) {
	this.base = new rw.ent(name, 'ball', 'ball', 'png', 40, 40);
	this.dirX = dirX;
	this.dirY = dirY;
	this.speed = 5;
	this.hitMap=[['ball',0,0,40,40]];
	this.update = function() {
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
	this.gotHit = function(by) {
		switch (by) {
			case 'rWall':
				this.dirX = 'l';
				this.base.velX = rw.Xdim()-this.base.posX2();
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
				this.base.velY = rw.Ydim()-this.base.posY2();
				break;
		}
	}
}
function startGame() {
	rw.init(600, 600)
	.func(new function() {
		var balls = [['r','d',362,426],['l','d',347,32],['r','u',209,433],['l','u',65,145]];
		for (var x=0; x<4; x++) {
			rw.newEnt(new ball('ball_'+x, balls[x][0], balls[x][1]))
				.base.display('ball', balls[x][2], balls[x][3], 50)
				.end();
		}
	})
	.newEnt(new ball('ball_4', 'r', 'd'))
		.base.display('ball', 413, 221, 50)
		.end()
	.newEnt(new ball('ball_5', 'l', 'd'))
		.base.display('ball', 165, 370, 50).end()
	.newEnt(
		new ball('ball_6', 'r', 'u'))
			.base.display('ball', 250, 245, 50)
			.end()
	.newEnt(new ball('ball_7', 'l', 'u')).base.display('ball', 453, 399, 50).end()
	.newEnt(new  rw.lib.ent('tWall', 'tWall', 599, 1)).base.display('blank', 0, 0, 0).end()
	.newEnt(new  rw.lib.ent('rWall', 'rWall', 1, 599)).base.display('blank', 600, 0, 0).end()
	.newEnt(new  rw.lib.ent('lWall', 'lWall', 1, 599)).base.display('blank', 0, 1, 0).end()
	.newEnt(new  rw.lib.ent('bWall', 'bWall', 599, 1)).base.display('blank', 1, 600, 0).end()
	.func(alert('Bouncy Ball Test'))
	.start();
}
