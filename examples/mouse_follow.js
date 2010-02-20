
var ball = function(name) {
	this.base = new rw.ent(name, 'ball', 'ball', 'png', 40, 40, 'ball');
	this.update = function(x1, x2, y1, y2) {
		this.base.velX = 0;
		this.base.velY = 0;
		if (x2<rw.Xdim) {
			if (x1+5 < rw.mouse.x) {
				this.base.velX = 5;
			} else if (x1 < rw.mouse.x) {
				this.base.velX = rw.mouse.x-x1;
			}
		}
		if (x1>0) {
			if (x1-5 > rw.mouse.x) {
				this.base.velX = -5;
			} else if (x1 > rw.mouse.x) {
				this.base.velX = -(x1-rw.mouse.x);
			}
		}
		if (y2<rw.Ydim) {
			if (y1+5 < rw.mouse.y) {
				this.base.velY = 5;
			} else if (y1 < rw.mouse.y) {
				this.base.velY = rw.mouse.y-y1;
			}
		}
		if (y1>0) {
			if (y1-5 > rw.mouse.y) {
				this.base.velY = -5;
			} else if (y1 > rw.mouse.y) {
				this.base.velY = -(y1-rw.mouse.y);
			}
		}
	};
}

function startGame() {
	rw.init(600, 600)
	.newEnt(new ball('ball_1'), true, 280, 280, 50)
	.func(alert('Mouse Follow Test'))
	.start();
}
