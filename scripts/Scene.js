define(["Compose", "Light"], function(Compose, Light) {

	var Scene = Compose(function(gl) {

		// gl
		this.gl = gl;

		// objects in the scene
		this.objects = [];
	},
	{
		loadScene: function(json) {

			// if json was specified, we get the objects from the json
			if (typeof json != "undefined") {
				for (var i = 0; i < json.lights.length; ++i) {
					var data = json.lights[i];
					var light = new Light(vec3.fromValues(data.loc[0], data.loc[1], data.loc[2]), vec3.fromValues(data.color[0], data.color[1], data.color[2]), data.intensity, data.halfDistance);
					light.init(this.gl);
					this.objects.push(light);
				}
			}
		},

		add: function(obj) {
			obj.init(this.gl);
			this.objects.push(obj);
		},

		remove: function(obj) {
			for (var i = 0; i < this.objects.length; ++i) {
				if (this.objects[i] == obj) {
					this.objects.splice(i, 1);
					return;
				}
			}
		},

		sort: function() {
			this.objects.sort(function(a, b) {
				if (a.loc.z > b.loc.z + EPS) return -1;
				else if (a.loc.z < b.loc.z - EPS) return 1;
				else return 0;
			});
		}
	});

	return Scene;
});