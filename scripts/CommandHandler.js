define(["Compose", "Logger"], function(Compose, Logger) {

	// command listeners
	var commandListeners = [];

	// return the API
	return {

		addCommandListener: function(command, listener) {
			if (typeof commandListeners[command] == 'undefined') commandListeners[command] = [];
			commandListeners[command].push(listener);
		},
		
		issueCommand: function(command) {
			if (typeof commandListeners[command] == 'undefined') return;

			// copy arguments
			var args = [];
			for (var i = 1; i < arguments.length; ++i) args.push(arguments[i]);
				
			for (var i = 0; i < commandListeners[command].length; ++i) {
				commandListeners[command][i].apply(null, args);
			}
		},

		reset: function() {
			commandListeners = [];
		}
	};
});