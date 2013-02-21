define(["Compose", "Logger", "Random"], function(Compose, Logger, Random) {
	
	var Color = Compose(function (red, green, blue, alpha) {
		
		// default is white
		if (typeof red == "undefined") red = 255;
		if (typeof green == "undefined") green = 255;
		if (typeof blue == "undefined") blue = 255;
		if (typeof alpha == "undefined") alpha = 1.0;
		
		// set the colors
		this.red = red;
		this.green = green;
		this.blue = blue;
		this.alpha = alpha;
		
	},
	{
		getRed: function() {
			return this.red;
		},
		
		getGreen: function() {
			return this.green;
		},
		
		getBlue: function() {
			return this.blue;
		},
		
		toString: function() {
			return "rgba(" + Math.round(this.red) + "," + Math.round(this.green) + "," + Math.round(this.blue) + "," + this.alpha + ")";
		},
		
		interpolate: function(col1, col2, d) {
			//var col = new Color();
			this.red = Math.round(col1.red + (col2.red - col1.red) * d);
			this.green = Math.round(col1.green + (col2.green - col1.green) * d);
			this.blue = Math.round(col1.blue + (col2.blue - col1.blue) * d);
			this.alpha = Math.round(col1.alpha + (col2.alpha - col1.alpha) * d);
			//return this;
		},

		multiply: function(ratio) {
			this.red *= ratio;
			this.green *= ratio;
			this.blue *= ratio;
			this.fix();
		},

		fix: function() {
			if (this.red > 255) this.red = 255;
			if (this.green > 255) this.green = 255;
			if (this.blue > 255) this.blue = 255;
			if (this.red < 0) this.red = 0;
			if (this.green < 0) this.green = 0;
			if (this.blue < 0) this.blue = 0;
		},

		randomAdd: function(amount, min, max) {
			this.red += Random.getDouble(-amount,  amount);
			this.green += Random.getDouble(-amount, amount);
			this.blue += Random.getDouble(-amount, amount);
			if (this.red > max) this.red = max;
			if (this.green > max) this.green = max;
			if (this.blue > max) this.blue = max;
			if (this.red < min) this.red = min;
			if (this.green < min) this.green = min;
			if (this.blue < min) this.blue = min;
		}
	});
	
	
	return Color;
});