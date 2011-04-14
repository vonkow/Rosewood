var lagTimer = function() {
	var worst = -25,
		timer = 1800
	this.base = new rw.Ent('lag','text',150,20)
	this.text = {
		text: 'Lag: ',
		form: 'fill',
		style: {
			font: '16px sans-serif',
			fill: '#000'
		}
	}
	this.update = function() {
		var lag = rw.getLag();
		if (timer>0) {
			if ((lag!=0)&&(lag>worst)) worst = lag
			timer--
		} else {
			worst = -25
			timer = 1800
		}
		this.text.text = 'Lag: '+rw.getLag()+'(ms) Worst: '+worst
	}
}

var wallCount=0
var wall=function(type,x,y) {
	this.base = new rw.Ent('wall_'+wallCount++,' ',x,y)
	this.update=function() {}
	this.hitMap=[[type,['ball'],0,0,x,y]]
}

var ball = function(name, ty, dirX, dirY) {
	this.spdMod = 10*Math.random()
	this.base = new rw.Ent(name, ty, 40, 40)
	this.dirX = dirX
	this.dirY = dirY
	this.hit = false
	this.update = function() {
		this.hit = false
		;(this.dirX=='r') ? this.base.move(this.spdMod,0) : this.base.move(-this.spdMod,0)
		;(this.dirY=='d') ? this.base.move(0,this.spdMod) : this.base.move(0,-this.spdMod)
	}
	if (ty=='ball') {
		this.hitMap=[['ball',['rWall','lWall','tWall','bWall','tri','ball'],20,20,20]]
	} else if (ty=='tri') {
		this.hitMap=[['ball',['rWall','lWall','tWall','bWall','tri','ball'],0.001,40,40,40,20,0.001]]
	} else if (ty=='box') {
		this.hitMap=[['ball',['rWall','lWall','tWall','bWall','tri','ball'],0,0,40,40]]
	}
	this.gotHit = function(by) {
		if (this.hit==false) {
			switch (by) {
				case 'rWall':
					this.dirX = 'l'
					break
				case 'lWall':
					this.dirX = 'r';
					break
				case 'tWall':
					this.dirY = 'd'
					break
				case 'bWall':
					this.dirY = 'u'
					break
				case 'ball':
					(this.dirX=='r') ? this.dirX='l' : this.dirX='r'
					;(this.dirY=='u') ? this.dirY='d' : this.dirY='u'
					this.base.wipeMove()
					this.spdMod = 10*Math.random()
					break
			}
			this.hit=true
		}
	}
}
function startGame() {
	rw.loadSprites({
		ball: ['sprites/ball.png', 40, 40, 0, 0],
		box: ['sprites/box.png', 40, 40, 0, 0],
		tri: ['sprites/tri.png', 40, 40, 0, 0]
	}, function() {
		rw.init('playarea', {
			x:600,
			y:600,
			FPS:60,
			sequence:['ajax','ents','cols','blit'],
			keys:false,
			mouse:false
		})
		.newEnt(new lagTimer()).base.display(0,16,0).end()
		.newEnt(new wall('tWall',600,10))
			.base.display(0, -10, 0).end()
		.newEnt(new wall('rWall',10,600))
			.base.display(600, 0, 0).end()
		.newEnt(new wall('lWall',10,600))
			.base.display(-10, 0, 0).end()
		.newEnt(new wall('bWall',600,10))
			.base.display(0, 600, 0).end()
		.newEnt(new ball('ball_1', 'ball', 'r', 'd'))
			.base.display(392, 426, 50).end()
		.newEnt(new ball('ball_2', 'ball', 'l', 'd'))
			.base.display(347, 32, 50).end()
		.newEnt(new ball('ball_3', 'ball', 'r', 'u'))
			.base.display(209, 433, 50).end()
		.newEnt(new ball('ball_4', 'box', 'l', 'u'))
			.base.display(65, 145, 50).end()
		.newEnt(new ball('ball_5', 'box', 'r', 'd'))
			.base.display(413, 221, 50).end()
		.newEnt(new ball('ball_6', 'box', 'l', 'd'))
			.base.display(165, 370, 50).end()
		.newEnt(new ball('ball_7', 'tri', 'r', 'u'))
			.base.display(160, 245, 50).end()
		.newEnt(new ball('ball_8', 'tri', 'l', 'u'))
			.base.display(473, 399, 50).end()
		.newEnt(new ball('ball_9', 'tri', 'l', 'u'))
			.base.display(102, 45, 50).end()
		.newEnt(new ball('ball_10', 'ball', 'r', 'd'))
			.base.display(263, 264, 50).end()
		.newEnt(new ball('ball_11', 'ball', 'r', 'd'))
			.base.display(54, 201, 50).end()
		.newEnt(new ball('ball_12', 'ball', 'l', 'd'))
			.base.display(437, 23, 50).end()
		.newEnt(new ball('ball_13', 'box', 'l', 'u'))
			.base.display(56, 451, 50).end()
		.newEnt(new ball('ball_14', 'box', 'r', 'd'))
			.base.display(314, 122, 50).end()
		.newEnt(new ball('ball_15', 'tri', 'r', 'u'))
			.base.display(112, 392, 50).end()
		.start()
	})
}
