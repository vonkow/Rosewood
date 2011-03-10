var heroX = 0, heroY = 0,
	heroXTile = 0, heroYTile = 0,
	eyeCounter = 0, eyesDead = 0,
	itemCounter = 0,
	fatima = false, fatimaCountdown = 0,
	blind = false, blindEyeCountdown = 0,
	slow = false, slowCountdown = 0,
	badLuck = false, badLuckCountdown = 0,
	endGame = false;

var hero = function() {
	this.base = new rw.Ent('hero', 'hero.d1', 30, 30);
	this.heading = 'd';
	this.ani_count = 0;
	this.ani = 1;
	this.update = function(X1, Y1, X2, Y2) {
		heroX = X1;
		heroY = Y1;
		heroXTile = this.base.getTileX();
		heroYTile = this.base.getTileY();
		if (rw.key('la')&&(X1>4)) this.base.move(-5,0);
		if (rw.key('ra')&&(X2<476)) this.base.move(5,0);
		if (rw.key('ua')&&(Y1>4)) this.base.move(0,-5);
		if (rw.key('da')&&(Y2<476)) this.base.move(0,5);
		(this.ani_count<5) ? this.ani_count++ : (this.ani_count=0,(this.ani==1) ? this.ani=2 : this.ani=1);
		this.base.changeSprite('hero.'+this.heading+this.ani);
	}
	this.keyChange = function() {
		if (rw.key('la')) this.heading = 'l';
		if (rw.key('ra')) this.heading = 'r';
		if (rw.key('ua')) this.heading = 'u';
		if (rw.key('da')) this.heading = 'd';
	}
	this.hitMap = [['hero',['eye','item'],0,0,30,30]];
	this.gotHit = function(by) {
		if ((!fatima)&&(by=='eye')) {
			this.base.hide();
			endGame = true;
			return false;
		}
	}
}

var eye = function(name, heading) {
	this.base = new rw.Ent(name, 'eye_'+heading+1, 30, 30);
	this.heading = heading;
	this.ani = 1;
	this.ani_count = 0;
	this.update = function(X1, Y1, X2, Y2) {
		if ((X1<0)||(X2>480)||(Y1<0)||(Y2>480)) {
			eyesDead++;
			this.base.hide();
			return false;
		}
		switch (this.heading) {
			case 'd':
				if ((Y1<heroY)||blind) {
					(!slow) ? this.base.move(0,5) : this.base.move(0,2);
				} else {
					(X1>heroX) ?  this.heading = 'l' : this.heading = 'r';
				}
				break;
			case 'l':
				if ((X1>heroX)||blind) {
					(!slow) ? this.base.move(-5,0) : this.base.move(-2,0);
				} else {
					(Y1>heroY) ?  this.heading = 'u' : this.heading = 'd';
				}
				break;
			case 'u':
				if ((Y1>heroY)||blind) {
					(!slow) ? this.base.move(0,-5) : this.base.move(0,-2);
				} else {
					(X1<heroX) ?  this.heading = 'r': this.heading = 'l';
				}
				break;
			case 'r':
				if ((X1<heroX)||blind) {
					(!slow) ? this.base.move(5,0) : this.base.move(2,0);
				} else {
					(Y1<heroY) ?  this.heading = 'd' : this.heading = 'u';
				}
				break;
		}
		(this.ani_count<5) ? this.ani_count++ : (this.ani_count=0,(this.ani==1) ? this.ani=2 : this.ani=1);
		this.base.changeSprite('eye_'+this.heading+this.ani);
	}
	this.hitMap = [['eye',['eye','hero'],10,10,20,20]];
	this.gotHit = function(by) {
		if ((by=='eye')||(by=='hero')) {
			eyesDead++;
			this.base.hide();
			return false;
		}
	}
}

var item = function() {
	this.base = new rw.Ent('item'+itemCounter++, 'question', 30, 30);
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
	this.hitMap = [['item',['hero'],0,0,30,30]];
	this.gotHit = function(by) {
		if (by=='hero') {
			switch (this.counter) {
				case 0:
					fatima = true;
					fatimaCountdown = 100;
					break;
				case 1:
					blind = true;
					blindEyeCountdown = 100;
					break;
				case 2:
					slow = true;
					slowCountdown = 100;
					break;
				case 3:
					badLuck = true;
					badLuckCountdown = 50;
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

var timers = function() {
	this.base = new rw.Rule(true,2);
	this.rule = function() {
		(fatimaCountdown>0) ? fatimaCountdown-- : fatima = false;
		(blindEyeCountdown>0) ? blindEyeCountdown-- : blind = false;
		(slowCountdown>0) ? slowCountdown-- : slow = false;
		(badLuckCountdown>0) ? badLuckCountdown-- : badLuck = false;
	}
}

var resetGame = function() {
	this.base = new rw.Rule(true,3);
	this.rule = function() {
		if (endGame) {
			endGame = false;
			heroX = 0;
			heroY = 0;
			heroXTile = 0;
			heroYTile = 0;
			eyeCounter = 0;
			eyesDead = 0;
			itemCounter = 0;
			fatima = false;
			fatimaCountdown = 0;
			blind = false;
			blindEyeCountdown = 0;
			slow = false;
			slowCountdown = 0;
			badLuck = false;
			badLuckCountdown = 0;
			rw.wipeAll().stop(function(){rw.loadState('init').start()});
		}
	}
}

var pickTile = function() {
	var xTile = Math.round(15*Math.random());
	var yTile = Math.round(15*Math.random());
	if ((xTile>heroXTile-5)&&(xTile<heroXTile+5)) {
		if ((yTile>heroYTile-5)&&(yTile<heroYTile+5)) {
			return pickTile();
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
		.base.display(xTile, yTile, yTile);
}

var makeEyes = function() {
	this.base = new rw.Rule(true,0);
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
	this.base = new rw.Rule(true,0);
	this.rule = function() {
		if (Math.random()>0.995) {
			var newTiles = pickTile()
			var xPos = 30*newTiles[0];
			var yPos = 30*newTiles[1];
			rw.newEnt(new item())
				.base.display(xPos, yPos, yPos);
		}
	}
}

var startGame = function() {
	rw.loadSprites({
		bg: ['sprites/bg.png', 480, 480],
		hero: {
			src: 'sprites/hero.png',
			d1: [30, 30, 0, 0],
			d2: [30, 30, 0, 30],
			u1: [30, 30, 30, 0],
			u2: [30, 30, 30, 30],
			l1: [30, 30, 60, 0],
			l2: [30, 30, 60, 30],
			r1: [30, 30, 90, 0],
			r2: [30, 30, 90, 30]
		},
		eye_d1: ['sprites/eye_d1.gif', 30, 30],
		eye_l1: ['sprites/eye_l1.gif', 30, 30],
		eye_r1: ['sprites/eye_r1.gif', 30, 30],
		eye_u1: ['sprites/eye_u1.gif', 30, 30],
		eye_d2: ['sprites/eye_d2.gif', 30, 30],
		eye_l2: ['sprites/eye_l2.gif', 30, 30],
		eye_r2: ['sprites/eye_r2.gif', 30, 30],
		eye_u2: ['sprites/eye_u2.gif', 30, 30],
		badluck: ['sprites/badluck.gif', 30, 30],
		blindeye: ['sprites/blindeye.gif', 30, 30],
		fatima: ['sprites/fatima.gif', 30, 30],
		question: ['sprites/question.gif', 30, 30],
		slow: ['sprites/slow.gif', 30, 30]
	}, function() {
		rw.init('playarea', {x:480, y:480})
		.tilesOn(30,30)
		.setFPS(30)
		.newRule('makeEyes', new makeEyes())
		.newRule('timers', new timers())
		.newRule('dropItem', new dropItem())
		.newRule('endGame', new resetGame())
		.newEnt({
			base: new rw.Ent('bg','bg',480,480),
			update: function() {}
		}).base.display(0,0,-16).end()
		.newEnt(new hero('hero'))
			.base.display(240,240,240).end()
		.newEnt({
			base: new rw.Ent('text', 'text', 100, 100),
			update: function() {
				var txt = ' Lag: '+Math.round(rw.getLag())+'  ';
				txt += 'Score: '+eyesDead+' ';
				if (fatima) txt += ' Fatima! ';
				if (blind) txt += ' Blind Eye ';
				if (slow) txt += ' Slow ';
				if (badLuck) txt += ' Bad Luck';
				this.text.text = txt;
			},
			text: {
				text: 'Score: ',
				form: 'fill',
				style: {
					font: '16px sans-serif',
					fill: '#000'
				}
			}
		}).base.display(0,16,0).end()
		.start().saveState('init');
	});
}
