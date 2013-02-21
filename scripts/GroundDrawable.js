define(["Compose", "Entity", "Logger", "Data"], function(Compose, Entity, Logger, Data) {

	var VertexShader = document.getElementById("VertexShader-Block").innerHTML;
	var FragmentShader = document.getElementById("FragmentShader-Block").innerHTML;

	var GroundDrawable = Compose(function(data) {
console.log(data);
		// size of the ground drawable - in blocks
		this.size = new Vector2(data.size.x, data.size.y);

		// size in world points
		this.worldSize = this.size.clone().multiplyScalar(Data.blockSize);

		// top left block of this drawable - in blocks
		this.loc = new Vector2(data.loc.x, data.loc.y);

		// world loc
		this.worldLoc = this.loc.clone().multiplyScalar(Data.blockSize);
		
		// half width
		this.halfWidth = data.halfWidth;

		// zero width
		this.zeroWidth = (256.0 - 1.0) * this.halfWidth;
		//this.zeroWidth = 0.0;

		// create the material
		var uniforms = {
			halfWidth: {type: 'f', value: this.halfWidth},
			intensity: {type: 'f', value: 1.0},
			color: {type: 'v3', value: new Vector3(1, 1, 1)},
			loc: {type: 'v2', value: this.worldLoc},
			size: {type: 'v2', value: this.worldSize}
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

		// the geometry
		var geometry = new THREE.CubeGeometry(this.worldSize.x + this.zeroWidth, this.worldSize.y + this.zeroWidth, 0.1);

		// create a circle
		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.position = new Vector3(this.worldLoc.x + this.worldSize.x/2, this.worldLoc.y + this.worldSize.y/2, 0);
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


	// return data structures for this object
	return GroundDrawable;
});