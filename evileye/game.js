var heroX = 0;
var heroY = 0;
var eyeCounter = 0;
var hero = function(name) {
	this.base = new rw.ent(name, 'hero', 'd1', 'gif', 30, 30);
	this.heading = 'd';
	this.update = function() {
		heroX = this.base.posX1();
		heroY = this.base.posY1();
		if (rw.key('la')) {
			if (this.base.posX1()>4) {
				this.base.move(-5,0).heading = 'l';
			}
		}
		if (rw.key('ra')) {
			if (this.base.posX2()<496) {
				this.base.move(5,0).heading = 'r';
			}
		}
		if (rw.key('ua')) {
			if (this.base.posY1()>4) {
				this.base.move(0,-5).heading = 'u';
			}
		}
		if (rw.key('da')) {
			if (this.base.posY2()<496) {
				this.base.move(0,5).heading = 'd';
			}
		}
	}
	this.keyChangeSprite = function() {
		if (rw.key('la')) {
			this.heading = 'l';
		}
		if (rw.key('ra')) {
			this.heading = 'r';
		}
		if (rw.key('ua')) {
			this.heading = 'u';
		}
		if (rw.key('da')) {
			this.heading = 'd';
		}
		this.base.changeSprite(this.heading+1);
	}
	this.hitMap = [[name,0,0,30,30]];
	this.iGotHit = function(by) {
		if (by=='eye') {
			this.base.hide();
			alert ("You survived "+eyeCounter+" Evil Eyes");
			return false;
		}
	}
}

var eye = function(name, heading) {
	this.base = new rw.ent(name, 'eye', heading+1, 'gif', 30, 30);
	this.heading = heading;
	this.update = function() {
		switch (this.heading) {
			case 'd':
				if (this.base.posY1()<heroY) {
					this.base.move(0,5);
				} else {
					if (this.base.posX1()>heroX) {
						this.heading = 'l';
						this.base.changeSprite('l1');
					} else {
						this.heading = 'r';
						this.base.changeSprite('r1');
					}
				}
				break;
			case 'l':
				if (this.base.posX1()>heroX) {
					this.base.move(-5,0);
				} else {
					if (this.base.posY1()>heroY) {
						this.heading = 'u';
						this.base.changeSprite('u1');
					} else {
						this.heading = 'd';
						this.base.changeSprite('d1');
					}
				}
				break;
			case 'u':
				if (this.base.posY1()>heroY) {
					this.base.move(0,-5);
				} else {
					if (this.base.posX1()<heroX) {
						this.heading = 'r';
						this.base.changeSprite('r1');
					} else {
						this.heading = 'l';
						this.base.changeSprite('l1');
					}
				}
				break;
			case 'r':
				if (this.base.posX1()<heroX) {
					this.base.move(5,0);
				} else {
					if (this.base.posY1()<heroY) {
						this.heading = 'd';
						this.base.changeSprite('d1');
					} else {
						this.heading = 'u';
						this.base.changeSprite('u1');
					}
				}
				break;
		}
	}
	this.hitMap = [['eye',10,10,20,20]];
	this.iGotHit = function(by) {
		if ((by=='eye')||(by=='hero')) {
			this.base.hide();
			return false;
		}
	}
}

var makeEyes = function() {
	this.base = new rw.rule(true);
	this.counter = 20;
	this.rule = function() {
		if (this.counter>0) {
			this.counter--;
		} else {
			this.counter = 20;
			var x = Math.round(470*Math.random());
			var y = Math.round(470*Math.random());
			if (Math.random()>0.5) {
				if (Math.random()>0.5) {
					var heading = 'd';
				} else {
					var heading = 'u';
				}
			} else {
				if (Math.random()>0.5) {
					var heading = 'l';
				} else {
					var heading = 'r';
				}
			}
			rw.newEnt(new eye(('eye'+eyeCounter++), heading))
				.base.display(heading+'1', x, y, y);
		}
	}
}


var startGame = function() {
	rw.init(500,500)
	.newRule('makeEyes', new makeEyes())
	.newEnt(new hero('hero'))
		.base.display('d1',250,250,250)
		.end()
	.start();
}
