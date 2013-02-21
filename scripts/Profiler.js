define(["Compose"], function(Compose) {

	// list of profiles by name
	var profilesByName = {};

	// array of profiles
	var profiles = [];

	// the div to write to
	var div = null;

	// update
	function update() {
		div.innerHTML = '';
		profiles.sort(function(a, b) {
			if (a.totalTime > b.totalTime) return -1;
			else if (a.totalTime < b.totalTime) return 1;
			return 0;
		});
		for (var i = 0; i < profiles.length; ++i) {
			var profile = profiles[i];
			var secs = Math.round(profile.totalTime / 10) / 100;
			var avg = Math.round(secs / profile.nCalls * 100) / 100;
			div.innerHTML += profile.name + ": " + secs + "s ( " + profile.nCalls + " calls, avg " + avg + ")<br/>";
		}
	}

	return {
		/*profile: function(obj, fun, name) {
			var profile = profilesByName[name];
			if (!profile) {
				profile = {
					name: name,
					nCalls: 0,
					totalTime: 0
				};
				profilesByName[name] = profile;
				profiles.push(profile);
			}
			var startTime = new Date().getTime();
			var args = [];
			for (var i = 3; i < arguments.length; ++i) args.push(arguments[i]);
				console.log(args);
			fun.apply(obj, args);
			var stopTime = new Date().getTime();
			++profile.nCalls;
			profile.totalTime += stopTime - startTime;
		},*/
		profile: function(name, fun) {
			return function() {
				var profile = profilesByName[name];
				if (!profile) {
					profile = {
						name: name,
						nCalls: 0,
						totalTime: 0
					};
					profilesByName[name] = profile;
					profiles.push(profile);
				}
				var startTime = new Date().getTime();
				fun.apply(this, arguments);
				var stopTime = new Date().getTime();
				++profile.nCalls;
				profile.totalTime += stopTime - startTime;
			};
		},

		start: function(name) {
			var profile = profilesByName[name];
			if (!profile) {
				profile = {
					name: name,
					nCalls: 0,
					totalTime: 0
				};
				profilesByName[name] = profile;
				profiles.push(profile);
			}
			profile.startTime = new Date().getTime();
		},

		stop: function(name) {
			var profile = profilesByName[name];
			if (!profile) return;
			var stopTime = new Date().getTime();
			++profile.nCalls;
			profile.totalTime += stopTime - profile.startTime;
		},

		updateProfileData: function(newDiv, dt) {
			div = newDiv;
			window.setInterval(update, dt);
		}
	};
});