var ball = function(name, dirX, dirY) {
	this.base = new rw.ent(name, 'ball', 'ball', 'png', 40, 40);
	this.dirX = dirX;
	this.dirY = dirY;
	this.hit = false;
	this.hitMap=[['ball',0,20,40,20,20,0],['ball',0,20,40,20,20,40]];
	this.update = function() {
		this.hit = false;
		switch (this.dirX) {
			case 'r':
				this.base.move(1,0);
				break;
			case 'l':
				this.base.move(-1,0);
				break;
		}
		switch (this.dirY) {
			case 'd':
				this.base.move(0,1);
				break;
			case 'u':
				this.base.move(0,-1);
				break;
		}
	}
	this.gotHit = function(by) {
		switch (by) {
			case 'rWall':
				this.dirX = 'l';
				//this.base.move(2,0);
				break;
			case 'lWall':
				this.dirX = 'r';
				//this.base.move(-2,0);
				break;
			case 'tWall':
				this.dirY = 'd';
				//this.base.move(0,2);
				break;
			case 'bWall':
				this.dirY = 'u';
				//this.base.move(0,-2);
				break;
			case 'ball':
				if (this.hit==false) {
					if (this.dirX=='r') {
						this.dirX = 'l';
						this.base.move(-2,0);
					} else {
						this.dirX = 'r';
						this.base.move(2,0);
					}
					if (this.dirY=='u') {
						this.dirY = 'd';
						this.base.move(0,2);
					} else {
						this.dirY = 'u';
						this.base.move(0,-2);
					}
					this.hit = true;
				}
				break;
		}
	}
}
function startGame() {
	rw.init(600, 600)
	.newEnt(new  rw.lib.ent('tWall', 'tWall', 600, 10)).base.display( 'blank', 0, 0, 0).end()
	.newEnt(new  rw.lib.ent('rWall', 'rWall', 10, 600)).base.display( 'blank', 600, 0, 0).end()
	.newEnt(new  rw.lib.ent('lWall', 'lWall', 10, 600)).base.display( 'blank', -10, 0, 0).end()
	.newEnt(new  rw.lib.ent('bWall', 'bWall', 600, 10)).base.display( 'blank', 0, 600, 0).end()
	.newEnt(new ball('ball_1', 'r', 'd')).base.display( 'ball', 362, 426, 50).end()
	.newEnt(new ball('ball_2', 'l', 'd')).base.display( 'ball', 347, 32, 50).end()
	.newEnt(new ball('ball_3', 'r', 'u')).base.display( 'ball', 209, 433, 50).end()
	.newEnt(new ball('ball_4', 'l', 'u')).base.display( 'ball', 65, 145, 50).end()
	.newEnt(new ball('ball_5', 'r', 'd')).base.display( 'ball', 413, 221, 50).end()
	.newEnt(new ball('ball_6', 'l', 'd')).base.display( 'ball', 165, 370, 50).end()
	.newEnt(new ball('ball_7', 'r', 'u')).base.display( 'ball', 250, 245, 50).end()
	.newEnt(new ball('ball_8', 'l', 'u')).base.display( 'ball', 453, 399, 50).end()
	.func(alert('Bouncy Ball Test 2'))
	.start();
}
