//////Rename: ?
//////Add pussycat DOM utils
//////Utilities


//// DOM Util Functions
////Core - Add links to functions that can style these
//Creates a Text Input Element
function addInput(name, lab, size, initval, onchange) {
	size = size || '';
	initval = initval || '';
	onchange = onchange || '';
	var div = document.createElement('div');
	div.id = name+'_d';
	var lbl = document.createElement('label');
	lbl.for = name;
	lbl.appendChild(document.createTextNode(lab+': '));
	var inp = document.createElement('input');
	inp.id = name;
	inp.type = 'text';
	inp.size = size;
	inp.value = initval;
	inp.setAttribute('onchange', onchange);
	div.appendChild(lbl);
	div.appendChild(inp);
	ctr.appendChild(div);
}
//Creates a Select Element
function addSelect(name, lab) {
	var div = document.createElement('div');
	div.id = name+'_d';
	var lbl = document.createElement('label');
	lbl.for = name;
	lbl.appendChild(document.createTextNode(lab+': '));
	var sel = document.createElement('select');
	sel.id = name;
	div.appendChild(lbl);
	div.appendChild(sel);
	ctr.appendChild(div);
}
//Creates an Option for a Select Element
function addOption(select, value, text) {
	var opt = document.createElement('option');
	opt.value = value
	opt.text = text;
	document.getElementById(select).appendChild(opt);
}
//Remove all children from element
function killChildren(ele) {
	var total = ele.childNodes.length;
	for (var x=0; x<total; x++) {
		ele.removeChild(ele.childNodes[0]);
	}
}
// Remove element
function kill(ele) {
	if (document.getElementById(ele)) {
		var ded = document.getElementById(ele);
		ded.parentNode.removeChild(ded);
	}
}

////Rosewood Util Functions
//Main rw State Switch Function
rw.u.state = function() {
	switch (rw.g.state) {
		case 0:
			titleMenu();
			break;
		case 1:
			killChildren(ctr);
			rw.g.alive = true;
			rw.u.makeWorld();
			document.onkeydown=keyIsDown;
			document.onkeyup=keyIsUp;
			rw.g.state = 2;
			rw.u.state();
			break;
		case 2:
			rw.g.t = setTimeout('rw.r.run()', 50);
			break;
		case 3:
			clearTimeout(rw.g.t);
			rw.g.tTotal= rw.g.tTotal+rw.g.t;
			rw.g.t=0;
			rw.g.fighting = true;
			ovr.style.display = 'block';
			createGame();
			break;
	}
}

//Loads map, player and all starting people/rw.items
//Core
rw.u.makeWorld = function() {
	rw.world[rw.g.world]();	
}
// Game Over - Reset to beginning
//Core
rw.u.reset = function() {
	ovr.style.display = 'none';
	killChildren(ctr);
	while (rw.obst.length>0) {
		rw.obst.splice(0,1);
	}
	while (rw.ene.length>0) {
		rw.ene.splice(0,1);
	}
	while (rw.pers.length>0) {
		rw.pers.splice(0,1);
	}
	rw.keys.a = false;
	titleMenu();
}

