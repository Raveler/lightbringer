define(["Compose", "Logger", "CommandHandler"], function(Compose, Logger, CommandHandler) {
	
	// command listeners
	var Controller = Compose(function constructor() {
	},
	{
		addCommandListener: function(command, listener) {
			CommandHandler.addCommandListener(command, listener);
		}
	});
	
	
	
	return Controller;
});