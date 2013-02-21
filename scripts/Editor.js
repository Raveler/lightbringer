define(["Compose", "Utility", "World", "Entity", "LineDrawable"], function(Compose, Utility, World, Entity, LineDrawable) {

	// a list of drawables that can be added
	var Drawables = [LineDrawable];

	var Editor = Compose(function(renderer) {

		// canvas
		this.canvas = renderer.getCanvas();

		// renderer
		this.renderer = renderer;

		// our data
		this.data = {
			loc: new Vector2(0, 0),
			light: true,
			dynamic: false,
			health: 5
		};

		// create the basic GUI
		this.gui = new dat.GUI();
		this.gui.remember(this.data);

		// add controllers for the different fields
		this.gui.add(this.data, "light");
		this.gui.add(this.data, "dynamic");
		this.gui.add(this.data, "health");

		// drawables
		this.drawables = [];

		this.scene = new THREE.Scene();
		this.renderer.setScene(this.scene);
		this.oldObj = null;

		// no sub editor
		//this.subEditor = null;

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
			if (this.subEditor != null) this.subEditor.onMouseDown(worldCoords);
			return false;
		}.bind(this);
		this.canvas.onmousemove = function(e) {
			var relativeCoords = Utility.getRelativeCoords(this.canvas, e);
			var worldCoords = this.renderer.getWorldCoordinates(relativeCoords);
			if (this.subEditor != null) this.subEditor.onMouseMove(worldCoords);
			e.preventDefault();
			e.stopPropagation();
			return false;
		}.bind(this);
		this.canvas.onmouseup = function(e) {
			var relativeCoords = Utility.getRelativeCoords(this.canvas, e);
			var worldCoords = this.renderer.getWorldCoordinates(relativeCoords);
			if (this.subEditor != null) this.subEditor.onMouseUp(worldCoords);
			e.preventDefault();
			return false;
		}.bind(this);

		// add all objects to the editor menu
		document.getElementById("editor-menu").innerHTML = "";
		for (var i = 0; i < Drawables.length; ++i) {
			var Drawable = Drawables[i];
			var button = document.createElement("input");
			button.type = "button";
			button.value = Drawable.name;
			document.getElementById("editor-menu").appendChild(button);
			button.onclick = function(Drawable, e) {
				this.launchEditor(Drawable);
			}.bind(this, Drawable);
		}
		
	},
	{
		launchEditor: function(Drawable) {
			this.subEditor = new Drawable.editor(this);
		},

		// create the actual world & object anew
		draw: function(tempDrawable) {
			if (this.oldObj != null) this.scene.remove(this.oldObj.getMesh());
			var obj = new Entity(this.data);
			for (var i = this.drawables.length-1; i >= 0; --i) {
				obj.addDrawable(this.drawables[i]);
				console.log(this.drawables[i]);
			}
			if (typeof tempDrawable != "undefined") obj.addDrawable(tempDrawable);
			this.scene.add(obj.getMesh());
			this.oldObj = obj;
			this.renderer.draw();
		},

		add: function(drawable) {
			console.log("ADD");
			this.drawables.push(drawable);
			this.draw();
			console.log("ADD DONE");
		}
	});

	return Editor;
});