var ship = function(name) {
	this.base = new rw.ent(name, 'ship', 'ship', 'png', 40, 40);
	this.heading = 270;
	this.maxSpeed = 25;
	this.accel = 1;
	this.lasCount = 0;
	this.coolDown = 0;
	this.velX = 0;
	this.velY = 0;
	this.hitMap = [['ship',10,10,30,30]];
	this.update = function() {
		if (rw.key('la')) {
			this.heading-=10;
			if (this.heading<0) {
				this.heading+=360;
			}
		}
		if (rw.key('ra')) {
			this.heading+=10;
			if (this.heading>=360) {
				this.heading-=360;
			}
		}
		if (rw.key('ua')) {
			var angle = this.heading*0.0174532925;
			var scaleX = Math.cos(angle);
			var scaleY = Math.sin(angle);
			this.velX += this.accel*scaleX;
			if (this.velX>25) this.velX =25;
			this.velY += this.accel*scaleY;
			if (this.velY>25) this.velY =25;
		}
		if (this.coolDown>0) this.coolDown--;
		if (this.coolDown<=0) {
			if (rw.key('sp')) {
				var num = this.lasCount++;
				var posX = this.base.posX+15;
				var posY = this.base.posY+15;
				rw.newEnt(new laser('laser_'+num,this.heading))
					.base.display('laser',posX,posY,posY);
				this.coolDown=5;
			}
		}
		this.base.rotate(this.heading);
		if (this.base.posX1()<0) this.base.posX+=600;
		if (this.base.posX2()>600) this.base.posX-=600;
		if (this.base.posY1()<0) this.base.posY+=600;
		if (this.base.posY2()>600) this.base.posY-=600;
		this.base.move(this.velX,this.velY);
		//this.base.velX=this.velX;
		//this.base.velY=this.velY;

	}
	this.gotHit = function(by) {
		switch (by) {
			case 'roid':
				this.base.hide();
				return false;
				break;
		}
	}
}

var laser = function(name, angle) {
	this.base = new rw.ent(name, 'laser', 'laser', 'png', 10, 10);
	this.velX = 20*Math.cos((angle*0.0174532925));
	this.velY = 20*Math.sin((angle*0.0174532925));
	this.countDown = 25;
	this.hasntHit = true;
	this.hitMap = [['laser',0,0,10,10]];
	this.update = function() {
		this.base.rotate(angle);
		this.base.velX = this.velX;
		this.base.velY = this.velY;
		if (this.base.posX1()<0) this.base.posX+=600;
		if (this.base.posX2()>600) this.base.posX-=600;
		if (this.base.posY1()<0) this.base.posY+=600;
		if (this.base.posY2()>600) this.base.posY-=600;
		this.countDown--;
		if (this.countDown<1) {
			this.base.hide();
			return false;
		}
	}
	this.gotHit = function(by) {
		if (by=='roid') {
			this.hasntHit = false;
			this.base.hide();
			return false;
		}
	}
}

var roidcounter = 0;
var roid = function(name, size) {
	this.base = new rw.ent(name, 'roid', 'roid', 'png', size, size);
	this.size = size;
	this.heading = Math.round(Math.random()*360);
	this.spin = Math.round((Math.random()*20)-10);
	this.velX = Math.round((Math.random()*20)-10);
	this.velY = Math.round((Math.random()*20)-10);
	this.hitMap = [['roid',0,0,size,size]];
	this.update = function() {
		this.heading += this.spin;
		if (this.heading>=360) this.heading-=360;
		if (this.heading<0) this.heading+=360;
		this.base.rotate(this.heading);
		this.base.velX = this.velX;
		this.base.velY = this.velY;
		if (this.base.posX1()<0) this.base.posX+=600;
		if (this.base.posX2()>600) this.base.posX-=600;
		if (this.base.posY1()<0) this.base.posY+=600;
		if (this.base.posY2()>600) this.base.posY-=600;
	}
	this.gotHit = function(by,inThe,id) {
		if (by=='laser') {
			if (rw.ents[id].hasntHit) {
				switch (this.size) {
					case 40:
						var posX = this.base.posX+20;
						var posY = this.base.posY+20;
						rw.newEnt(new roid('roid'+(roidcounter++), 20))
							.base.display('20', posX,posY,posY).end()
						.newEnt(new roid('roid'+(roidcounter++), 20))
							.base.display('20', posX,posY,posY).end()
						.newEnt(new roid('roid'+(roidcounter++), 20))
							.base.display('20', posX,posY,posY);
						this.base.hide();
						return false;
						break;
					case 20:
						var posX = this.base.posX+10;
						var posY = this.base.posY+10;
						rw.newEnt(new roid('roid'+(roidcounter++), 10))
							.base.display('10', posX,posY,posY).end()
						.newEnt(new roid('roid'+(roidcounter++), 10))
							.base.display('10', posX,posY,posY).end()
						.newEnt(new roid('roid'+(roidcounter++), 10))
							.base.display('10', posX,posY,posY);
						this.base.hide();
						return false;
						break;
					case 10:
						this.base.hide();
						return false;
						break;
				}
			}
		}
	}
}

var startGame = function() {
	rw.using('ship', 'png', ['ship'])
	.using('laser', 'png', ['laser'])
	.using('roid', 'png', ['40','20','10'])
	.init(600,600).changeCursor('blank.cur')
	.newMap('map1', 'space', 'gif', 1200, 600)
		.display()
		.end()
	.newEnt(new ship('ship1'))
		.base.display('ship', 280,280,280)
		.end()
	.newEnt(new roid('roid'+(roidcounter++), 40))
		.base.display('40', 500,500,500)
		.end()
	.newEnt(new roid('roid'+(roidcounter++), 40))
		.base.display('40', 100,100,100)
		.end()
	.newEnt(new roid('roid'+(roidcounter++), 40))
		.base.display('40', 0,0,0)
		.end()
	.start();
}
