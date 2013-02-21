
require(["Logger", "FPSTimer", "Color", "Random", "Renderer", "Light", "Scene", "Editor", "World", "Entity", "LineDrawable", "BoxFixture", "Editor", "GroundDrawable", "WorldEditor"], function callback(Logger, FPSTimer, Color, Random, Renderer, Light, Scene, Editor, World, Entity, LineDrawable, BoxFixture, Editor, GroundDrawable, WorldEditor) {

	// set some globals for convenience
	window.EPS = 0.00001;
	window.Vector2 = THREE.Vector2;
	window.Vector3 = THREE.Vector3;
	window.Matrix4 = THREE.Matrix4;

	window.b2Vec2 = Box2D.Common.Math.b2Vec2;
	window.b2BodyDef = Box2D.Dynamics.b2BodyDef;
	window.b2Body = Box2D.Dynamics.b2Body;
	window.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	window.b2Fixture = Box2D.Dynamics.b2Fixture;
	window.b2World = Box2D.Dynamics.b2World;
	window.b2MassData = Box2D.Collision.Shapes.b2MassData;
	window.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	window.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	window.b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
	window.b2AABB = Box2D.Collision.b2AABB;

	// logger
	document.getElementById("log").appendChild(Logger.getElement());


	// some menu stuff
	document.getElementById("menu-editor").onclick = function(e) {
		launchEditor();
	}
	document.getElementById("menu-main").onclick = function(e) {
		launchGame();
	}

	function launchEditor() {

		// set up renderer
		document.getElementById("editor").style.display = "inline-block";
		var renderer = new Renderer(document.getElementById("editor-container"));

		// create editor
		var editor = new WorldEditor(renderer);

		// update & draw
		var timer = new FPSTimer(60, function(dt) {
			renderer.draw();
			document.getElementById("fps").innerHTML = timer.getFPS() + " FPS";

		});
		timer.start();
	}

	function launchGame() {

		// set up renderer
		document.getElementById("main").style.display = "inline-block";
		var renderer = new Renderer(document.getElementById("main-container"));

		// create world
		var world = new World(new Vector2(500, 500));

		// create an object
		var obj = new Entity({
			light: true,
			loc: new Vector2(0, 0),
			dynamic: true,
			health: 20
		});
		obj.addDrawable(new LineDrawable.type({
			p1: new Vector2(-0.3, 0),
			p2: new Vector2(0.6, 0),
			width: 0.2,
			halfWidth: 0.2
		}));
		obj.addFixture(new BoxFixture({
			width: 1.3,
			height: 0.4,
			loc: new Vector2(0.15, 0)
		}));
		world.addObject(obj);

		// bottom object
		obj = new Entity({
			light: false,
			loc: new Vector2(0, 1),
			dynamic: false,
			health: 5
		});
		obj.addDrawable(new LineDrawable.type({
			p1: new Vector2(-0.3, 0),
			p2: new Vector2(0.6, 0),
			width: 0.2,
			halfWidth: 0.05
		}));
		obj.addFixture(new BoxFixture({
			width: 1.3,
			height: 0.4,
			loc: new Vector2(0.15, 0)
		}));
		world.addObject(obj);

		// ground
		obj = new Entity({
			light: true,
			loc: new Vector2(0, 0),
			dynamic: false,
			health: 5
		});
		obj.addDrawable(new GroundDrawable({
			halfWidth: 0.05,
			loc: new Vector2(0, 0),
			size: new Vector2(10, 3)
		}));
		world.addObject(obj);

		// set the scene
		renderer.setScene(world.getScene());

		// update & draw
		var timer = new FPSTimer(60, function(dt) {
			world.update(dt/1000.0);
			renderer.draw();
			document.getElementById("fps").innerHTML = timer.getFPS() + " FPS";

		});
		timer.start();
	}

	launchEditor();
});