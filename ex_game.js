rw.loadSprites({
	u:['u.png',10,10,0,0],
	d:['d.png',10,10,0,0],
	l:['l.png',10,10,0,0],
	r:['r.png',10,10,0,0]
}, function(){
	rw.init()
	.newEnt()
	.start();
});
