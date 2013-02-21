define(["Compose", "Entity", "Logger"], function(Compose, Entity, Logger) {

	var VertexShader = document.getElementById("VertexShader-Line").innerHTML;
	var FragmentShader = document.getElementById("FragmentShader-Line").innerHTML;

	var LineDrawable = Compose(function(data) {

		// data
		var p1 = data.p1;
		var p2 = data.p2;
		this.width = data.width;
		this.halfWidth = data.halfWidth;

		// location is the center of the line - we move to a local 
		this.loc = new Vector2((p1.x+p2.x)/2, (p1.y+p2.y)/2);

		// compute the angle of the line
		var diff = p2.clone().sub(p1);
		this.angle = Math.atan2(diff.y, diff.x);

		// length of the line
		this.length = p1.distanceTo(p2);

		// create the shape
		this.zeroWidth = this.width + (256.0 - 1.0) * this.halfWidth;
		var geometry = new THREE.CubeGeometry(this.length + this.zeroWidth * 2, this.zeroWidth * 2, 0.1);

		// create the material
		var uniforms = {
			intensity: {type: 'f', value: 1.0},
			width: {type: 'f', value: this.width},
			halfWidth: {type: 'f', value: this.halfWidth},
			color: {type: 'v3', value: new Vector3(1, 1, 1)},
			p1: {type: 'v2', value: new Vector2(-this.length/2, 0)},
			p2: {type: 'v2', value: new Vector2(this.length/2, 0)}
		};

		var material = new THREE.ShaderMaterial({
			vertexShader: VertexShader,
			fragmentShader: FragmentShader,
			uniforms: uniforms
		});
		//material.depthTest = false;
		material.transparent = true;
		material.blending = THREE.CustomBlending;
		material.blendEquation = THREE.AddEquation;
		material.blendSrc = THREE.SrcAlphaFactor;
		material.blendDst = THREE.OneMinusSrcAlphaFactor;

		// create a circle
		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.position = new Vector3(this.loc.x, this.loc.y, 0);
		this.mesh.rotation = new Vector3(0, 0, this.angle);
	},
	{
		setColor: function(color) {
			this.mesh.material.uniforms.color.value = color;
		},

		setIntensity: function(intensity) {
			this.mesh.material.uniforms.intensity.value = intensity;
		},

		getMesh: function() {
			return this.mesh;
		}
	});
	
	var LineDrawableEditor = Compose(function(editor) {
		this.editor = editor;
		this.data = {
			p1: new Vector2(0, 0),
			p2: new Vector2(0, 0),
			width: 0.2,
			halfWidth: 0.02
		};
		this.gui = new dat.GUI();
		this.gui.remember(this.template);
		this.gui.add(this.data, "width", 0.05, 5.0);
		this.gui.add(this.data, "halfWidth", 0, 5.0);

		this.down = false;
	},
	{
		destroy: function() {
			this.gui.destroy();
		},

		onMouseDown: function(coords) {
			this.data.p1 = new Vector2(coords.x, coords.y);
			this.data.p2 = new Vector2(coords.x, coords.y);
			this.editor.draw(new LineDrawable(this.data));
			this.down = true;
		},

		onMouseMove: function(coords) {
			if (this.down) {
				this.data.p2 = new Vector2(coords.x, coords.y);
				this.editor.draw(new LineDrawable(this.data));
			}
		},

		onMouseUp: function(coords) {
			this.down = false;
			this.data.p2 = new Vector2(coords.x, coords.y);
			this.editor.add(new LineDrawable(this.data));
		},
	});

	// return data structures for this object
	return {
		name: "LineDrawable",
		type: LineDrawable,
		editor: LineDrawableEditor
	}
});