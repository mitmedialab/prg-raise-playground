import BodyOutput from "./BodyOutput.js";

const BodyPositionOutput = function (clock, robotInfo, bodyServiceURL, startEnabled, updateIntervalMillis, sessionToken) {
    BodyOutput.call(this, clock, robotInfo, bodyServiceURL, startEnabled, updateIntervalMillis, sessionToken);
};

BodyPositionOutput.prototype = Object.create(BodyOutput.prototype);
BodyPositionOutput.prototype.constructor = BodyOutput;

BodyPositionOutput.prototype.update = function () {
    const currentTime = this.clock.currentTime();
    const targets = this.computeTargetsForTime(currentTime.add(this.reactionTime));
    if (targets !== null && this.motionInterface.isConnected() && !this.isPaused()) {
        for (let i = 0; i < this.dofNames.length; i++) {
            const position = targets[i].position;
            this.motionInterface.setCommand(this.dofNames[i], 0, position, null, null, null);
        }
        this.motionInterface.sendCommand();
    }
};

export default BodyPositionOutput;
