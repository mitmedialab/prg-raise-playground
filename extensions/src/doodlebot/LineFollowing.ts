import * as Spline from "cubic-spline";
import * as Bezier from "bezier-js";
import Doodlebot from "./Doodlebot";

// CONSTANTS
const cameraMatrix = [
  [1000, 0, 320],  // fx, 0, cx
  [0, 1000, 240],  // 0, fy, cy
  [0, 0, 1]        // 0, 0, 1
];

const wheelBase = 0.0716;
const bezierSamples = 3;
const bezierIncrement = .01;
const linearSpeed = .1;

const delay = 0.5;
const previousSpeed = 0.1;


export function followLine(linePixels: number[][], delay1: number, previousSpeed1: number) {

  let increasing = true;
  // const filteredLinePixels = linePixels.filter((pixel, index, array) => {
  //     // Skip the first element, as there's no previous element to compare with
  //     if (index === 0) return true;
    
  //     const prevY = array[index - 1][1];
  //     const currentY = pixel[1];
  //     if (currentY < prevY) {
  //         increasing = false;
  //     }
  //     // Keep the pixel if the y-value is increasing
  //     return increasing;
  //   });
  const xs = linePixels.map((point) => point[0]);
  const ys = linePixels.map((point) => point[1]);
  const spline = new Spline.default(ys, xs); // Opposite so we get the x values
  const x1 = findPointAtDistanceWithIncrements(spline, 0.01, (previousSpeed * delay * 2)*0.75);
    const x2 = findPointAtDistanceWithIncrements(spline, 0.01, (previousSpeed * delay * 2));

    const x3 = findPointAtDistanceWithIncrements(spline, 0.01, (previousSpeed * delay));



    console.log("X");
    console.log(x1);
    console.log(x2);
    console.log((previousSpeed * delay)*0.5);
    // console.log(spline);
    // const groundCoordinate1 = pixelToGroundCoordinates([spline.at(x1), x1]);
    // const groundCoordinate2 = pixelToGroundCoordinates([spline.at(x2), x2]);
    // const baseCoordinate = pixelToGroundCoordinates([spline.at(x3), x3])
    const groundCoordinate1 = pixelToGroundCoordinates([spline.at(spline.xs[2]*0.75), spline.xs[2]*0.75]);
    const groundCoordinate2 = pixelToGroundCoordinates([spline.at(spline.xs[2]), spline.xs[2]]);
    const baseCoordinate = pixelToGroundCoordinates([spline.at(spline.xs[0]), spline.xs[0]])

  console.log("ground coordinates");
  console.log(groundCoordinate1.x*100, groundCoordinate1.y*100);
  console.log(groundCoordinate2.x*100, groundCoordinate2.y*100);
  console.log(baseCoordinate);

  const bezier = new Bezier.Bezier(
      { x: baseCoordinate.x, y: baseCoordinate.y },
      { x: baseCoordinate.x, y: baseCoordinate.y + bezierIncrement },
      groundCoordinate1,
      groundCoordinate2
  );
  console.log("bezier")
  console.log(bezier);

  const motorCommands = [];
  // TODO: Improve this function
  const bezierPoints = bezierCurvePoints(bezier, bezierSamples);
  //console.log(bezierPoints);
  for (let i = 0; i < bezierPoints.length - 1; i++) {
      //console.log(bezierPoints[i], bezierPoints[i+1]);
      const command = purePursuit(bezierPoints[i], bezierPoints[i+1]);
      motorCommands.push(command);
  }
  return motorCommands;

}



// Function to calculate the Euclidean distance between two points
function distanceBetweenPoints(x1, y1, x2, y2) {
  //console.log(x1, x2, y1, y2);
  const ground1 = pixelToGroundCoordinates([x1, y1]);
  const ground2 = pixelToGroundCoordinates([x2, y2]);
  // console.log("calulcating");
  // console.log(ground1);
  // console.log(ground2);
  const dx = ground2.x - ground1.x;
  const dy = ground2.y - ground2.y;
  if (isNaN(ground1.x) || isNaN(ground2.x) || isNaN(ground1.y) || isNaN(ground2.y)) {
      console.log(ground1);
  console.log(ground2);
  console.log(x2, y2);
      console.log("hmmm");

  }
  return Math.sqrt(dx * dx + dy * dy);
}

function findPointAtDistanceWithIncrements(spline: Spline, increment: number, desiredDistance: number): number {
  let totalDistance = 0;
  const xValues = spline.xs;
  console.log(xValues);

  // Iterate through each pair of xValues in the array
  for (let i = 0; i < xValues.length - 1; i++) {
    let currentX = xValues[i];
    const nextX = xValues[i + 1];

    // Check the direction between currentX and nextX (allow for backtracking)
    let direction = nextX > currentX ? 1 : -1;

    console.log(direction);
    // Step through each segment in increments, adjusting for direction
    while ((direction === 1 && currentX < nextX) || (direction === -1 && currentX > nextX)) {
      
      const nextXIncrement = currentX + direction * increment;  // Increment or decrement by step size

      const currentY = spline.at(currentX);
      const nextY = spline.at(nextXIncrement);
      // console.log(spline);
      // console.log(currentX, currentY);

      // Calculate distance between current and next increment
      if (isNaN(nextY)) {
          console.log(
              "MMM"
          );
          console.log(totalDistance);
          console.log(nextXIncrement);
      }
      const distance = distanceBetweenPoints(currentX, currentY, nextXIncrement, nextY);

      totalDistance += distance;

      // Check if the accumulated distance is equal to or exceeds the desired distance
      
      if (totalDistance >= desiredDistance) {
          console.log("TOTAL DISTANCE");
      console.log(totalDistance);
        return nextXIncrement;
      }

      // Move to the next increment
      currentX = nextXIncrement;

      // Stop if we overshoot the next point
      if ((direction === 1 && currentX > nextX) || (direction === -1 && currentX < nextX)) {
        currentX = nextX;
      }
    }
  }

  // If the desired distance is beyond all xValues, return the last point
  console.log("TOTAL DISTANCE");
      console.log(totalDistance);
  return xValues[xValues.length - 1];
}





const imageDimensions = [640,480];
const horizontalFOV = 53.5;
const verticalFOV = 41.41;
// const horizontalFOV = 50;
// const verticalFOV = 50;
const cameraHeight = 0.1;  
//const tiltAngle = 52.85331330197821;
//const tiltAngle = 32.85331330197821;
const tiltAngle = 30;

export function pixelToGroundCoordinates(
    pixelCoords: [number, number],
): { x: number, y: number } {
    const verticalPixels = imageDimensions[1]/verticalFOV;
    const angleP = pixelCoords[1]/verticalPixels;
    const angleC = (180 - (tiltAngle + 90));
    const angleY = 180 - angleC;
    const sideB = solveForSide(90, angleC, cameraHeight);
    const angleZ = 180 - angleP - angleY;
    const sideA = solveForSide(tiltAngle, 90, sideB);
    const distanceP = solveForSide(angleP, angleZ, sideB);
    const verticalOffset = sideA + distanceP;


    const horizontalPixels = imageDimensions[0]/horizontalFOV;
    const diversion = Math.abs(pixelCoords[0] - imageDimensions[0]/2);
    const angleA = diversion/horizontalPixels;
    const sideK = Math.sqrt(verticalOffset * verticalOffset + cameraHeight * cameraHeight);
    const angleB = 90 - angleA;
    const horizontalOffset = pixelCoords[0] < imageDimensions[0]/2 ? solveForSide(angleA, angleB, sideK)*-1 : solveForSide(angleA, angleB, sideK);

    return { x: horizontalOffset, y: verticalOffset};

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

function solveForSide(angleA: number, angleB: number, sideB: number) {
  // Convert angles from degrees to radians
  const angleARad = angleA * (Math.PI / 180);
  const angleBRad = angleB * (Math.PI / 180);

  // Calculate the side opposite angleA using the Law of Sines
  const sideA = (sideB * Math.sin(angleARad)) / Math.sin(angleBRad);
  
  return sideA;
}



function metersToSteps(distanceMeters: number) {
  const diameterInches = 3.25;
  const stepsPerRevolution = 3200;
  // Convert diameter from inches to meters
  const diameterMeters = diameterInches * 0.0254;

  // Calculate circumference in meters
  const circumference = Math.PI * diameterMeters;

  // Calculate steps per meter
  const stepsPerMeter = stepsPerRevolution / circumference;

  // Convert distance in meters to steps
  const steps = distanceMeters * stepsPerMeter;

  return steps;
}

function purePursuit(currentPoint: {x: number, y: number, theta: number}, lookaheadPoint: {x: number, y: number, theta: number}) {

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
  const leftWheelSpeed = Math.abs(metersToSteps(linearSpeed - (wheelBase / 2) * angularVelocity));
  const rightWheelSpeed = Math.abs(metersToSteps(linearSpeed + (wheelBase / 2) * angularVelocity));
  
  return {
      leftWheelSpeed,
      rightWheelSpeed,
      leftWheelDistance,
      rightWheelDistance
  };
}
