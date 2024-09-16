import * as Spline from "cubic-spline";
import * as Bezier from "bezier-js";
import Doodlebot from "./Doodlebot";

// CONSTANTS
const cameraMatrix = [
    [1000, 0, 320],  // fx, 0, cx
    [0, 1000, 240],  // 0, fy, cy
    [0, 0, 1]        // 0, 0, 1
];
const imageDimensions = [400,600];
const cameraHeight = 2;  
const tiltAngle = Math.PI / 6; 
const wheelBase = 40;
const bezierSamples = 100;
const bezierIncrement = 1;
const linearSpeed = 20;


export function followLine(linePixels: number[][], delay: number, previousSpeed: number) {
    const xs = linePixels.map((point) => point[0]);
    const ys = linePixels.map((point) => point[1]);
    const spline = new Spline.default(ys, xs); // Opposite so we get the x values
    const y = findPointOnCurve(spline, 0, previousSpeed, delay);

    const bezier = new Bezier.Bezier(
        { x: 0, y: 0 },
        { x: 0, y: 20 },
        { x: spline.at(y), y: y },
        { x: spline.at(y+bezierIncrement), y: y+bezierIncrement },
    );

    const motorCommands = [];
    // TODO: Improve this function
    const bezierPoints = bezierCurvePoints(bezier, bezierSamples);
    console.log(bezierPoints);
    for (let i = 0; i < bezierPoints.length - 1; i++) {
        const command = purePursuit(bezierPoints[i], bezierPoints[i+1]);
        motorCommands.push(command);
    }
    return motorCommands;

}


function calculateDistanceOnCurve(curve: Spline, t0: number, t1: number) {
    const numSteps = 100;
    let distance = 0;
    let prevPoint = pixelToGroundCoordinates([curve.at(t0), t0]);
    for (let i = 1; i <= numSteps; i++) {
        const t = t0 + (t1 - t0) * i / numSteps;
        const currentPoint = pixelToGroundCoordinates([curve.at(t), t]);
        distance += Math.sqrt(
            Math.pow(currentPoint.x - prevPoint.x, 2) +
            Math.pow(currentPoint.y - prevPoint.y, 2)
        );
        prevPoint = currentPoint;
    }
    return distance;
}

function findPointOnCurve(curve: Spline, t0: number, speed: number, deltaTime: number) {
    const desiredDistance = speed * deltaTime;
    let low = t0;
    let high = imageDimensions[1];  // Assuming y ranges from 0 to image height
    let mid: number; // y value 

    while (high - low > 0.0001) {
        mid = (low + high) / 2;
        const distance = calculateDistanceOnCurve(curve, t0, mid);

        if (distance < desiredDistance) {
            low = mid;  // Increase y
        } else {
            high = mid; // Decrease y
        }
    }

    return mid;
}

function pixelToGroundCoordinates(
    pixelCoords: [number, number],
): { x: number, y: number, distance: number } {
    // Convert angle from degrees to radians
    const angleRad = tiltAngle * (Math.PI / 180);
    
    // Extract intrinsic matrix parameters
    const fx = cameraMatrix[0][0];  // Focal length in x
    const fy = cameraMatrix[1][1];  // Focal length in y
    const cx = cameraMatrix[0][2];  // Principal point x
    const cy = cameraMatrix[1][2];  // Principal point y
    
    // Pixel coordinates
    const [px, py] = pixelCoords;
    
    // Compute the depth of the pixel point in camera coordinates
    const z = cameraHeight / Math.sin(angleRad);
    
    // Compute the normalized image coordinates
    const xNormalized = (px - cx) / fx;
    const yNormalized = (py - cy) / fy;
    
    // Compute the ground coordinates relative to the camera
    const xGround = xNormalized * z;
    const yGround = yNormalized * z;

    const perspectiveCorrection = Math.cos(angleRad); // The correction factor
    
    // Compute the distances in x and y directions on the ground
    // The component here is used to adjust the distances based on the height and angle
    const xDistance = Math.sqrt(xGround/perspectiveCorrection ** 2 + (cameraHeight ** 2) / (Math.sin(angleRad) ** 2));
    const yDistance = Math.sqrt(yGround/perspectiveCorrection ** 2 + (cameraHeight ** 2) / (Math.sin(angleRad) ** 2));
    
    // Compute the total distance to the ground point from the point directly below the camera
    const totalDistance = Math.sqrt(xDistance ** 2 + yDistance ** 2);
    
    return {
        x: xDistance,
        y: yDistance,
        distance: totalDistance
    };
}

function bezierCurvePoints(bezier: Bezier, n: number) {
    const points = [];
    for (let i = 0; i <= n; i++) {
        const t = i / n;
        const position = bezier.get(t);
        const derivative = bezier.derivative(t);
        const orientation = Math.atan2(derivative.y, derivative.x);
        points.push({ x: position.x, y: position.y, theta: orientation });
    }
    
    return points;
}

function metersToSteps(meters: number) {
    // TODO: implement this
    return meters;
}

function purePursuit(currentPoint, lookaheadPoint) {

    if (!lookaheadPoint) {
        return { leftWheelSpeed: 0, rightWheelSpeed: 0 }; // No valid lookahead point found
    }

    const dx = lookaheadPoint.x - currentPoint.x;
    const dy = lookaheadPoint.y - currentPoint.y;
    
    const lookaheadAngle = lookaheadPoint.theta;
    const robotHeading = currentPoint.theta; // Robot's orientation (angle)
    
    const angleToLookahead = lookaheadAngle - robotHeading;
    const lookaheadDistanceToPoint = Math.sqrt(dx * dx + dy * dy);
    
    const curvature = (2 * Math.sin(angleToLookahead)) / lookaheadDistanceToPoint;
    const angularVelocity = linearSpeed * curvature;

    const leftWheelDistance = metersToSteps(lookaheadDistanceToPoint * (1 - (wheelBase * curvature) / 2));
    const rightWheelDistance = metersToSteps(lookaheadDistanceToPoint * (1 + (wheelBase * curvature) / 2));
        
    // Compute wheel speeds
    const leftWheelSpeed = metersToSteps(linearSpeed - (wheelBase / 2) * angularVelocity);
    const rightWheelSpeed = metersToSteps(linearSpeed + (wheelBase / 2) * angularVelocity);
    
    return {
        leftWheelSpeed,
        rightWheelSpeed,
        leftWheelDistance,
        rightWheelDistance
    };
}
