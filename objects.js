// Object Classes
function Character(name, era, str, ftt, qik, rea, rsn, wil, spr) {
	this.name = name;
	this.era = era;
	this.str = str;
	this.ftt = ftt;
	this.qik = qik;
	this.rea = rea;
	this.rsn = rsn;
	this.wil = wil;
	this.spr = spr;
	this.skl = new Skills;
	this.hp = ftt*10; //Hit Points
	this.thp = ftt*10;
	this.fc = wil*10; //Focus (Mental HP)
	this.tfc = wil*10;
	this.wep = 50;
	this.items = [];
	this.attack = attack;
	this.calcDamage = calcDamage;
	this.damage = damage;
	this.calcInit = calcInit;
}
function Skills() {
	this.brawl = 0;
	this.club = 0;
	this.stab = 0;
	this.throw = 0;
	this.arrow = 0;
	this.shoot = 0;
	this.dodge = 0;
}
function Item() {
	this.name = name;
	this.effect = effect;
}

//Runtime Objects
//Item object factory
//Core
function item(name, type, graf, height, width, posX, posY) {
	this.name = name;
	this.type = type;
	this.graf = graf;
	this.height = height;
	this.width = width;
	this.posX = posX;
	this.posY = posY;
}

//Person object factory
//Core
function per(name, type, graf, height, width,posX, posY) {
	this.name = name;
	this.type = type;
	this.graf = graf;
	this.height = height;
	this.width = width;
	this.posX = posX;
	this.posY = posY;
	// Up, Down, Left, Right Control bools & Loop counter
	this.u = false;
	this.d = false;
	this.l = false;
	this.r = false;
	this.speed = 3;
	this.counter = 0;
	this.logic = function(){};
}
//Obsitcal Factory
//Core
function Obstical(name, type, angle, p1x, p1y, p2x, p2y) {
	this.name = name;
	this.type = type;
	this.angle = angle;
	this.p1x = p1x;
	this.p1y = p1y;
	this.p2x = p2x;
	this.p2y = p2y;
}