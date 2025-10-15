import Timeline from "./timeline/Timeline.js";

/**
 * @description
 * Jibo Expression API
 * @namespace jibo.express
 * @private
 */
const express = {

    /**
     * @param {Clock} clock
     *
     * @return {Timeline}
     */
    createTimeline: function(clock) {
        return new Timeline(clock);
    }
};

export default express;
