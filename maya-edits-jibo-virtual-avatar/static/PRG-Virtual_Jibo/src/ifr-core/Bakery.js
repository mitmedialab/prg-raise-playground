"use strict";

import slog from "./SLog.js";

let theBaker = null;

const Bakery = {};

let printedInitializeWarning = false;

/**
 * Initialize the Bakery with a specific Bakery implementation.  This should be called once, the result is cached
 * statically so subsequent calls to getFloat etc. will display their UI via the given implementation.
 *
 * @param {Object} bakeryImplementation
 */
Bakery.init = function(bakeryImplementation){
	if(theBaker === null) {
		theBaker = bakeryImplementation;
	}else{
		slog.warn("Warning, Bakery initialized multiple times!");
		theBaker = bakeryImplementation;
	}
};

const getBaker = function(tabName){ // eslint-disable-line no-unused-vars
	return theBaker; //only one baker for now, keeping this function as placeholder for path to baker index.
};

const printUnInitializedWarning = function(){
	if(!printedInitializeWarning) {
		slog.info("Bakery values requested by Bakery never initialized");
		printedInitializeWarning = true;
	}
};

/**
 * First call will initialize/display a slider with the provided name in the
 * tab listed.  If tabName is an array of strings, there will be set of nested
 * tabs.
 * @param {string} name - name of slider
 * @param {number} min - minimum of slider
 * @param {number} max - maximum of slider
 * @param {number} initial - initial value of slider and produced value
 * @param {string | string[]} [tabName] - the tab name (or path) to display the ui in.  put in "default" tab if omitted
 * @returns {number}
 */
Bakery.getFloat = function(name, min, max, initial, tabName){
	const useBaker = getBaker(tabName);
	if(useBaker!==null){
		return useBaker.getFloat(name, min, max, initial, tabName);
	}else{
		printUnInitializedWarning();
		return initial;
	}
};

/**
 * First call will initialize/display a checkbox with the provided name in the
 * tab listed.  If tabName is an array of strings, there will be set of nested
 * tabs.
 * @param {string} name - name of checkbox
 * @param {boolean} initial - initial value of checkbox and produced value
 * @param {string | string[]} [tabName] - the tab name (or path) to display the ui in.  put in "default" tab if omitted
 * @returns {boolean}
 */
Bakery.getBoolean = function(name, initial, tabName){
	const useBaker = getBaker(tabName);
	if(useBaker!==null){
		return useBaker.getBoolean(name, initial, tabName);
	}else{
		printUnInitializedWarning();
		return initial;
	}
};


/**
 * First call will initialize/display a button with the provided name in the
 * tab listed.  If tabName is an array of strings, there will be set of nested
 * tabs.
 * @param {string} name - name of button
 * @param callback - callback called when button pressed
 * @param {string | string[]} [tabName] - the tab name (or path) to display the ui in.  put in "default" tab if omitted
 */
Bakery.makeButton = function(name, callback, tabName){
	const useBaker = getBaker(tabName);
	if(useBaker!==null){
		useBaker.makeButton(name, callback, tabName);
	}else{
		printUnInitializedWarning();
	}
};


/**
 * First call will initialize/display a text label with provided text.
 * (label:text).  Subsequent calls change the text.
 *
 * @param {string} name - name of label, will show up in the display
 * @param {string} text - text to show
 * @param {string | string[]} [tabName] - the tab name (or path) to display the ui in.  put in "default" tab if omitted
 */
Bakery.showText = function(name, text, tabName){
	const useBaker = getBaker(tabName);
	if(useBaker!==null){
		useBaker.showText(name, text, tabName);
	}else{
		printUnInitializedWarning();
	}
};


/**
 * Get the currently-installed Bakery implementation (may be null).
 *
 * @param {string | string[]} [tabName] - the tab name (or path) of the desired Baker
 * @returns {?} The currently-installed Bakery implementation.
 */
Bakery.getBaker = function(tabName){
	return getBaker(tabName);
};

export default Bakery;
