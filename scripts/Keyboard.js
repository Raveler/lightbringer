define(["Compose", "Controller", "Logger", "CommandHandler"], function(Compose, Controller, Logger, CommandHandler) {

	// keys
	var keys = [];
	var keyDown = function(e) {
		for (var i = 0; i < keys.length; ++i) {
			if (keys[i] == e.keyCode) {
				if (e.keyCode != 116) {
					e.preventDefault();
					return false;
				}
				else return true;
			}
		}
		keys.push(e.keyCode);
		CommandHandler.issueCommand('keyDown' + e.keyCode);
		if (e.keyCode != 116) {
			e.preventDefault();
			return false;
		}
		return true;

	};
	
	var keyUp = function(e) {
		for (var i = 0; i < keys.length; ++i) {
			if (keys[i] == e.keyCode) {
				keys.splice(i, 1);
				--i;
			}
		}
		CommandHandler.issueCommand('keyUp' + e.keyCode);
		if (e.keyCode != 116) {
			e.preventDefault();
			return false;
		}
		return true;
	};

	document.onkeydown = keyDown;
	document.onkeyup = keyUp;

	return {
		update: function() {
			for (var i = 0; i < keys.length; ++i) {
				CommandHandler.issueCommand('key ' + keys[i]);
			}
		},

		addKey: function(keyCode, callback) {
			CommandHandler.addCommandListener('key' + keyCode, callback);
		},

		addKeyDown: function(keyCode, callback) {
			CommandHandler.addCommandListener('keyDown' + keyCode, callback);
		},

		addKeyUp: function(keyCode, callback) {
			CommandHandler.addCommandListener('keyUp' + keyCode, callback);
		},

		isDown: function(keyCode) {
			for (var i = 0; i < keys.length; ++i) {
				if (keys[i] == keyCode) return true;
			}
			return false;
		},

		reset: function() {
			CommandHandler.reset();
		}
	}
});