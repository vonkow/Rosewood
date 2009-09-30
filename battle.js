//Rename: OverLogic

//Fight Functions
function attack(type, target) {
	var toHit = 100 - (this.qik+this.skl[type]);
	toHit = Math.ceil(toHit+((target.rea+target.skl.dodge)/2));
	var roll = Math.ceil(Math.random()*100);
	document.getElementById('fightstat').appendChild(document.createTextNode(this.name+' attack: '+roll+'/'+toHit));
	document.getElementById('fightstat').appendChild(document.createElement('br'));
	if ((roll==100||roll>=toHit)&&roll!=1) {
		this.damage(target);
	}
	else {
		document.getElementById('fightstat').appendChild(document.createTextNode(this.name+' missed '+target.name));
		document.getElementById('fightstat').appendChild(document.createElement('br'));
	}
}
function calcDamage() {
	return Math.ceil((this.str+this.wep)*(0.5+(Math.random()/2)));
}
function damage(target) {
	var damage = this.calcDamage();
	target.hp = target.hp-damage;
	document.getElementById('fightstat').appendChild(document.createTextNode(this.name+' Hit '+target.name+' for '+damage+' damage. '+target.name+' Health = '+target.hp));
	document.getElementById('fightstat').appendChild(document.createElement('br'));
	
}
function calcInit() {
	return Math.ceil((this.rea+this.rsn)*(0.5+(Math.random()/2)));
}
function fight() {
	if (rw.g.fighting==true) {
		var fightstat = document.getElementById('fightstat');
		killChildren(fightstat);
		var x = player.calcInit();
		var y = rw.ene[0].calcInit();
		fightstat.appendChild(document.createTextNode(player.name+': '+x+' Bob: '+y));
		fightstat.appendChild(document.createElement('br'));
		if (x>y) {
			player.attack('brawl', rw.ene[0]);
			rw.ene[0].attack('brawl', player);
		}
		else {
			rw.ene[0].attack('brawl',player);
			player.attack('brawl', rw.ene[0]);
		}
		var p_hp = document.getElementById('p_hp');
		killChildren(p_hp);
		p_hp.appendChild(document.createTextNode(player.hp));
		var e_0_hp = document.getElementById('e_0_hp');
		killChildren(e_0_hp);
		e_0_hp.appendChild(document.createTextNode(rw.ene[0].hp));
		if (player.hp<0) {
			fightstat.appendChild(document.createTextNode("You're Dead!"));
			fightstat.appendChild(document.createElement('br'));
			var reset = document.createElement('input');
			reset.type = 'button'
			reset.value = 'Try Again'
			reset.setAttribute('onclick', 'rw.u.reset()');
			fightstat.appendChild(reset);
			rw.g.fighting = false;
			rw.g.alive = false;
			player = null;
			
		}
		if (rw.ene[0].hp<0) {
			fightstat.appendChild(document.createTextNode('Enemy Vanquished!'));
			fightstat.appendChild(document.createElement('br'));
			fightstat.appendChild(document.createTextNode('Press A to continue.'));
			rw.g.fighting = false;
		}
	}
}
// Creates Fight Sequence
function createGame() {
	if (ovr.childNodes.length>0) {
		killChildren(ovr);
	}
	var tstr = Math.round(Math.random()*100);
	var tftt = Math.round(Math.random()*100);
	var tqik = Math.round(Math.random()*100);
	var trea = Math.round(Math.random()*100);
	var trsn = Math.round(Math.random()*100);
	var twil = Math.round(Math.random()*100);
	var tspr = Math.round(Math.random()*100);
	//                     name   era    str ftt qik rea tht wil spr
	var len = rw.ene.length;
	rw.ene[len] = new Character('bob', 'now', tstr, tftt, tqik, trea, trsn, twil, tspr);
	rw.ene[len].skl.brawl = Math.round(Math.random()*50);
	rw.ene[len].skl.dodge = Math.round(Math.random()*50); 
	var p_div = document.createElement('div');
	p_div.id = 'p_div';
	p_div.appendChild(document.createTextNode(player.name));
	p_div.appendChild(document.createElement('br'));
	p_div.appendChild(document.createTextNode('HP: '));
	var p_hp = document.createElement('span');
	p_hp.id = 'p_hp';
	p_hp.appendChild(document.createTextNode(player.hp));
	p_div.appendChild(p_hp);
	ovr.appendChild(p_div);
	var e_0_div = document.createElement('div');
	e_0_div.id = 'e_0_div';
	e_0_div.appendChild(document.createTextNode(rw.ene[0].name));
	e_0_div.appendChild(document.createElement('br'));
	e_0_div.appendChild(document.createTextNode('HP: '));
	var e_0_hp = document.createElement('span');
	e_0_hp.id = 'e_0_hp';
	e_0_hp.appendChild(document.createTextNode(rw.ene[0].hp));
	e_0_div.appendChild(e_0_hp);
	ovr.appendChild(e_0_div);
	var fightbut = document.createElement('input');
	fightbut.type = 'button';
	fightbut.value = 'Fight!';
	fightbut.setAttribute('onclick', 'fight();')
	ovr.appendChild(fightbut);
	var fightstat = document.createElement('div');
	fightstat.id = 'fightstat';
	ovr.appendChild(fightstat);
	

}