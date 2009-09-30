

// Create world areas here!!!
rw.world[0] = function() {
	rw.r.makeMap('back_1.png', 640, 512);
	rw.r.makePlayer('Bob', 'c', 320, 375, 'd');
	rw.r.makePer('rw.person', 'W_R', 'l', 70, 44, 400, 300);
	rw.r.makePer('rw.person2', 'W_L', 'imp', 70, 44, 100, 75);
	rw.pers[0].r = true; //Initial Person movement
	rw.pers[0].logic = function() {
		//Update Person's location onscreen
		rw.pers[0].counter++
		//Flip rw.person's direction
		if (rw.pers[0].counter==100) {
			rw.pers[0].r = !rw.pers[0].r;
			rw.pers[0].l = !rw.pers[0].l;
			rw.pers[0].counter = 0;
			if (rw.pers[0].l==true) {
				document.getElementById(rw.pers[0].name).style.backgroundImage = "url('sprites/"+rw.pers[0].graf+"/"+rw.pers[0].graf+"W_L.gif')";
			}
			else if (rw.pers[0].r==true) {
				document.getElementById(rw.pers[0].name).style.backgroundImage = "url('sprites/"+rw.pers[0].graf+"/"+rw.pers[0].graf+"W_R.gif')";
			}
			return false;
		}
		else {
			return true;
		}
	}
	rw.pers[1].l = true;
	rw.pers[1].logic = function() {
		//Update Person's location onscreen
		rw.pers[1].counter++
		//Flip rw.person's direction
		if (rw.pers[1].counter==50) {
			rw.pers[1].r = !rw.pers[1].r;
			rw.pers[1].l = !rw.pers[1].l;
			rw.pers[1].counter = 0;
			if (rw.pers[1].l==true) {
				document.getElementById(rw.pers[1].name).style.backgroundImage = "url('sprites/"+rw.pers[1].graf+"/"+rw.pers[1].graf+"W_L.gif')";
			}
			else if (rw.pers[1].r==true) {
				document.getElementById(rw.pers[1].name).style.backgroundImage = "url('sprites/"+rw.pers[1].graf+"/"+rw.pers[1].graf+"W_R.gif')";
			}
			return false;
		}
		else {
			return true;
		}
	}
	rw.r.makeItem('food', 'food', 'foodbag', 32, 32, 100, 200);
	rw.r.makeItem('meat', 'food', 'foodbag', 32, 32, 250, 400);
	//rw.r.makeObst('rock', 'rec', '', 441, 162, 481, 192); //30, 40, 441, 162
	//rw.r.makeObst('tri', 'tri', 'tl', 200, 200, 250, 250);
	rw.r.makeObst('water1', 'rec', '', 352, 0, 640, 160);
	rw.r.makeObst('water2', 'rec', '', 608, 160, 640, 288);
	rw.r.makeObst('water3', 'rec', '', 576, 160, 608, 192);
	//rw.r.makeObst('water4', 'tri', 'tr', 384, 160, 352, 128);
}
rw.world[1] = function() {
	rw.r.makeMap('back_1.png', 640, 512);
	rw.r.makePlayer('Bob', 'c', 320, 375, 'd');
	rw.r.makePer('rw.person', 'W_R', 'l', 70, 44, 475, 300);
	rw.r.makePer('rw.person2', 'W_L', 'imp', 70, 44, 100, 75);
	rw.pers[0].r = true; //Initial Person movement
	rw.pers[1].l = true;
	rw.r.makeItem('food', 'food', 'foodbag', 32, 32, 100, 200);
	rw.r.makeItem('meat', 'food', 'foodbag', 32, 32, 250, 400);
	//rw.r.makeObst('rock', 'rec', '', 441, 162, 481, 192); //30, 40, 441, 162
	//rw.r.makeObst('tri', 'tri', 'tl', 200, 200, 250, 250);
}

// Results of grabbing an item
function grabItem(id, name, type) {
	if (type=='food') {
		kill(rw.items[id].name);
		rw.items.splice(id,1);
		id--;
	}
	else if (rw.items[x].name=='rock') {
		document.getElementById('message').innerHTML="Hi! I'm a Rock!";
	}
	return id;
}
// Results of grabbing a person
function grabPers(id, name, type) {
	if (type=='W_L'/*||rw.pers[x].type=='lW_R'*/) {
		rw.g.state = 3;
		rw.u.state();
		//id = rw.r.killPer(id, 1);
		id = -2;
	}
	else if (name==('rw.person'||'rw.person2')) {
		document.getElementById('message').innerHTML="Hi! I'm a rw.person!";
	}
	return id;
}


function menuCont() {
	var p_atts = document.createElement('div');
	p_atts.id = 'p_atts';
	p_atts.style.cssFloat = 'left';
	p_atts.appendChild(document.createTextNode(player.name));
	p_atts.appendChild(document.createElement('br'));
	p_atts.appendChild(document.createTextNode('Str: '+player.str));
	p_atts.appendChild(document.createElement('br'));
	p_atts.appendChild(document.createTextNode('Ftt: '+player.ftt));
	p_atts.appendChild(document.createElement('br'));
	p_atts.appendChild(document.createTextNode('Qik: '+player.qik));
	p_atts.appendChild(document.createElement('br'));
	p_atts.appendChild(document.createTextNode('Rea: '+player.rea));
	p_atts.appendChild(document.createElement('br'));
	p_atts.appendChild(document.createTextNode('Rsn: '+player.rsn));
	p_atts.appendChild(document.createElement('br'));
	p_atts.appendChild(document.createTextNode('Wil: '+player.wil));
	p_atts.appendChild(document.createElement('br'));
	p_atts.appendChild(document.createTextNode('Spr: '+player.spr));
	p_atts.appendChild(document.createElement('br'));
	var p_skls = document.createElement('div');
	p_skls.id = 'p_skls';
	p_skls.style.cssFloat = 'left';
	p_skls.style.marginLeft = '15px';
	p_skls.appendChild(document.createTextNode('HP: '+player.hp+' / '+player.thp));
	p_skls.appendChild(document.createElement('br'));
	p_skls.appendChild(document.createTextNode('Brawl: '+player.skl.brawl));
	p_skls.appendChild(document.createElement('br'));
	p_skls.appendChild(document.createTextNode('Dodge: '+player.skl.dodge));
	p_skls.appendChild(document.createElement('br'));
	
	var p_items = document.createElement('div');
	p_items.id = 'p_rw.items';
	p_items.style.cssFloat = 'left';
	p_items.style.marginLeft = '15px';
	p_items.appendChild(document.createTextNode('Items:'));
	p_items.appendChild(document.createElement('br'));
	for (var x=0;x<player.items.length;x++) {
		p_items.appendChild(document.createTextNode(player.items[x].name));
		p_items.appendChild(document.createElement('br'));
	}
	ovr.appendChild(p_atts);
	ovr.appendChild(p_skls);
	ovr.appendChild(p_items);
}

// Check Input Functions
//sets appropriat global var to true when key is pressed and modifies player's sprite to match
function keyIsDown(e) {
	var hi = document.getElementById('hi');
	var ev = e ? e : window.event;
	if (rw.g.alive==true) {
		switch (ev.keyCode) {
			case 37:
				rw.keys.l = true;
				hi.style.backgroundImage = "url('sprites/"+rw.g.pGraf+"/"+rw.g.pGraf+"W_L.gif')";
				break;
			case 38:
				rw.keys.u = true;
				hi.style.backgroundImage = "url('sprites/"+rw.g.pGraf+"/"+rw.g.pGraf+"W_U.gif')";
				break;
			case 39:
				rw.keys.r = true;
				hi.style.backgroundImage = "url('sprites/"+rw.g.pGraf+"/"+rw.g.pGraf+"W_R.gif')";
				break;
			case 40:
				rw.keys.d = true;
				hi.style.backgroundImage = "url('sprites/"+rw.g.pGraf+"/"+rw.g.pGraf+"W_D.gif')";
				break;
			case 84:
				rw.keys.t = true;
				break;
			case 65:
				rw.keys.a = true;
				if (rw.g.fighting==false) {
					if (rw.g.alive==true) {
						if(rw.g.t==0&&rw.g.tTotal!=0) {
							killEne(0);
							ovr.style.display = 'none';
							rw.g.state = 2;
							rw.u.state();
						}
					}
					else {
						
					}
				}
				break;
			case 73:
				clearTimeout(rw.g.t);
				rw.g.tTotal= rw.g.tTotal+rw.g.t;
				rw.g.t=0;
				pause = true;
				rw.r.showMenu();
		}
	}
}
//Set appropriate global var to false whe key is released and modifies player's sprite to match
function keyIsUp(e) {
	if (rw.g.alive==true) {
		var ev = e ? e : window.event;
		var hi = document.getElementById('hi');
		switch (ev.keyCode) {
			case 37:
				rw.keys.l = false;
				hi.style.backgroundImage = "url('sprites/"+rw.g.pGraf+"/"+rw.g.pGraf+"_L.gif')";
				break;
			case 38:
				rw.keys.u = false;
				hi.style.backgroundImage = "url('sprites/"+rw.g.pGraf+"/"+rw.g.pGraf+"_U.gif')";
				break;
			case 39:
				rw.keys.r = false;
				hi.style.backgroundImage = "url('sprites/"+rw.g.pGraf+"/"+rw.g.pGraf+"_R.gif')";
				break;
			case 40:
				rw.keys.d = false;
				hi.style.backgroundImage = "url('sprites/"+rw.g.pGraf+"/"+rw.g.pGraf+"_D.gif')";
				break;
			case 84:
				rw.keys.t = false;
				break;
			case 65:
				rw.keys.a = false;
				break;
			case 73:
				
				break;
		}
		if (rw.keys.u==true){hi.style.backgroundImage = "url('sprites/"+rw.g.pGraf+"/"+rw.g.pGraf+"W_U.gif')";};
		if (rw.keys.d==true){hi.style.backgroundImage = "url('sprites/"+rw.g.pGraf+"/"+rw.g.pGraf+"W_D.gif')";};
		if (rw.keys.l==true){hi.style.backgroundImage = "url('sprites/"+rw.g.pGraf+"/"+rw.g.pGraf+"W_L.gif')";};
		if (rw.keys.r==true){hi.style.backgroundImage = "url('sprites/"+rw.g.pGraf+"/"+rw.g.pGraf+"W_R.gif')";};
	}
}
