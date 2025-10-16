"use strict";

import slog from "../../ifr-core/SLog.js";

const eventQueue = [];

const TimelineEventDispatcher = {

	queueEvent : function(theFunction, theArgs){
		if(theFunction == null){ //null or undefined
			slog.error("Error, null/undefined function queued!\n"+new Error().stack);
		}
		eventQueue.push({f:theFunction, a:theArgs});
	},

	dispatchQueuedEvents : function(){
		for(let i = 0; i < eventQueue.length; i++){
			const e = eventQueue[i];
			e.f.apply(null, e.a);
		}
		eventQueue.length = 0;
	}
};

export default TimelineEventDispatcher;
