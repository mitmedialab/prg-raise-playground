import * as Spline from "cubic-spline";
import * as Bezier from "bezier-js";
import { rebalanceCurve, rotateCurve } from "curve-matcher";
import { procrustes, applyTranslation, cutOffLineAtOverlap } from "./Procrustes";

// CONSTANTS
const bezierSamples = 3;
const controlLength = .02;
const lookahead = 0.06;

const imageDimensions = [640,480];
const horizontalFOV = 53.4;
const verticalFOV = 41.41;
const cameraHeight = 0.098;  
const tiltAngle = 41.5;

type Command = { radius: number, angle: number };
type Point = number[];
type RobotPosition = { x: number, y: number, angle: number };
type ProcrustesResult = { rotation: number, translation: number[] };


function distanceBetweenPoints(x1: number, y1: number, x2: number, y2: number) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}
  
function findPointAtDistanceWithIncrements(spline: Spline, increment: number, desiredDistance: number): number {
  let totalDistance = 0;
  const xValues = spline.xs;

  // Iterate through each pair of xValues in the array
  for (let i = 0; i < xValues.length - 1; i++) {
    let currentX = xValues[i];
    const nextX = xValues[i + 1];

    // Step through each segment in increments, adjusting for direction
    while (currentX < nextX) {
      const nextXIncrement = currentX + increment;  // Increment or decrement by step size
      const currentY = spline.at(currentX);
      const nextY = spline.at(nextXIncrement);

      // Calculate distance between current and next increment
      if (!isNaN(nextY)) {
          const distance = distanceBetweenPoints(currentX, currentY, nextXIncrement, nextY);

          totalDistance += distance;
          if (totalDistance >= desiredDistance) {
              return nextXIncrement;
          }
          currentX = nextXIncrement;

          // Stop if we overshoot the next point
          if (currentX > nextX) {
              currentX = nextX;
          }
      } else {
          break;
      }
      
    }
  }

  // If the desired distance is beyond all xValues, return the last point
  return xValues[xValues.length - 1];
}
  

function medianPoint(points: number[][]): number[] {
    if (points.length === 0) return [0, 0];

    // Sort points by x-coordinate
    const sortedPoints = points.sort((a, b) => a[0] - b[0]);

    // Return the median point (middle point in sorted array)
    const middle = Math.floor(sortedPoints.length / 2);
    return sortedPoints[middle];
}
  

function groupByYInterval(points: Point[], intervalSize: number): Point[] {
    const groupedPoints: Map<number, Point[]> = new Map();

    for (const point of points) {
        const [x, y] = point;

        // Find the interval the current y-value falls into
        const interval = Math.floor(y / intervalSize) * intervalSize;

        // Add the point to the appropriate group
        if (!groupedPoints.has(interval)) {
            groupedPoints.set(interval, []);
        }
        groupedPoints.get(interval)?.push(point);
    }

    // For each interval, take the median point based on the x-coordinate
    const medianPoints: number[][] = [];
    groupedPoints.forEach((group) => {
        const median = medianPoint(group);
        medianPoints.push(median);
    });

    // Sort by y-value (ascending)
    return medianPoints.sort((a, b) => a[1] - b[1]);
}
  

  function rdpSimplify(points: Point[], epsilon: number): Point[] {
      if (points.length < 3) {
          return points; 
      }
  
      let maxDistance = 0;
      let index = 0;
  
      // Find the point with the maximum distance from the line formed by the first and last points.
      for (let i = 1; i < points.length - 1; i++) {
          const distance = perpendicularDistance(points[i], points[0], points[points.length - 1]);
          if (distance > maxDistance) {
              maxDistance = distance;
              index = i;
          }
      }
  
      // If the maximum distance is greater than epsilon, recursively simplify.
      if (maxDistance > epsilon) {
          const leftSegment = rdpSimplify(points.slice(0, index + 1), epsilon);
          const rightSegment = rdpSimplify(points.slice(index), epsilon);
  
          // Combine the results, excluding the duplicate point at the intersection.
          return [...leftSegment.slice(0, -1), ...rightSegment];
      } else {
          // If no point is far enough, return the endpoints.
          return [points[0], points[points.length - 1]];
      }
  }
  

  export function simplifyLine(points: Point[], epsilon: number, intervalSize: number): number[][] {
      // Group points by y-interval and pick the median x-coordinate in each group
      const medianPoints = groupByYInterval(points, intervalSize);
  
      // Simplify the remaining points using Ramer-Douglas-Peucker
      return rdpSimplify(medianPoints, epsilon);
  }
  

  function perpendicularDistance(point: number[], lineStart: number[], lineEnd: number[]): number {
      const [x, y] = point;
      const [x1, y1] = lineStart;
      const [x2, y2] = lineEnd;
  
      const num = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1);
      const den = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
  
      return den === 0 ? 0 : num / den;
  }
  

function rotateAndTranslateLine(line: Point[], angle: number, translation: number[]) {
    const angleRadians = angle; // Convert angle to radians

    return line.map(([x, y]) => {
        const rotatedX = x * Math.cos(angleRadians) - y * Math.sin(angleRadians);
        const rotatedY = x * Math.sin(angleRadians) + y * Math.cos(angleRadians);

        // Step 3: Translate the point back from the origin and apply final translation
        const finalX = rotatedX + translation[0];
        const finalY = rotatedY + translation[1];

        return [finalX, finalY];
    });
}

function getRobotPositionAfterArc(command: Command, initialPosition: RobotPosition) {
    // Extract radius and angle from command
    let { radius, angle: angleDegrees } = command;
    const { x: initialX, y: initialY, angle: initialAngle } = initialPosition;

    // Determine the direction
    const direction = angleDegrees < 0 ? "left" : "right";
    const angleRadians = Math.abs(angleDegrees * (Math.PI / 180)); // Target angle in radians

    // Scale radius if needed
    radius = radius * 0.0254;

    // Calculate the center of the circular path
    const centerX = direction === "left" 
        ? initialX + radius * Math.cos(initialAngle)
        : initialX - radius * Math.cos(initialAngle);
    const centerY = direction === "left" 
        ? initialY + radius * Math.sin(initialAngle)
        : initialY - radius * Math.sin(initialAngle);

    // Calculate the new angle traveled
    const finalAngleTraveled = initialAngle + angleRadians * (direction === "left" ? -1 : 1);

    // Calculate the new position along the arc
    const newX = direction === "left" 
        ? centerX - radius * Math.cos(finalAngleTraveled)
        : centerX + radius * Math.cos(finalAngleTraveled);
    const newY = direction === "left" 
        ? centerY - radius * Math.sin(finalAngleTraveled)
        : centerY + radius * Math.sin(finalAngleTraveled);

    // Return the updated position and angle
    return {
        x: newX,
        y: newY,
        angle: finalAngleTraveled
    };
}

function showLineAboveY(line: Point[], yLimit: number) {
    const newLine: Point[] = [];

    for (let i = 0; i < line.length; i++) {
        const [x, y] = line[i];
        if (y > yLimit) {
            newLine.push([x, y]);
        }
    }

    return newLine;
}



function showLineBelowY(line: Point[], yLimit: number) {
    const newLine: Point[] = [];

    for (let i = 0; i < line.length; i++) {
        const [x, y] = line[i];
        if (y < yLimit) {
            newLine.push([x, y]);
        }
    }

    return newLine;
}


function smoothLine(line: Point[], windowSize = 3) {
    const smoothedLine: Point[] = [];
    for (let i = 0; i < line.length; i++) {
        let start = Math.max(0, i - Math.floor(windowSize / 2));
        let end = Math.min(line.length, i + Math.floor(windowSize / 2) + 1);
        let sumX = 0;
        let sumY = 0;

        for (let j = start; j < end; j++) {
            sumX += line[j][0];
            sumY += line[j][1];
        }

        let count = end - start;
        smoothedLine.push([sumX / count, sumY / count]);
    }

    return smoothedLine;
}



function blendLines(entireLine: Point[], worldPoints: Point[], transitionLength: number = 3) {

    const blendedLine = [...cutOffLineAtOverlap(entireLine, worldPoints).line];

    if (entireLine.length < transitionLength || worldPoints.length < transitionLength) {
        return [...entireLine, ...worldPoints];
    }

    for (let i = 0; i < transitionLength; i++) {
        const t = i / (transitionLength - 1); // Transition factor (0 to 1)
        const [x1, y1] = entireLine[entireLine.length - transitionLength + i];
        const [x2, y2] = worldPoints[i];

        const blendedX = (1 - t) * x1 + t * x2;
        const blendedY = (1 - t) * y1 + t * y2;

        blendedLine.push([blendedX, blendedY]);
    }

    blendedLine.push(...worldPoints.slice(transitionLength));

    return blendedLine;
}



export function followLine(previousPoints: Point[], worldPoints: Point[], delay: number, previousSpeed: number, previousCommands: {radius: number, angle: number}[]) {
    let robotPosition = {x:0, y:0, angle:0};
    for (const command of previousCommands) {
        robotPosition = getRobotPositionAfterArc(command, robotPosition);
    }

   let wholeLine = rotateAndTranslateLine(previousPoints, -1*robotPosition.angle, [-1*robotPosition.x, -1*robotPosition.y]);

   // Cutting off segments to the overlap portion
   let segment1 = showLineAboveY(wholeLine, Math.max(worldPoints[0][1], wholeLine[0][1]));
   let segment2 = showLineBelowY(worldPoints, Math.min(wholeLine[wholeLine.length - 1][1], worldPoints[worldPoints.length - 1][1]))

    let worldDistance = 0;
    for (let i = 0; i < worldPoints.length - 1; i++) {
      worldDistance += distanceBetweenPoints(worldPoints[i][0], worldPoints[i][1], worldPoints[i + 1][0], worldPoints[i + 1][1]);
    }

    let procrustesResult: ProcrustesResult;
    if (previousCommands.length == 0) {
        procrustesResult = procrustes(segment1, segment2);
    } else if (worldDistance > 0.05) {
        // TODO: check if line2 is much smaller than line 1, then use segment1 and segment2. Otherwise, use all the lines
        procrustesResult = procrustes(wholeLine, worldPoints, 0.5);
    } else {
        procrustesResult = { translation: [0, 0], rotation: 0 };
    }

    wholeLine = rotateCurve(wholeLine.map((point: Point) => ({x: point[0], y: point[1]})), procrustesResult.rotation).map((point: number) => [point.x, point.y]);
    wholeLine = applyTranslation(wholeLine, procrustesResult.translation);    
    wholeLine = showLineAboveY(wholeLine, 0);
    
    if (worldDistance > 0.05) {
        let trimmedLine = cutOffLineAtOverlap(wholeLine, worldPoints);
        wholeLine = trimmedLine.overlap ? trimmedLine.line : blendLines(trimmedLine.line, worldPoints);
    } 

    wholeLine = smoothLine(wholeLine);
    wholeLine = rebalanceCurve(wholeLine.map((point: Point) => ({x: point[0], y: point[1]})), {}).map(point => [point.x, point.y]);

    const seenY = new Set();
    wholeLine = wholeLine.filter((point: Point) => {
        const y = point[1];
        if (seenY.has(y)) {
            return false; 
        }
        seenY.add(y);
        return true; 
    });
    const xs = wholeLine.map((point: Point) => point[0]);
    const ys = wholeLine.map((point: Point) => point[1]);
    
    const spline = new Spline.default(ys, xs); // Opposite so we get the x values

    const distance = previousSpeed*delay + lookahead;

    const x1 = findPointAtDistanceWithIncrements(spline, 0.001, distance - .01);
    const x2 = findPointAtDistanceWithIncrements(spline, 0.001, distance);

    const point1 = {x: spline.at(x1), y: x1}
    const point2 = {x: spline.at(x2), y: x2}

    // Calculate the direction vector from point2 to point1
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;

    // Normalize the direction vector
    const length = Math.sqrt(dx * dx + dy * dy);
    const unitDx = dx / length;
    const unitDy = dy / length;

    // Extend point1 in the direction of the unit vector
    const extendedPoint1 = {
        x: point1.x + unitDx * controlLength,
        y: point1.y + unitDy * controlLength
    };

    const x3 = spline.xs[0];
    const point3 = {x: spline.at(x3), y: x3}
    const reference1 = [spline.at(x3), 0]
    const reference2 = [0, 0]

    let xOffset = reference1[0] - reference2[0];

    const bezier = new Bezier.Bezier(
        { x: point3.x - xOffset, y: point3.y },
        { x: point3.x - xOffset, y: point3.y },
        extendedPoint1,
        point2
    );

    const motorCommands: { radius: number, angle: number}[] = [];

    const bezierPoints = bezierCurvePoints(bezier, bezierSamples);
    for (let i = 0; i < bezierPoints.length - 1; i++) {
        const command = calculateCurveBetweenPoints(bezierPoints[i], bezierPoints[i+1]);
        motorCommands.push(command);
    }
    return {motorCommands, bezierPoints, line: [...wholeLine]};

}


export function pixelToGroundCoordinates(pixelCoords: Point): { x: number, y: number } {
    // Based on Franklin's algorithm
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
        let orientation: number;
        if (i == 0) {
            orientation = Math.PI/2;
        }  else {
            const position2 = bezier.get((i-1)/n);
            orientation = Math.atan2(position.y - position2.y, position.x - position2.x)
        }

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
  

function calculateCurveBetweenPoints(pointA: RobotPosition, pointB: RobotPosition) {
    const { x: x1, y: y1, angle: theta1Rad } = pointA;
    const { x: x2, y: y2, angle: theta2Rad } = pointB;

    // Calculate midpoint between points A and B
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    // Distance between points A and B
    const distanceAB = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    // Calculate the bisector of A and B in terms of orientation (90 degrees)
    const angleBisector = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;

    // Determine the radius by projecting from the midpoint to a perpendicular circle center
    const tanAngle = Math.tan((theta2Rad - theta1Rad) / 2);

    if (Math.abs(tanAngle) < 1e-6) {
        return { radius: Infinity, angle: 0 }; // Straight line, infinite radius
    }

    // Calculate the radius of the arc
    const radius = distanceAB / (2 * tanAngle);

    // Calculate the center of the circle based on direction (left or right of the line A-B)
    const centerX = midX + radius * Math.cos(angleBisector);
    const centerY = midY + radius * Math.sin(angleBisector);

    // Calculate the angle to travel on the circumference in radians
    const angleRad = 2 * Math.atan2(distanceAB, 2 * radius);

    // Convert radius back to inches (assuming pixels to inches ratio, like 30 pixels per inch)
    const radiusInches = Math.abs(radius * 39.37);
    let angleDegrees = angleRad * (180 / Math.PI);
    if (angleDegrees > 180) {
        angleDegrees = angleDegrees - 360;
    }

    return { radius: radiusInches, angle: angleDegrees };
}
