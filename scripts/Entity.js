define(["Compose"], function(Compose) {

	var IdCounter = 0;

	var Entity = Compose(function(data) {

		// id
		this.id = ++IdCounter;

		// color
		if (data.light === undefined || data.light) {
			this.light = true;
			this.color = new Vector3(1, 1, 1);
			this.z = 0;
		}
		else {
			this.light = false;
			this.color = new Vector3(0, 0, 0);
			this.z = 5;
		}

		// location
		this.loc = new Vector3(data.loc.x, data.loc.y, this.z);

		// dynamic?
		if (data.dynamic === undefined) this.dynamic = true;
		else this.dynamic = data.dynamic;

		// health - used to determine how long an object "survives" on collision
		if (data.health === undefined) this.maxHealth = 5;
		else this.maxHealth = data.health;
		this.health = this.maxHealth;

		// intensity
		this.intensity = 1.0;

		// dead?
		this.dead = false;

		// collisions
		this.collisions = 0;

		// drawables
		this.drawables = [];

		// fixtures
		this.fixtures = [];

		// create the mesh for this entity - this will contain all drawables
		this.mesh = new THREE.Object3D();
		this.mesh.position = this.loc;
	},
	{
		addToWorld: function(world) {
			var bodyDef = new b2BodyDef();
			bodyDef.position.Set(this.loc.x, this.loc.y);
			bodyDef.angle = 0.0;
			if (this.dynamic) bodyDef.type = b2Body.b2_dynamicBody;
			this.body = world.CreateBody(bodyDef);
			for (var i = 0; i < this.fixtures.length; ++i) {
				this.body.CreateFixture(this.fixtures[i].getFixtureDef());
			}	
			this.body.SetUserData(this);
		},

		getMesh: function() {
			return this.mesh;
		},

		addDrawable: function(drawable) {
			this.drawables.push(drawable);
			drawable.setIntensity(this.intensity);
			drawable.setColor(this.color);
			this.mesh.add(drawable.getMesh());
		},

		addFixture: function(fixture) {
			this.fixtures.push(fixture);
			this.mesh.add(fixture.getMesh());
		},

		update: function(dt) {
			var pos = this.body.GetPosition();
			this.loc = new Vector3(pos.x, pos.y, this.z);
			this.angle = this.body.GetAngle();
			this.mesh.position = this.loc;
			this.mesh.rotation = new Vector3(0, 0, this.angle);
			for (var i = 0; i < this.collisions; ++i) this.reduceIntensity(dt);
		},

		addCollision: function() {
			++this.collisions;
		},

		removeCollision: function() {
			--this.collisions;
		},

		reduceIntensity: function(dt) {
			this.health -= dt;
			// we are dead!
			if (this.health <= 0) {
				this.destroy(); // handled by subclass
				return;
			}

			// we reduce the parameters based our health
			this.intensity = this.health / this.maxHealth;
			for (var i = 0; i < this.drawables.length; ++i) {
				var drawable = this.drawables[i];
				drawable.setIntensity(this.intensity);
			}
		},

		destroy: function() {
			this.dead = true;
		},

		isDead: function() {
			return this.dead;
		}
	});

	return Entity;
});