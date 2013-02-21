define(["Compose", "Logger"], function(Compose, Logger) {
	
	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	var b2BodyDef = Box2D.Dynamics.b2BodyDef;
	var b2Body = Box2D.Dynamics.b2Body;
	var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	var b2Fixture = Box2D.Dynamics.b2Fixture;
	var b2World = Box2D.Dynamics.b2World;
	var b2MassData = Box2D.Collision.Shapes.b2MassData;
	var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
	var b2AABB = Box2D.Collision.b2AABB;

	var World = Compose(function(size) {

		// size
		this.size = size;

		// create the scene
		this.scene = new THREE.Scene();

		// gravity
		var gravity = new b2Vec2(0.0, 0.1);
		var doSleep = true;

		// create world
		this.world = new b2World(gravity, doSleep);

	/*	var groundBodyDef = new b2BodyDef();
		groundBodyDef.position.Set(0.0, 0.5);
		var groundBody = this.world.CreateBody(groundBodyDef);
		var groundShape = new b2PolygonShape();
		groundShape.SetAsBox(50.0, 0.01);
		var fd = new b2FixtureDef();
		fd.shape = groundShape;
		fd.density = 1.0;
		var fixture = groundBody.CreateFixture(fd);*/

		// entities
		this.objects = [];

		var debugDraw = new Box2D.Dynamics.b2DebugDraw;
		var canvas = document.getElementById("debugcanvas");
		canvas.width = 800;
		canvas.height = 600;
		var ctx = canvas.getContext("2d");
		ctx.translate(canvas.width/2, canvas.height/2);
		//ctx.scale(canvas.width/10, canvas.width/10);
		//ctx.scale(2/canvas.width, 2/canvas.width);
		//ctx.scale(canvas.height/4, canvas.height/4);
		ctx.fillStyle = "#0000FF";
		debugDraw.SetSprite(ctx);
		debugDraw.SetDrawScale(canvas.height/2);
		debugDraw.SetFillAlpha(0.5);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		this.world.SetDebugDraw(debugDraw);
		this.debugCtx = ctx;

		// the contact listener
		this.contactListener = Box2D.Dynamics.b2ContactListener;
		this.contactListener.BeginContact = function(contact) {
			var e1 = contact.GetFixtureA().GetBody().GetUserData();
			var e2 = contact.GetFixtureB().GetBody().GetUserData();
			if (e1.light == e2.light) return;
			console.log("BEGIN CONTACT BETWEEN " + e1.id + " and " + e2.id);
			e1.addCollision();
			e2.addCollision();
		}.bind(this);
		this.contactListener.EndContact = function(contact) {
			var e1 = contact.GetFixtureA().GetBody().GetUserData();
			var e2 = contact.GetFixtureB().GetBody().GetUserData();
			if (e1.light == e2.light) return;
			console.log("END CONTACT BETWEEN " + e1.id + " and " + e2.id);
			e1.removeCollision();
			e2.removeCollision();
		}.bind(this);
		this.contactListener.PreSolve = function(contact, oldManifold) {
			//console.log("PRESOLVE BETWEEN " + contact.GetFixtureA().GetBody().GetUserData().id + " and " + contact.GetFixtureB().GetBody().GetUserData().id);
			// nothing
		}.bind(this);
		this.contactListener.PostSolve = function(contact, impulse) {
			//console.log("POSTSOLVE BETWEEN " + contact.GetFixtureA().GetBody().GetUserData().id + " and " + contact.GetFixtureB().GetBody().GetUserData().id);
			//var entity1 = contact.GetFixtureA().GetBody().GetUserData();
			//var entity2 = contact.GetFixtureB().GetBody().GetUserData();
			//this.resolveCollision(entity1, entity2);
		}.bind(this);
		this.world.SetContactListener(this.contactListener);


	},
	{
		update: function(dt) {

			// update the physics
			var timeStep = 1.0 / 60.0;
			var iterations = 10;
			this.world.Step(timeStep, iterations);
			this.debugCtx.clearRect(-500, -500, 1000, 1000);
			//this.world.DrawDebugData();
			this.world.ClearForces();

			// go over all objects and update them
			for (var i = 0; i < this.objects.length; ++i) {
				var obj = this.objects[i];
				obj.update(dt);
				if (obj.isDead()) {
					Logger.log("destroy object!");
					this.world.DestroyBody(obj.body);
					this.scene.remove(obj.getMesh());
					this.objects.splice(i, 1);
					--i;
				}
			}
		},

		addObject: function(obj) {
			obj.addToWorld(this.world);
			this.scene.add(obj.getMesh());
			//this.scene.add(obj.drawables[0].getMesh());
			this.objects.push(obj);
		},

		getScene: function() {
			return this.scene;
		},

		resolveCollision: function(e1, e2) {

			// they are opposite types - we actually do something
			if (e1.light == e2.light) return;

			// we reduce the intensity of the light
			e1.reduceIntensity();
			e2.reduceIntensity();
		}
	});

	return World;
});