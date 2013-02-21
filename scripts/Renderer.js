define(["Compose"], function(Compose) {

	var Renderer = Compose(function(div) {

			// set the scene size
			this.width = div.offsetWidth;
			this.height = div.offsetHeight;

			// set some camera attributes
			var VIEW_ANGLE = 45,
			  ASPECT = this.width / this.height,
			  NEAR = 0.1,
			  FAR = 20000;

			// get the DOM element to attach to
			// - assume we've got jQuery to hand
			var container = div;

			// create a WebGL renderer, camera
			// and a scene
			this.renderer = new THREE.WebGLRenderer({
				sortObjects: true
			});
			this.renderer.sortObjects = true;
			var renderer = this.renderer;
			this.camera = new THREE.OrthographicCamera(-ASPECT, ASPECT, -1, 1, 1, 1000);

			// the camera starts at 0,0,0
			// so pull it back
			this.camera.position.z = 200;
			this.camera.up = new Vector3(0, 1, 0);
			this.camera.lookAt(new Vector3(0, 0, 0));

			// start the renderer
			renderer.setSize(this.width, this.height);

			// attach the rendererder-supplied DOM element
			this.canvas = renderer.domElement;
			this.canvas.id = "canvas";
			//container.appendChild(this.canvas);
			container.insertBefore(this.canvas,container.firstChild);

			// projector
			this.projector = new THREE.Projector;
	},
	{
		addObject: function(obj) {
			this.scene.add(obj);
		},

		addLight: function(light) {

			// calculate the radius of the circle that will represent the light
			var radius = (light.intensity * 256 - 1) * light.halfDistance; // this is the point at which the light intensity is rounded to 0

			// create the material
			var uniforms = {
				intensity: {type: 'f', value: light.intensity},
				halfDistance: {type: 'f', value: light.halfDistance},
				color: {type: 'v3', value: light.color}
			};

			var material = new THREE.ShaderMaterial({
				vertexShader: document.getElementById("shader-vs").innerHTML,
				fragmentShader: document.getElementById("shader-fs").innerHTML,
				uniforms: uniforms
			});
			material.transparent = true;
	/*		material.blending = "CustomBlending";
			material.
*/
			// create the circle geometry
			var circle = new THREE.CircleGeometry(radius, 20);

			// create a circle
			var obj = new THREE.Mesh(circle, material);
			obj.position = light.loc;
			this.scene.add(obj);
		},

		viewportToWorld: function(elementLoc) {
			var viewportLoc = vec3.fromValues(elementLoc[0] / this.canvas.width * 2 - 1, -(elementLoc[1] / this.canvas.height * 2 - 1), 0.0);
			var worldLoc = vec3.create();
			vec3.transformMat4(worldLoc, viewportLoc, this.pMatrixInv);
			return worldLoc;
		},

		getGL: function() {
			return this.gl;
		},

		setScene: function(scene) {
			this.scene = scene;
			this.scene.add(this.camera);
		},

		draw: function() {
			this.renderer.render(this.scene, this.camera);
		},

		getCanvas: function() {
			return this.canvas;
		},

		getWorldCoordinates: function(canvasCoords) {

			// first, transform the canvas coords to [-1,1]
			var x = canvasCoords.x / this.canvas.width * 2 - 1;
			var y = -(canvasCoords.y / this.canvas.height * 2 - 1);

			// then, unproject onto the world
			var worldCoordinates = new Vector3(x, y, 0);
			worldCoordinates = this.projector.unprojectVector(worldCoordinates, this.camera);
			return worldCoordinates;
		}
	});

	return Renderer;
});