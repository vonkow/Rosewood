//Rename: RunLogic
//Maybe split, definately call external rosewood functions

// Runtime Functions

//Checks that player hasn't gone through any barriers
//Core
rw.r.barCheck = function(direction) {
	var hit = false;
	// Get rw.obst length and loop through
	var len = rw.obst.length;
	for (var x=0;x<len;x++) {
		//If rw.obst is rectangular
		if (rw.obst[x].type=='rec') {
			if ((rw.g.pX+44>=rw.obst[x].p1x)&&(rw.g.pX<=rw.obst[x].p2x)) {
				if ((rw.g.pY+70>=rw.obst[x].p1y)&&(rw.g.pY+35<=rw.obst[x].p2y)) {
					hit = true;
				}
			}
		}
		// Not working yet
		/*else if (rw.obst[x].type=='tri') {
			if ((gL>=rw.obst[x].p1x)&&(gL<=rw.obst[x].p2x)) {
				if ((gT>=rw.obst[x].p1y)&&(gT<=rw.obst[x].p2y)) {
					switch (rw.obst[x].angle) {
						case 'bl':
							if(gL-rw.obst[x].p1x<gT-rw.obst[x].p1y) {
								hit = true;
							}
							break;
						case 'tr':
							if(gL-rw.obst[x].p1x>gT-rw.obst[x].p1y) {
								hit = true;
							}
							break;
						case 'tl':
							var d = rw.obst[x].p2x-rw.obst[x].p1x;
							if((gL-rw.obst[x].p1x)+(gT-rw.obst[x].p1y)<d) {
								hit = true;
							}
							break;
						case 'br':
							var d = rw.obst[x].p2x-rw.obst[x].p1x;
							if((gL-rw.obst[x].p1x)+(gT-rw.obst[x].p1y)>d) {
								hit = true;
							}
							break;
					}
				}
			}
		}*/
	}
	if (hit==true) {
		switch (direction) {
				case 'd':
					rw.g.pY=rw.g.pY-2;
					break;
				case 'u':
					rw.g.pY=rw.g.pY+2;
					break;
				case 'l':
					rw.g.pX=rw.g.pX+2;
					break;
				case 'r':
					rw.g.pX=rw.g.pX-2;
					break;
			}
		}
	//return [gL, gT];
}

//Moves Player
//Core
rw.r.updatePlayer = function() {
	var ele = document.getElementById('hi');
	
	if (rw.keys.l==true) {
		rw.g.pX=rw.g.pX-rw.g.speed;
		if (rw.g.pX<0){rw.g.pX=0}; // Prevent offscreen movement
		rw.r.barCheck('l');
		ele.style.left=rw.g.pX+'px';
	}
	if (rw.keys.r==true) {
		rw.g.pX=rw.g.pX+rw.g.speed;
		if (rw.g.pX>596){rw.g.pX=596;};
		rw.r.barCheck('r');
		ele.style.left=rw.g.pX+'px';
	}
	if (rw.keys.u==true) {
		rw.g.pY=rw.g.pY-rw.g.speed;
		if (rw.g.pY<0){rw.g.pY=0}; // Prevent offscreen movement
		rw.r.barCheck('u');
		ele.style.top=rw.g.pY+'px';
		ele.style.zIndex = rw.g.pY+70;
		
	}
	if (rw.keys.d==true) {
		rw.g.pY=rw.g.pY+rw.g.speed;
		if (rw.g.pY>442){rw.g.pY=442;};
		rw.r.barCheck('d');
		ele.style.top=rw.g.pY+'px';
		ele.style.zIndex = rw.g.pY+70;
	}
	//Below displays a readout of player's pos, but is slow as hell
	//document.getElementById('read').innerHTML='X:'+gL+'Y:'+gT;
	//return[a[0], a[1]];
}

// Moves rw.person 
//Core

rw.r.updatePer = function(id) {
	var ele = document.getElementById(rw.pers[id].name);
	if(ele) {
		if (rw.pers[id].l==true) {
			rw.pers[id].posX=rw.pers[id].posX-rw.pers[id].speed;
			if (rw.pers[id].posX<0){rw.pers[id].posX=0}; // Prevent offscreen movement
			ele.style.left=rw.pers[id].posX+'px';
		}
		if (rw.pers[id].r==true) {
			rw.pers[id].posX=rw.pers[id].posX+rw.pers[id].speed;
			if (rw.pers[id].posX>640-rw.pers[id].width){rw.pers[id].posX=640-rw.pers[id].width;};
			ele.style.left=rw.pers[id].posX+'px';
		}
		if (rw.pers[id].u==true) {
			rw.pers[id].posY=rw.pers[id].posY-rw.pers[id].speed;
			if (rw.pers[id].posY<0){rw.pers[id].posY=0}; // Prevent offscreen movement
			ele.style.top=rw.pers[id].posY+'px';
			ele.style.zIndex = rw.pers[id].posY+rw.pers[id].height;
		}
		if (rw.pers[id].d==true) {
			rw.pers[id].posY=rw.pers[id].posY+rw.pers[id].speed;
			if (rw.pers[id].posY>512-rw.pers[id].height){rw.pers[id].posY=512-rw.pers[id].height;};
			ele.style.top=rw.pers[id].posY+'px';
			ele.style.zIndex = rw.pers[id].posY+rw.pers[id].height;
		}
		
	}
}



// "Action" functions, interacts with rw.items that are close enough to player
//Core (add calls to modifyable functions for modules)
rw.r.talk = function() {
	// Item's rw.r.talk to width shoud be its X-44-padding to X+width+padding 
	// Item's rw.r.talk to height should be it Y-70-padding to Y+(height-35)+padding
	var pad = 15;
	var ok = false;
	var pause = false;
	// Item Loop
	var len = rw.items.length;
	for (var x=0;x<rw.items.length;x++) {
		if ((rw.g.pX>=(rw.items[x].posX-44-pad))&&(rw.g.pX<=(rw.items[x].posX+rw.items[x].width+pad))) {
			if ((rw.g.pY>=(rw.items[x].posY-70-pad))&&(rw.g.pY<=(rw.items[x].posY+(rw.items[x].height-35)+pad))) {
				x = grabItem(x, rw.items[x].name, rw.items[x].type);
				ok = true;
			}
		}
	}
	// Person Loop
	len = rw.pers.length;
	for (var x=0;x<rw.pers.length;x++) {
		if ((rw.g.pX>=(rw.pers[x].posX-44-pad))&&(rw.g.pX<=(rw.pers[x].posX+rw.pers[x].width+pad))) {
			if ((rw.g.pY>=(rw.pers[x].posY-70-pad))&&(rw.g.pY<=(rw.pers[x].posY+(rw.pers[x].height-35)+pad))) {
				var y = grabPers(x, rw.pers[x].name, rw.pers[x].type);
				if (y==-2) {
					pause=true;
				}
				else {
					x=y;
				}
				ok = true;
				
			}
		}
	}
	// If nothing, make Message blank
	if (ok==false) {
		document.getElementById('message').innerHTML="";
	}
	return pause;
}
// Main animation function, recursive 
//Core
rw.r.run = function() {
	rw.r.updatePlayer();
	// Loop through people
	var perLen = rw.pers.length;
	for (var x=0;x<perLen;x++) {
		var y = rw.pers[x].logic();
		if (y==true) {
			rw.r.updatePer(x);
		}
	}
	var tresult = false;
	if (rw.keys.t==true) {
		tresult = rw.r.talk();
	}
	if (tresult==false) {
		rw.g.t = setTimeout('rw.r.run()', 50); //+txt
	}
}


//Core, calls user defined menuCont() in params
// Show Stats & Item Menu
rw.r.showMenu = function() {
	if (ovr.childNodes.length>0) {
		killChildren(ovr);
	}
	menuCont();
	ovr.style.display = 'block';
}