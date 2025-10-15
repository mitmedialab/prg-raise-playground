import Time from "./Time.js";

/**
 * A high-precision clock.  Uses the Performance API if available.
 *
 * @class Clock
 * @memberof jibo.animate
 */
const Clock = {};

/**
 * Gets the current time.
 *
 * Internally, time is calculated as time since epoch and is
 * represented as two integers— seconds and fractions of a second in microseconds.
 * @method jibo.animate.Clock#currentTime
 * @returns {jibo.animate.Time}
 */
Clock.currentTime = function(){
	let sinceNavStart;
	let navStartMS;
	if(typeof(window) !== "undefined" && typeof(window.performance) !== "undefined"){
		sinceNavStart = window.performance.now();
		navStartMS = window.performance.timing.navigationStart;
	}else{
		sinceNavStart = 0;
		navStartMS = Date.now();
	}

	const sinceStartMSComponent = Math.floor(sinceNavStart);
	const sinceStartFractionalMSComponent = sinceNavStart - sinceStartMSComponent;
	//break off sub-ms part for later addition (don't want to lose precision)

	//our stamp is startTimeMS + elapsedMS
	let timeStampMSComponent = sinceStartMSComponent + navStartMS;

	//break off and remove whole seconds
	let timeStampSComponent = Math.floor(timeStampMSComponent / 1000);
	timeStampMSComponent -= timeStampSComponent * 1000;

	//add back in the sub-ms elapsed component
	let timeStampFractionalComponent = timeStampMSComponent + sinceStartFractionalMSComponent;

	//convert to us
	timeStampFractionalComponent = Math.round(timeStampFractionalComponent * 1000);

	//us rounded up and need to carry into s
	if(timeStampFractionalComponent === 1000000){
		timeStampFractionalComponent = 0;
		timeStampSComponent = timeStampSComponent + 1;
	}

	return new Time(timeStampSComponent, timeStampFractionalComponent);
};


export default Clock;
