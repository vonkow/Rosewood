var lagTimer = function() {
	this.base = new rw.ent(this,'lag', '','','',150,20);
	this.update = function() {
		this.base.detach();
		this.base.attach(document.createTextNode('Lag: '+rw.getLag()+'(ms)'));
	}
}

var wallCount=0;
var wall=function(type,x,y) {
	this.base = new rw.ent(this,'wall_'+wallCount++,'','','',x,y);
	this.update=function() {};
	this.hitMap=[[type,['ball'],0,0,x,y]];
};

var triWall = function(dir) {
	this.base = new rw.ent(this,'tri','','blank','',100,100);
	this.update=function() {};
	if (dir=='bl') this.hitMap=[['tri',['ball'],0,0,0,100,100,100]];
	if (dir=='tl') this.hitMap=[['tri',['ball'],0,0,100,0,0,100]];
	if (dir=='br') this.hitMap=[['tri',['ball'],100,0,100,100,0,100]];
	if (dir=='tr') this.hitMap=[['tri',['ball'],0,0,100,0,100,100]];
}

var ball = function(name, dirX, dirY) {
	this.base = new rw.ent(this,name, 'ball', 'ball', 'png', 40, 40);
	this.dirX = dirX;
	this.dirY = dirY;
	this.hit = false;
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
	this.hitMap=[['ball',['rWall','lWall','tWall','bWall','tri','ball'],20,20,20]];
	this.gotHit = function(by) {
		switch (by) {
			case 'rWall':
				this.dirX = 'l';
				break;
			case 'lWall':
				this.dirX = 'r';
				break;
			case 'tWall':
				this.dirY = 'd';
				break;
			case 'bWall':
				this.dirY = 'u';
				break;
			case 'ball':
			case 'tri':
				if (this.hit==false) {
					if (this.dirX=='r') {
						this.dirX = 'l';
						this.base.wipeMove();
					} else {
						this.dirX = 'r';
						this.base.wipeMove();
					}
					if (this.dirY=='u') {
						this.dirY = 'd';
						this.base.wipeMove();
					} else {
						this.dirY = 'u';
						this.base.wipeMove();
					}
					this.hit = true;
				}
				break;
		}
	}
}
function startGame() {
	rw.init(600, 600)
	.setFPS(60)
	.newEnt(new lagTimer()).base.display('blank',0,0,0).end()
	.newEnt(new wall('tWall',600,10))
		.base.display( '', 0, -10, 0).end()
	.newEnt(new wall('rWall',10,600))
		.base.display( '', 600, 0, 0).end()
	.newEnt(new wall('lWall',10,600))
		.base.display( '', -10, 0, 0).end()
	.newEnt(new wall('bWall',600,10))
		.base.display( '', 0, 600, 0).end()
	.newEnt(new triWall('bl'))
		.base.display('',0,500,500).end()
	.newEnt(new triWall('br'))
		.base.display('',500,500,500).end()
	.newEnt(new triWall('tl'))
		.base.display('',0,0,0).end()
	.newEnt(new triWall('tr'))
		.base.display('',500,0,0).end()
	.newEnt(new ball('ball_1', 'r', 'd'))
		.base.display( 'ball', 362, 426, 50).end()
	.newEnt(new ball('ball_2', 'l', 'd'))
		.base.display( 'ball', 347, 32, 50).end()
	.newEnt(new ball('ball_3', 'r', 'u'))
		.base.display( 'ball', 209, 433, 50).end()
	.newEnt(new ball('ball_4', 'l', 'u'))
		.base.display( 'ball', 65, 145, 50).end()
	.newEnt(new ball('ball_5', 'r', 'd'))
		.base.display( 'ball', 413, 221, 50).end()
	.newEnt(new ball('ball_6', 'l', 'd'))
		.base.display( 'ball', 165, 370, 50).end()
	.newEnt(new ball('ball_7', 'r', 'u'))
		.base.display( 'ball', 250, 245, 50).end()
	.newEnt(new ball('ball_8', 'l', 'u'))
		.base.display( 'ball', 453, 399, 50).end()
	.func(alert('Bouncy Ball Test'))
	.start();
}
