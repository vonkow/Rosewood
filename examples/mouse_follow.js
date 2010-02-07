
var ball = function(name) {
	this.base = new rw.ent(name, 'ball', 'ball', 'png', 40, 40, 'ball');
	this.update = function() {
		this.base.velX = 0;
		this.base.velY = 0;
		if (this.base.posX2()<rw.Xdim) {
			if (this.base.posX1()+5 < rw.mouse.x) {
				this.base.velX = 5;
			} else if (this.base.posX1() < rw.mouse.x) {
				this.base.velX = rw.mouse.x-this.base.posX1();
			}
		}
		if (this.base.posX1()>0) {
			if (this.base.posX1()-5 > rw.mouse.x) {
				this.base.velX = -5;
			} else if (this.base.posX1() > rw.mouse.x) {
				this.base.velX = -(this.base.posX1()-rw.mouse.x);
			}
		}
		if (this.base.posY2()<rw.Ydim) {
			if (this.base.posY1()+5 < rw.mouse.y) {
				this.base.velY = 5;
			} else if (this.base.posY1() < rw.mouse.y) {
				this.base.velY = rw.mouse.y-this.base.posY1();
			}
		}
		if (this.base.posY1()>0) {
			if (this.base.posY1()-5 > rw.mouse.y) {
				this.base.velY = -5;
			} else if (this.base.posY1() > rw.mouse.y) {
				this.base.velY = -(this.base.posY1()-rw.mouse.y);
			}
		}
	};
}

function startGame() {
	rw.init(600, 600)
	.newEnt(new ball('ball_1'), true, 280, 280, 50)
	.call(alert('Mouse Follow Test'))
	.start();
}
