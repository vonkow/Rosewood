//Character Creation

//First Called Function
function titleMenu() {
	createCharInput();
	//Uncomment the next 2 lines to start game without a title screen
	//rw.g.state = 1;
	//rw.u.state();
}

//Create Char Input Screen
//Non-Core
function createCharInput() {
	addInput('name', 'Name', 10);
	addSelect('era', 'Era');
	addOption('era', 'Cave', 'Cave');
	addOption('era', 'Ancient', 'Ancient');
	addOption('era', 'Medieval', 'Medieval');
	addOption('era', 'Steam', 'Steam');
	addOption('era', 'Now', 'Now');
	addOption('era', 'Future', 'Future');
	addInput('str', 'Strength', 2, '50', 'changeAtts()');
	addInput('ftt', 'Fortitude', 2, '50', 'changeAtts()');
	addInput('qik', 'Quickness', 2, '50', 'changeAtts()');
	addInput('rea', 'Reaction', 2, '50', 'changeAtts()');
	addInput('rsn', 'Reason', 2, '50', 'changeAtts()');
	addInput('wil', 'Willpower', 2, '50', 'changeAtts()');
	addInput('spr', 'Spirit', 2, '50', 'changeAtts()');
	var remin = document.createElement('div');
	remin.id = 'rem'
	remin.appendChild(document.createTextNode('0'));
	ctr.appendChild(remin);
	addInput('brawl', 'Brawling', 2, '0', 'changeSkls()');
	addInput('club', 'Clubbing', 2, '0', 'changeSkls()');
	addInput('stab', 'Stabbing', 2, '0', 'changeSkls()');
	addInput('throw', 'Throwing', 2, '0', 'changeSkls()');
	addInput('arrow', 'Arrowing', 2, '0', 'changeSkls()');
	addInput('shoot', 'Shooting', 2, '0', 'changeSkls()');
	addInput('dodge', 'Dodging', 2, '0', 'changeSkls()');
	var remsklin = document.createElement('div');
	remsklin.id = 'remskl'
	remsklin.appendChild(document.createTextNode('150'));
	ctr.appendChild(remsklin);
	var ok = document.createElement('div');
	var okbut = document.createElement('input');
	okbut.type = 'button';
	okbut.value = 'Ok';
	okbut.setAttribute('onclick', 'createChar()');
	ok.appendChild(okbut);
	ctr.appendChild(ok);
}

//Non-Core
function createChar() {
	var name = document.getElementById('name').value;
	var era = document.getElementById('era').options[document.getElementById('era').selectedIndex].value;
	var str = parseInt(document.getElementById('str').value);
	var ftt = parseInt(document.getElementById('ftt').value);
	var qik = parseInt(document.getElementById('qik').value);
	var rea = parseInt(document.getElementById('rea').value);
	var rsn = parseInt(document.getElementById('rsn').value);
	var wil = parseInt(document.getElementById('wil').value);
	var spr = parseInt(document.getElementById('spr').value);
	var brawl = parseInt(document.getElementById('brawl').value);
	var club = parseInt(document.getElementById('club').value);
	var stab = parseInt(document.getElementById('stab').value);
	var toss = parseInt(document.getElementById('throw').value);
	var arrow = parseInt(document.getElementById('arrow').value);
	var shoot = parseInt(document.getElementById('shoot').value);
	var dodge = parseInt(document.getElementById('dodge').value);
	player = new Character(name, era, str, ftt, qik, rea, rsn, wil, spr);
	
	player.skl.brawl = brawl;
	player.skl.club = club;
	player.skl.stab = stab;
	player.skl.throw = toss;
	player.skl.arrow = arrow;
	player.skl.shoot = shoot;
	player.skl.dodge = dodge;
	
	rw.g.state = 1;
	rw.u.state();
	
}
//Non-Core
function changeAtts() {
	var str_temp = document.getElementById('str').value;
	var ftt_temp = document.getElementById('ftt').value;
	var qik_temp = document.getElementById('qik').value;
	var rea_temp = document.getElementById('rea').value;
	var rsn_temp = document.getElementById('rsn').value;
	var wil_temp = document.getElementById('wil').value;
	var spr_temp = document.getElementById('spr').value;
	var rem_temp = 350-str_temp-ftt_temp-qik_temp-rea_temp-rsn_temp-wil_temp-spr_temp;
	var rem = document.getElementById('rem');
	rem.removeChild(rem.childNodes[0]);
	var rem_inTxt = document.createTextNode(rem_temp);
	rem.appendChild(rem_inTxt);
}
//Non-Core
function changeSkls() {
	var brawl_temp = document.getElementById('brawl').value;
	var club_temp = document.getElementById('club').value;
	var stab_temp = document.getElementById('stab').value;
	var throw_temp = document.getElementById('throw').value;
	var arrow_temp = document.getElementById('arrow').value;
	var shoot_temp = document.getElementById('shoot').value;
	var dodge_temp = document.getElementById('dodge').value;
	var rem_temp = 150-brawl_temp-club_temp-stab_temp-throw_temp-arrow_temp-shoot_temp-dodge_temp;
	var rem = document.getElementById('remskl');
	rem.removeChild(rem.childNodes[0]);
	var rem_inTxt = document.createTextNode(rem_temp);
	rem.appendChild(rem_inTxt);
}