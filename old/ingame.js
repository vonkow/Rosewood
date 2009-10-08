// Rename: RunElements

//Core?
function killEne(id) {
	rw.ene.splice(id, 1)
}
// kills rw.person element and array entry
//Core
rw.r.killPer = function(per, pertotal) {
	kill(rw.pers[per].name);
	rw.pers.splice(per,1);
	return pertotal--;
}
// Load map and set dimensions
//Core
rw.r.makeMap = function(file, x, y) {
	var map = document.createElement('div');
	map.id = 'map';
	map.style.position = 'absolute';
	map.style.left = '0px';
	map.style.top = '0px';
	map.style.zIndex = '-1';
	map.style.width = x+'px';
	map.style.height = y+'px';
	map.style.backgroundImage = "url('"+file+"')";
	ctr.appendChild(map);
}

// Initialize player sprite
// Core
rw.r.makePlayer = function(name, graf, posX, posY, facing) {
	rw.g.pName = name;
	rw.g.pGraf = graf;
	rw.g.pX = posX;
	rw.g.pY = posY;
	var player = document.createElement('div');
	player.id = 'hi';
	player.style.position = 'absolute';
	player.style.height = '70px';
	player.style.width = '44px';
	player.style.left = posX+'px';
	player.style.top = posY+'px';
	player.style.zIndex = '4';
	player.style.backgroundRepeat = 'no-repeat';
	player.style.backgroundPosition = 'center'
	switch (facing) {
		case 'd':
			player.style.backgroundImage = "url('sprites/"+rw.g.pGraf+"/"+rw.g.pGraf+"_D.gif')";
			break;
		case 'u':
			player.style.backgroundImage = "url('sprites/"+rw.g.pGraf+"/"+rw.g.pGraf+"_U.gif')";
			break;
		case 'l':
			player.style.backgroundImage = "url('sprites/"+rw.g.pGraf+"/"+rw.g.pGraf+"_L.gif')";
			break;
		case 'r':
			player.style.backgroundImage = "url('sprites/"+rw.g.pGraf+"/"+rw.g.pGraf+"c_R.gif')";
			break;
	}
	
	ctr.appendChild(player);
}

//Create Person and Element
//Core
rw.r.makePer = function(name, type, graf, height, width, posX, posY) {
	var x = rw.pers.length;
	rw.pers[x] = new per(name, type, graf, height, width, posX, posY);
	var psn = document.createElement('div');
	psn.id = name;
	psn.style.width = rw.pers[x].width+'px';
	psn.style.height = rw.pers[x].height+'px';
	psn.style.position = 'absolute';
	psn.style.left = rw.pers[x].posX+'px';
	psn.style.top = rw.pers[x].posY+'px';
	psn.style.zIndex = rw.pers[x].posY+rw.pers[x].height;;
	psn.style.backgroundImage = "url('sprites/"+graf+"/"+graf+type+".gif')";;
	psn.style.backgroundRepeat = 'no-repeat';
	psn.style.backgroundPosition = 'center';
	ctr.appendChild(psn);
}

//Create Item and element
//Core
rw.r.makeItem = function(name, type, graf, height, width, posX, posY) {
	var x = rw.items.length;
	rw.items[x] = new item(name, type, graf, height, width, posX, posY);
	var itm = document.createElement('div');
	itm.id = rw.items[x].name;
	itm.style.width = rw.items[x].width+'px';
	itm.style.height = rw.items[x].height+'px';
	itm.style.position = 'absolute';
	itm.style.left = rw.items[x].posX+'px';
	itm.style.top = rw.items[x].posY+'px';
	itm.style.backgroundImage = "url('sprites/items/"+rw.items[x].graf+"/"+rw.items[x].graf+".gif')";
	itm.style.zIndex = rw.items[x].posY+rw.items[x].height;
	ctr.appendChild(itm);
}
//Create Obsitcal
//Core
rw.r.makeObst = function(name, type, angle, p1x, p1y, p2x, p2y) {
	var x = rw.obst.length;
	rw.obst[x] = new Obstical(name, type, angle, p1x, p1y, p2x, p2y);
}