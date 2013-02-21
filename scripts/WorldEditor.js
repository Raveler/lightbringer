define(["Compose", "Utility", "World", "Entity", "Block", "Data"], function(Compose, Utility, World, Entity, Block, Data) {

	var WorldEditor = Compose(function(renderer, worldData) {

		// no world data - create a new world
		if (worldData === undefined) {
			this.worldData = {};
		}
		else {
			this.worldData = worldData;
		}

		// canvas
		this.canvas = renderer.getCanvas();

		// renderer
		this.renderer = renderer;

		// mouse down?
		this.mouseDown = false;

		// block size
		this.blockSize = new Vector2(1, 1);

		// temp block
		this.tempBlock = null;

		// scene
		this.scene = new THREE.Scene();
		this.renderer.setScene(this.scene);

		// configurable options
		this.data = {
			light: true,
			dynamic: true
		};

		// create the basic GUI
		this.gui = new dat.GUI();
		this.gui.remember(this.data);

		// add controllers for the different fields
		this.gui.add(this.data, "light");
		this.gui.add(this.data, "dynamic");


		// add click event handler to the canvas - this spawns a light at the selected position
		this.canvas.oncontextmenu = function(e) {
			e.preventDefault();
			return false;
		};
		this.canvas.onmousedown = function(e) {
			e.preventDefault();
			e.stopPropagation();
			var relativeCoords = Utility.getRelativeCoords(this.canvas, e);
			var worldCoords = this.renderer.getWorldCoordinates(relativeCoords);
			this.mouseDown = true;
			this.onMouseDown(worldCoords, Utility.isRightClick(e));
			return false;
		}.bind(this);
		this.canvas.onmousemove = function(e) {
			var relativeCoords = Utility.getRelativeCoords(this.canvas, e);
			var worldCoords = this.renderer.getWorldCoordinates(relativeCoords);
			this.onMouseMove(worldCoords, this.mouseDown);
			e.preventDefault();
			e.stopPropagation();
			return false;
		}.bind(this);
		this.canvas.onmouseup = function(e) {
			var relativeCoords = Utility.getRelativeCoords(this.canvas, e);
			var worldCoords = this.renderer.getWorldCoordinates(relativeCoords);
			this.mouseDown = false;
			this.onMouseUp(worldCoords, Utility.isRightClick(e));
			e.preventDefault();
			return false;
		}.bind(this);

		// add a line grid
		for (var x = -1000; x < 1000; ++x) {
			var material = new THREE.LineBasicMaterial({color: 0x0000ff});
			var geometry = new THREE.Geometry();
			geometry.vertices.push(x*Data.blockSize, -1000, 20);
			geometry.vertices.push(x*Data.blockSize, 1000, 20);
			var line = new THREE.Line(geometry, material);
			this.scene.add(line);

		}
	},
	{
		onMouseDown: function(coords, rightClick) {

		},

		onMouseMove: function(coords, mouseDown) {

			// remove previous temp block
			if (this.tempBlock != null) this.scene.remove(this.tempBlock.getMesh());

			// add a block of the proper size on the grid
			var blockCoords = new Vector2(Math.floor(coords.x/Data.blockSize)*Data.blockSize, Math.floor(coords.y/Data.blockSize)*Data.blockSize);
			this.data.loc = blockCoords;
			this.data.size = this.blockSize;
			var block = new Block(this.data);
			this.scene.add(block.getMesh());
			this.tempBlock = block;
		},

		onMouseUp: function(coords, rightClick) {

		}
	});

	return WorldEditor;
});