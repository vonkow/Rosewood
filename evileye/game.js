var heroX = 0;
var heroY = 0;
var heroXTile = 0;
var heroYTile = 0;
var eyeCounter = 0;
var eyesDead = 0;
var itemCounter = 0;
var fatima = false;
var fatimaCountdown = 0;
var blind = false;
var blindEyeCountdown = 0;
var slow = false;
var slowCountdown = 0;
var badLuck = false;
var badLuckCountdown = 0;

var hero = function(name) {
	this.base = new rw.ent(name, 'hero', 'd1', 'gif', 30, 30);
	this.heading = 'd';
	this.update = function() {
		heroX = this.base.posX1();
		heroY = this.base.posY1();
		heroXTile = this.base.tileX;
		heroYTile = this.base.tileY;
		if (rw.key('la')) {
			if (this.base.posX1()>4) {
				this.base.move(-5,0).heading = 'l';
			}
		}
		if (rw.key('ra')) {
			if (this.base.posX2()<476) {
				this.base.move(5,0).heading = 'r';
			}
		}
		if (rw.key('ua')) {
			if (this.base.posY1()>4) {
				this.base.move(0,-5).heading = 'u';
			}
		}
		if (rw.key('da')) {
			if (this.base.posY2()<476) {
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
		if (!fatima) {
			if (by=='eye') {
				this.base.hide();
				alert ("You killed "+eyesDead+" Evil Eyes");
				return false;
			}
		}
	}
}

var eye = function(name, heading) {
	this.base = new rw.ent(name, 'eye', heading+1, 'gif', 30, 30);
	this.heading = heading;
	this.update = function() {
		if ((this.base.posX1()<0)||(this.base.posX2()>480)||(this.base.posY1()<0)||(this.base.posY2()>480)) {
			eyesDead++;
			this.base.hide();
			return false;
		}
		switch (this.heading) {
			case 'd':
				if ((this.base.posY1()<heroY)||blind) {
					if (!slow) {
						this.base.move(0,5);
					} else {
						this.base.move(0,2);
					}
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
				if ((this.base.posX1()>heroX)||blind) {
					if (!slow) {
						this.base.move(-5,0);
					} else {
						this.base.move(-2,0);
					}
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
				if ((this.base.posY1()>heroY)||blind) {
					if (!slow) {
						this.base.move(0,-5);
					} else {
						this.base.move(0,-2);
					}
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
				if ((this.base.posX1()<heroX)||blind) {
					if (!slow) {
						this.base.move(5,0);
					} else {
						this.base.move(2,0);
					}
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
			eyesDead++;
			this.base.hide();
			return false;
		}
	}
}

var item = function() {
	this.base = new rw.ent('item'+itemCounter++, 'items', 'question', 'gif', 30, 30);
	this.switchCounter = 0;
	this.lifeCounter = 200;
	this.counter = Math.round(Math.random()*3);
	this.update = function() {
		if (this.lifeCounter>0) {
			this.lifeCounter--;
		} else {
			this.base.hide();
			return false;
		}
		if (this.switchCounter<4) {
			this.switchCounter++;
		} else {
			this.switchCounter = 0;
			if (this.counter<3) {
				this.counter++;
			} else {
				this.counter = 0;
			}
			switch (this.counter) {
				case 0:
					this.base.changeSprite('fatima');
					break;
				case 1:
					this.base.changeSprite('blindeye');
					break;
				case 2:
					this.base.changeSprite('slow');
					break;
				case 3:
					this.base.changeSprite('badluck');
					break;
			}
		}
	}
	this.hitMap = [['item',0,0,30,30]];
	this.iGotHit = function(by) {
		if (by=='hero') {
			switch (this.counter) {
				case 0:
					fatima = true;
					fatimaCountdown = 100;
					rw.newEnt(new fatimaNotification())
						.base.display('fatima',0,0,0);
					break;
				case 1:
					blind = true;
					blindEyeCountdown = 100;
					rw.newEnt(new blindEyeNotification())
						.base.display('blindeye',0,0,0);
					break;
				case 2:
					slow = true;
					slowCountdown = 100;
					rw.newEnt(new slowNotification())
						.base.display('slow',0,0,0);
					break;
				case 3:
					badLuck = true;
					badLuckCountdown = 50;
					rw.newEnt(new badLuckNotification())
						.base.display('badluck',0,0,0);
					eyeGenerator();
					eyeGenerator();
					eyeGenerator();
					eyeGenerator();
					eyeGenerator();
					break;
			}
			this.base.hide();
			return false;
		}
	}
}

var fatimaNotification = function() {
	this.base = new rw.ent('fatimanotification'+itemCounter, 'notifications', 'fatima', 'gif', 90, 30);
	this.update = function() {
		if (!fatima) {
			this.base.hide();
			return false;
		}
	}
}

var fatimaTimer = function() {
	this.base = new rw.rule(true);
	this.rule = function() {
		if (fatimaCountdown>0) {
			fatimaCountdown--;
		} else {
			fatima = false;
		}
	}
}

var blindEyeNotification = function() {
	this.base = new rw.ent('blindeyenotification'+itemCounter, 'notifications', 'blindeye', 'gif', 90, 30);
	this.update = function() {
		if (!blind) {
			this.base.hide();
			return false;
		}
	}
}

var blindEyeTimer = function() {
	this.base = new rw.rule(true);
	this.rule = function() {
		if (blindEyeCountdown>0) {
			blindEyeCountdown--;
		} else {
			blind = false;
		}
	}
}

var slowNotification = function() {
	this.base = new rw.ent('slownotification'+itemCounter, 'notifications', 'slow', 'gif', 90, 30);
	this.update = function () {
		if (!slow) {
			this.base.hide();
			return false;
		}
	}
}

var slowTimer = function() {
	this.base = new rw.rule(true);
	this.rule = function() {
		if (slowCountdown>0) {
			slowCountdown--;
		} else {
			slow = false;
		}
	}
}

var badLuckNotification = function() {
	this.base = new rw.ent('badlucknotification'+itemCounter, 'notifications', 'badluck', 'gif', 90, 30);
	this.update = function() {
		if (!badLuck) {
			this.base.hide();
			return false;
		}
	}
}

var badLuckTimer = function() {
	this.base = new rw.rule(true);
	this.rule = function() {
		if (badLuckCountdown>0) {
			badLuckCountdown--;
		} else {
			badLuck = false;
		}
	}
}

var pickTile = function() {
	var xTile = Math.round(15*Math.random());
	var yTile = Math.round(15*Math.random());
	if ((xTile>heroXTile-2)&&(xTile<heroXTile+2)) {
		if ((yTile>heroYTile-2)&&(yTile<heroYTile+2)) {
			var newTiles = pickTile();
			return newTiles;
		}
		else {
			return [xTile, yTile];
		}
	} else {
		return [xTile, yTile];
	}
}

var eyeGenerator = function() {
	var newTiles = pickTile()
	var xTile = 30*newTiles[0];
	var yTile = 30*newTiles[1];
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
		.base.display(heading+'1', xTile, yTile, yTile);
}

var makeEyes = function() {
	this.base = new rw.rule(true);
	this.counter = 20;
	this.rule = function() {
		if (this.counter>0) {
			this.counter--;
		} else {
			this.counter = 20;
			eyeGenerator();
		}
	}
}

var dropItem = function() {
	this.base = new rw.rule(true);
	this.rule = function() {
		if (Math.random()>0.995) {
			var newTiles = pickTile()
			var xPos = 30*newTiles[0];
			var yPos = 30*newTiles[1];
			rw.newEnt(new item())
				.base.display('question', xPos, yPos, yPos);
		}
	}
}

var startGame = function() {
	rw.init(480,480).tilesOn(30,30)
	.newRule('makeEyes', new makeEyes())
	.newRule('fatima', new fatimaTimer())
	.newRule('blindeye', new blindEyeTimer())
	.newRule('slow', new slowTimer())
	.newRule('badluck', new badLuckTimer())
	.newRule('dropItem', new dropItem())
	.newEnt(new hero('hero'))
		.base.display('d1',240,240,240)
		.end()
	.start();
}
