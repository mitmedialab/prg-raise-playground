let innerTravelSpeed = 0;
let adjustedT = 0;

function travelSteps(r: number, angle: number): number {
    const WHEEL_RADIUS = 2.93; // in inches
    const STEPLENGTH = 0.055 / 16.0;
    const radius = r + WHEEL_RADIUS;
    const outerDistance = (2.0 * Math.PI * radius * (angle / 360.0)) / STEPLENGTH;
    return outerDistance;
}

function travelTimeCalc(r: number, a: number): number {
    const WHEELBASERADIUS = 2.93;
    const STEPLENGTH = 0.055 / 16.0;
    const OUTERSPEED = 3200;

    a = Math.abs(a);
    const radius = r + WHEELBASERADIUS;

    const outerTravelDistance = (2 * Math.PI * radius * (a / 360)) / STEPLENGTH;
    const outerTravelTime = outerTravelDistance / OUTERSPEED;

    const innerRadius = radius - WHEELBASERADIUS;
    const innerTravelDistance = (2 * Math.PI * innerRadius * (a / 360)) / STEPLENGTH;
    innerTravelSpeed = Math.abs(innerTravelDistance / outerTravelTime);

    return outerTravelTime;
}

function adjustTime(outerTravelTime: number, currentTS: number, targetTS: number, rateOfAcceleration: number) {
    adjustedT = (targetTS - currentTS) / rateOfAcceleration / 4;
    return { adjustedT, aT: outerTravelTime + adjustedT };
}

export function calculateArcTime(radius1: number, angle1: number, radius2: number, angle2: number) {
    const cmd2p1 = radius2;
    const cmd2p2 = angle2;
    const cmd1p1 = radius1;
    const cmd1p2 = angle1;

    let targetSpeed: number;
    let travelT: number;
    let acceleration: number;
    targetSpeed = 3200; // Turn max speed
    travelT = travelTimeCalc(cmd2p1, Math.abs(cmd2p2));
    acceleration = 2500; // Usually 1000

    let priorTravelSpeed: number;
    travelTimeCalc(cmd1p1, cmd1p2);
    if ((cmd2p2 < 0 && cmd1p2 >= 0) || (cmd2p2 >= 0 && cmd1p2 < 0)) {
        priorTravelSpeed = innerTravelSpeed;
    } else {
        priorTravelSpeed = 3200;
    }

    // console.log('Outer travel time for target cmd in seconds: ', travelT);
    // console.log('Speed of current/previous cmd: ', priorTravelSpeed);
    // console.log('Target Speed: ', targetSpeed);
    // console.log('Rate of Acceleration: ', acceleration);

    const { adjustedT, aT } = adjustTime(travelT, priorTravelSpeed, targetSpeed, acceleration);
    // console.log('Adjustment: ', adjustedT);
    // console.log('Adjusted time: ', aT);
    return { travelT, priorTravelSpeed, targetSpeed, acceleration, adjustedT, aT }
}

