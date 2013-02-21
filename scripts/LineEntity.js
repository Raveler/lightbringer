define(["Compose", "Entity", "Logger"], function(Compose, Entity, Logger) {

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

	var VertexShader = document.getElementById("VertexShader-LineEntity").innerHTML;
	var FragmentShader = document.getElementById("FragmentShader-LineEntity").innerHTML;

	var LineEntity = Compose(Entity, function(data, p1, p2) {

		// location is the center of the line - we move to a local 
		this.loc = new Vector2((p1.x+p2.x)/2, (p1.y+p2.y)/2);

		// compute the angle of the line
		var diff = p2.clone().sub(p1);
		this.angle = Math.atan2(diff.y, diff.x);

		// length of the line
		this.length = p1.distanceTo(p2);

		// create the shape
		var geometry = new THREE.CubeGeometry(this.length + this.zeroWidth * 2, this.zeroWidth * 2, 0.1);

		// create the material
		var uniforms = {
			intensity: {type: 'f', value: this.intensity},
			width: {type: 'f', value: this.width},
			halfWidth: {type: 'f', value: this.halfWidth},
			color: {type: 'v3', value: this.color},
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
		this.mesh.position = new Vector3(this.loc.x, this.loc.y, this.z);
		this.mesh.rotation = new Vector3(0, 0, this.angle);
	},
	{
		getMesh: function() {
			return this.mesh;
		},

		createBody: function(world) {

			// create the body centered in the middle between the points
			var bodyDef = new b2BodyDef();
			var pos = this.loc;
			bodyDef.position.Set(pos.x, pos.y);
			bodyDef.angle = this.angle;
			if (this.dynamic) bodyDef.type = b2Body.b2_dynamicBody;
			var body = world.CreateBody(bodyDef);

			// create the center box
			var shape = new b2PolygonShape();
			shape.SetAsBox(this.length/2, this.width);
			//shape.SetAsBox(0.2, 0.01);

			//shape.SetAsBox(0.3, 0.3);
			var fd = new b2FixtureDef();
			fd.shape = shape;
			fd.density = 1.0;
			fd.friction = 0.3;
			body.CreateFixture(fd);

			// create the two circles at the ends of the entity
			shape = new b2CircleShape();
			shape.SetLocalPosition(new b2Vec2(this.length/2 - this.width, 0));
			shape.SetRadius(this.width);
			fd.shape = shape;
			body.CreateFixture(fd);
			shape = new b2CircleShape();
			shape.SetLocalPosition(new b2Vec2(-this.length/2 + this.width, 0));
			shape.SetRadius(this.width);
			fd.shape = shape;
			body.CreateFixture(fd);

			// add ourselves as user data
			body.SetUserData(this);

			// add the final shape
			this.body = body;
			this.body.SetFixedRotation(false);
			this.body.SetAngle(-this.angle);
		}
	});

	return LineEntity;
});