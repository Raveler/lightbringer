define(["Compose"], function(Compose) {

	var IdCounter = 0;

	var Drawable = Compose(function(data) {

		// color
		if (data.light === undefined || data.light) {
			this.light = true;
			this.color = new Vector3(1, 1, 1);
			this.z = 0;
		}
		else {
			this.light = false;
			this.color = new Vector3(0, 0, 0);
			this.z = 5;
		}

		// width
		if (data.width === undefined) this.width = 0.1;
		else this.width = data.width;

		// half-width
		if (data.halfWidth === undefined) this.halfWidth = 0.5;
		else this.halfWidth = data.halfWidth;

		// dynamic?
		if (data.dynamic === undefined) this.dynamic = true;
		else this.dynamic = data.dynamic;

		// the zero width - the point at which the intensity becomes 0
		this.zeroWidth = (256-1) * this.halfWidth;
	},
	{
		
	});

	return Drawable;
});