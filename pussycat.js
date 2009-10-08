var pc = {};

// Make html Element
pc.m = function(params) {
	var ele = document.createElement(params.type);
	if (params.id) {
		ele.id = params.id;
	}
	return ele
}
// Append Function
pc.a = function(parent, child) {
	parent.appendChild(child);
}

// Get Body
pc.body = function() {
	return document.getElementsByTagName('body')[0];
}