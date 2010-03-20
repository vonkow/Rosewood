// Simple demonstration of a scrolling map background
function mapRule() {
	this.base = new rw.rule(true);
	this.currentOffset = 0;
	this.forward = true;
	this.rule = function() {
		if (this.forward==true) {
			if (this.currentOffset>-600) {
				this.currentOffset--;
				rw.maps['map1'].offset(-1, 0);
			} else {
				this.forward = false;
			}
		} else {
			if (this.currentOffset<0) {
				this.currentOffset++;
				rw.maps['map1'].offset(1, 0);
			} else {
				this.forward = true;
			}
		}
	}
}
function startGame() {
	rw.init(600, 600)
	.newMap('map1', 'map2', 'jpg', 1200, 600).render().end()
	.newRule('rule1', new mapRule())
	.start();
}
