define(["Compose", "Logger"], function(Compose, Logger) {
	
	// a fixture represents a certain obstacle used in physics - a circle or a box
	var BoxFixture = Compose(function(data) {
		this.data = data;
	},
	{
		getFixtureDef: function() {

			// create the center box
			var shape = new b2PolygonShape();
			shape.SetAsOrientedBox(this.data.width/2, this.data.height/2, new b2Vec2(this.data.loc.x, this.data.loc.y), 0);

			// create fixture
			var fd = new b2FixtureDef();
			fd.shape = shape;
			fd.density = 1.0;
			fd.friction = 0.3;

			// done
			return fd;
		},

		getMesh: function() {

			// create a mesh for this box
			var geometry = new THREE.CubeGeometry(this.data.width, this.data.height, 0.1);

			// material
			var material = new THREE.MeshBasicMaterial({
				wireframe: true,
				color: 0xFFFF00,
				opacity: 0.5,
				side: THREE.DoubleSide
			});

			// create the mesh
			var mesh = new THREE.Mesh(geometry, material);
			mesh.position = new Vector3(this.data.loc.x, this.data.loc.y, 10);
			return mesh;
		}
	});

	return BoxFixture;
});