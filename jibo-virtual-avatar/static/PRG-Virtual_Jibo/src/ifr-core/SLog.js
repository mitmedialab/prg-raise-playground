/**
 * @callback SlogDelegate
 * @param {string} channel
 * @param {string} message
 * @intdocs
 */

/** @type {SlogDelegate} */
// eslint-disable-next-line no-unused-vars
const _slogNOPDelegate = function(channel, message, priority){};

/** @type {boolean} */
let _printedUninitializedWarning = false;

/** @type {SlogDelegate} */
// eslint-disable-next-line no-unused-vars
const _slogWarnUninitializedDelegate = function(channel, message, priority){
	if(!_printedUninitializedWarning){
		_printedUninitializedWarning = true;
		console.log("slog used without being initialized, first usage stack:");
		console.log(new Error().stack);
	}
};

// eslint-disable-next-line no-unused-vars
const _slogConsolePrinterDelegate = function(channel, message, priority){
	console.log(channel+" : "+message);
};

/** @type {SlogDelegate} */
let _slogSelectedPrinter = _slogConsolePrinterDelegate;

/** @type {SlogDelegate} */
let _slogDefaultDelegate = _slogNOPDelegate;

/** @type {Object.<string, SlogDelegate>} */
const _slogChannelDelegates = {ERROR: _slogSelectedPrinter};


/**
 * @param {string} channel
 * @param {string} message
 * @param {string} [priority]
 */
const slog = function(channel, message, priority){
	if(_slogChannelDelegates.hasOwnProperty(channel)){
		_slogChannelDelegates[channel](channel, message, priority);
	}else{
		_slogDefaultDelegate(channel, message, priority);
	}
};

/**
 * Enum Values for default channels.
 * @enum {string}
 */
slog.BaseChannels = {
	INFO: "INFO",
	WARN: "WARN",
	ERROR: "ERROR"
};

/**
 * Enum Values for priority levels.
 * @enum {string}
 */
slog.Levels = {
	DEBUG: "DEBUG",
	INFO: "INFO",
	WARN: "WARN",
	ERROR: "ERROR"
};


/**
 * Calls slog(INFO, message).
 *
 * @param {string} message
 */
slog.info = function(message){
	slog(slog.BaseChannels.INFO, message, slog.Levels.INFO);
};

/**
 * Calls slog(WARN, message).
 *
 * @param {string} message
 */
slog.warn = function(message){
	slog(slog.BaseChannels.WARN, message, slog.Levels.WARN);
};

/**
 * Calls slog(ERROR, message).
 *
 * @param {string} message
 */
slog.error = function(message){
	slog(slog.BaseChannels.ERROR, message, slog.Levels.ERROR);
};




/**
 * Sets the default delegate which will handle all channels not explicitly
 * covered by a channel delegate.  Pass null for a NOP handler that prints nothing
 *
 * @param {SlogDelegate} slogDelegate - default delegate, null for NOP (silent) delegate
 */
slog.setDefaultDelegate = function(slogDelegate){
	if(slogDelegate == null){ //null of undefined (eqnull)
		_slogDefaultDelegate = _slogNOPDelegate;
	}else {
		_slogDefaultDelegate = slogDelegate;
	}
};

/**
 * Sets the delegate for a particular channel.  Pass null for a NOP handler that prints nothing
 * @param {string} channel
 * @param {SlogDelegate} slogDelegate - channel delegate, null for NOP (silent) delegate
 */
slog.setChannelDelegate = function(channel, slogDelegate){
	if(slogDelegate == null){ //null or undefined (eqnull)
		_slogChannelDelegates[channel] = _slogNOPDelegate;
	}else {
		_slogChannelDelegates[channel] = slogDelegate;
	}
};

/**
 * Clear the delegate from the given channel (channel will be handled by default delegate).
 * Pass null to clear all channel delegates
 *
 * @param {string} channel - channel to clear, null to clear all channels
 */
slog.clearChannelDelegate = function(channel){
	if(channel == null){ //null or undefined (eqnull)
		const channels = Object.keys(_slogChannelDelegates);
		for(let i = 0; i < channels.length; i++){
			delete(_slogChannelDelegates[channels[i]]);
		}
	}else{
		delete(_slogChannelDelegates[channel]);
	}
};

/**
 * Set the function that will be used for any channel specified to "print" without a custom delegate.
 * E.g., default behavior if setDefaultPrinting is true, setPrintChannels, setPrintAll, etc.
 *
 * This will be the print function used for any channel/default enabled after this point, it will
 * also be applied to any channel that was printing using the previous selected printer.
 *
 * Pass null to switch to basic console style printing
 *
 * @param printer
 */
slog.setPrinter = function(printer){
	let newPrinter = printer;
	if(printer == null) {
		newPrinter = _slogConsolePrinterDelegate;
	}
	const currentPrinter = _slogSelectedPrinter;

	//update all current channels to new printer
	if(_slogDefaultDelegate === currentPrinter){
		_slogDefaultDelegate = newPrinter;
	}

	//update all current channels to new printer if they were using the old printer
	const channels = Object.keys(_slogChannelDelegates);
	for(let i = 0; i < channels.length; i++){
		if(_slogChannelDelegates[channels[i]] === currentPrinter){
			_slogChannelDelegates[channels[i]] = newPrinter;
		}
	}

	_slogSelectedPrinter = newPrinter;
};

/**
 * Set the "default" behavior (behavior for channels not explicitly specified) to print or not print
 *
 * @param {boolean} print - true to print channels not explicitly specified, false to not print those channels
 */
slog.setDefaultPrinting = function(print){
	slog.setDefaultDelegate(print?_slogSelectedPrinter:_slogNOPDelegate);
};

/**
 * Convenience function to configure slog to print only the channels listed.  Clears all other
 * initialized state.
 *
 * Equivalent to setting the default delegate to NOP delegate, setting the given channels
 * to simple console printing delegates, and clearing all other channel delegates
 *
 * @param {string[]} channels - channels to print, null same as setPrintNone
 */
slog.setPrintChannels = function(channels){
	slog.setDefaultDelegate(null);
	slog.clearChannelDelegate(null);
	if(channels != null){
		for(let i = 0; i < channels.length; i++) {
			slog.setChannelDelegate(channels[i], _slogSelectedPrinter);
		}
	}
};

/**
 *
 * @param {string[]} channels - channels to add to set that will print
 */
slog.addPrintChannels = function(channels){
	if(channels != null){
		for(let i = 0; i < channels.length; i++) {
			slog.setChannelDelegate(channels[i], _slogSelectedPrinter);
		}
	}
};

/**
 *
 * @param {string[]} channels - channels to remove to set that will print
 */
slog.removePrintChannels = function(channels){
	if(channels != null){
		for(let i = 0; i < channels.length; i++) {
			slog.setChannelDelegate(channels[i], _slogNOPDelegate);
		}
	}
};


/**
 * Convenience function to configure slog to print all channels.  Clears all other
 * initialized state.
 *
 * Equivalent to setting the default delegate to a simple console printing delegate
 * and clearing all channel delegates
 */
slog.setPrintAll = function(){
	slog.setDefaultDelegate(_slogSelectedPrinter);
	slog.clearChannelDelegate(null);
};

/**
 * Convenience function to configure slog to print nothing.  Clears all other
 * initialized state.
 *
 * Equivalent to setting the default delegate to a NOP delegate
 * and clearing all channel delegates
 */
slog.setPrintNone = function(){
	slog.setDefaultDelegate(_slogNOPDelegate);
	slog.clearChannelDelegate(null);
};

/**
 *
 * @param {function} debug - send enabled debug channels to this function
 * @param {function} info - send enabled info channels to this function
 * @param {function} warnings - enable warnings and send them to this function (if non-null)
 * @param {function} errors - enable errors and send them to this function (if non-null)
 */
slog.wrapLog = function(debug, info, warnings, errors){
	slog.setPrinter((channel, message, priority)=>{
		if(priority === slog.Levels.DEBUG){
			debug(channel, message);
		}else if(priority === undefined || priority === slog.Levels.INFO){
			info(channel, message);
		}else if(priority === slog.Levels.WARN){
			warnings(channel, message);
		}else if(priority === slog.Levels.ERROR){
			errors(channel, message);
		}
	});

	//Keep these WARN/ERROR channels up for backwards compatibility
	// also, send all channel messages into the eponymous priority

	// eslint-disable-next-line no-unused-vars
	slog.setChannelDelegate(slog.BaseChannels.WARN, (channel, message, priority)=>{
		warnings(channel, message);
	});

	// eslint-disable-next-line no-unused-vars
	slog.setChannelDelegate(slog.BaseChannels.ERROR, (channel, message, priority)=>{
		errors(channel, message);
	});
};


export default slog;