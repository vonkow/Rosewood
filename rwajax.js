var xhr = new XMLHttpRequest();
var ajax = function() {
	xhr.open("GET",'ajaxtest.json',true);
	xhr.overrideMimeType("application/json");
	xhr.onreadystatechange = addGuy;
	xhr.send(null);
}
var addGuy = function() {
	if (xhr.readyState==4) {
		var resp = eval('('+xhr.responseText+')');
		rw.newEnt(new badguy(resp.name), resp.display, resp.posX, resp.posY, resp.posZ);
	}
}
