define(["Compose"], function(Compose) {

	var Light = Compose(function(loc, color, intensity, halfDistance) {
		this.loc = loc;
		this.color = color;
		this.intensity = intensity;
		this.halfDistance = halfDistance;
	},
	{
		init: function(gl) {

			// initial values
			var loc = this.loc;
			var intensity = this.intensity;

			// first, generate a circle of triangles radiating from the center of the light
			this.positionBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
			var nTriangles = 10;
			var dTheta = 2 * Math.PI / nTriangles;
			var vertices = [];
			var radius = (this.intensity * 256 - 1) * this.halfDistance; // this is the point at which the light intensity is rounded to 0
			for (var i = 0; i < nTriangles; ++i) {
				var theta = i / nTriangles * 2 * Math.PI;
				var nextTheta = theta + dTheta;
				vertices.push(0, 0, 0);
				vertices.push(radius * Math.cos(theta), radius * Math.sin(theta), 0);
				vertices.push(radius * Math.cos(nextTheta), radius * Math.sin(nextTheta), 0);
			}
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			this.positionBuffer.itemSize = 3;
			this.positionBuffer.numItems = nTriangles*3;

			// then, generate the colors for all the vertices
			this.colorBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
			var colors = [];
			for (var i = 0; i < nTriangles; ++i) {
				colors.push(1, 1, 1, 1);
				colors.push(1, 1, 1, 1);
				colors.push(1, 1, 1, 1);
			}
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
			this.colorBuffer.itemSize = 4;
		}
	});

	return Light;
});