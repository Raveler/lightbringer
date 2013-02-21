define(["Logger"], function(Logger) {

	return {
		getPageCoords: function(e) {
			var posx = 0;
			if (!e) var e = window.event;
			if (e.pageX) posx = e.pageX;
			else if (e.clientX) {
				posx = e.clientX + document.body.scrollLeft
					+ document.documentElement.scrollLeft;
			}
			var posy = 0;
			if (!e) var e = window.event;
			if (e.pageY) posy = e.pageY;
			else if (e.clientY) {
				posy = e.clientY + document.body.scrollLeft
					+ document.documentElement.scrollLeft;
			}
			return new Vector3(posx, posy, 0);
		},

		getRelativeCoords: function(currentElement, e) {
		    var totalOffsetX = 0;
		    var totalOffsetY = 0;
		    var canvasX = 0;
		    var canvasY = 0;
		    do {
		        totalOffsetX += currentElement.offsetLeft;
		        totalOffsetY += currentElement.offsetTop;
		    }
		    while (currentElement = currentElement.offsetParent);
			var pageLoc = this.getPageCoords(e);
		    canvasX = pageLoc.x - totalOffsetX;
		    canvasY = pageLoc.y - totalOffsetY;
		    return new Vector3(canvasX, canvasY, 0);
		},

		isRightClick: function(e) {
			var rightclick;
			if (!e) e = window.event;
			if (e.which) rightclick = (e.which == 3);
			else if (e.button) rightclick = (e.button == 2);
			return rightClick;
		}
	}
});