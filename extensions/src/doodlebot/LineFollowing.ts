import * as Spline from "cubic-spline";
import * as Bezier from "bezier-js";
import { rebalanceCurve, rotateCurve } from "curve-matcher";
import { procrustes } from "./Procrustes";
import { type Point, type ProcrustesResult, type RobotPosition, type Command, applyTranslation, cutOffLineAtOverlap, distanceBetweenPoints } from './LineHelper';

// CONSTANTS
const maxDistance = 100;
const epsilon = 0.3;
const bezierSamples = 2;
const controlLength = .02;
const lookahead = 0.06;

const imageDimensions = [640, 480];
const horizontalFOV = 53.4;
const verticalFOV = 41.41;
const cameraHeight = 0.098;
const tiltAngle = 41.5;

function cutOffLineOnDistance(line: Point[], maxDistance: number) {
    let filteredLine = [line[0]]; // Start with the first point

    for (let i = 1; i < line.length; i++) {
        const point1 = line[i - 1];
        const point2 = line[i];
        const distance = distanceBetweenPoints(point1, point2);

        // If the distance exceeds the threshold, stop adding points
        if (distance > maxDistance) {
            break;
        }

        filteredLine.push(point2); // Add the current point if within distance
    }

    return filteredLine;
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
                const distance = distanceBetweenPoints([currentX, currentY], [nextXIncrement, nextY]);

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


function simplifyLine(points: Point[], epsilon: number, intervalSize: number): number[][] {
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

    // Only add point if y is above limit
    for (let i = 0; i < line.length; i++) {
        const [x, y] = line[i];
        if (y >= yLimit) {
            newLine.push([x, y]);
        }
    }

    return newLine;
}



function showLineBelowY(line: Point[], yLimit: number) {
    const newLine: Point[] = [];

    // Only add point is y is below limit
    for (let i = 0; i < line.length; i++) {
        const [x, y] = line[i];
        if (y <= yLimit) {
            newLine.push([x, y]);
        }
    }

    return newLine;
}


function smoothLine(line: Point[], windowSize = 3) {
    const smoothedLine: Point[] = [];

    for (let i = 0; i < line.length; i++) {
        // Define the range of indices for the smoothing window
        let start = Math.max(0, i - Math.floor(windowSize / 2));
        let end = Math.min(line.length, i + Math.floor(windowSize / 2) + 1);

        // Sum the x and y values within the window
        let sumX = 0;
        let sumY = 0;
        for (let j = start; j < end; j++) {
            sumX += line[j][0];
            sumY += line[j][1];
        }

        // Push the averaged point to the smoothed line
        let count = end - start;
        smoothedLine.push([sumX / count, sumY / count]);
    }

    return smoothedLine;
}


function blendLines(entireLine: Point[], worldPoints: Point[], transitionLength: number = 3) {
    // Start with the non-overlapping portion of entireLine
    const blendedLine = [...cutOffLineAtOverlap(entireLine, worldPoints).line];

    // If either line is too short for blending, return them joined directly
    if (entireLine.length < transitionLength || worldPoints.length < transitionLength) {
        return [...entireLine, ...worldPoints];
    }

    // Blend the transition region between entireLine and worldPoints
    for (let i = 0; i < transitionLength; i++) {
        const t = i / (transitionLength - 1); // Interpolation factor (0 to 1)
        const [x1, y1] = entireLine[entireLine.length - transitionLength + i];
        const [x2, y2] = worldPoints[i];

        // Linearly interpolate between corresponding points
        const blendedX = (1 - t) * x1 + t * x2;
        const blendedY = (1 - t) * y1 + t * y2;

        blendedLine.push([blendedX, blendedY]);
    }

    // Append remaining points from worldPoints after the transition region
    blendedLine.push(...worldPoints.slice(transitionLength));

    return blendedLine;
}

function prependUntilTarget(line) {
    const targetX = line[0][0];
    const targetY = line[0][1];
    const startX = line[0][0];
    const startY = 0; // Start slightly below targetY


    const incrementX = 0.01; // Small step for x
    let x = startX;
    let y = startY;

    const newSegment = [];
    while (y < targetY) {
        newSegment.push([x, y]);
        y += incrementX; // Increment y based on slope
    }

    // Prepend the new segment to the beginning of line
    line.unshift(...newSegment);
    return line;
}


export function followLine(previousLine: Point[], pixels: Point[], next: Point[], delay: number, previousSpeed: number, previousCommands: Command[], test: Boolean, first = false) {

    let nextPoints: Point[];
    if (test) {
        nextPoints = simplifyLine(next, epsilon, 0.1);
        nextPoints = cutOffLineOnDistance(nextPoints.filter((point: Point) => point[1] < 370), maxDistance);
        nextPoints = nextPoints.map(point => pixelToGroundCoordinates(point));
    }

    let worldPoints = simplifyLine(pixels, epsilon, 0.1);
    worldPoints = cutOffLineOnDistance(worldPoints.filter((point: Point) => point[1] < 370), maxDistance);
    worldPoints = worldPoints.map(point => pixelToGroundCoordinates(point));

    if (first) {
        previousLine = prependUntilTarget(worldPoints);
    }

    /* TESTING */
    let multiplier = 1;
    let distanceTest = 0.06 / multiplier;
    if (test) {
        try {
            if (nextPoints && nextPoints.length > 20 && worldPoints.length > 20) {
                let res = procrustes(worldPoints, nextPoints, 0.6);
                distanceTest = res.distance
            }

        } catch (e) { }
    }
    /* TESTING */

    let robotPosition = { x: 0, y: 0, angle: 0 };
    for (const command of previousCommands) {
        robotPosition = getRobotPositionAfterArc(command, robotPosition);
    }

    // Guess the location of the previous line
    let guessLine = rotateAndTranslateLine(previousLine, -1 * robotPosition.angle, [-1 * robotPosition.x, -1 * robotPosition.y]);

    // Cutting off segments to the overlap portion
    let segment1 = showLineAboveY(guessLine, Math.max(worldPoints[0][1], guessLine[0][1]));
    let segment2 = showLineBelowY(worldPoints, Math.min(guessLine[guessLine.length - 1][1], worldPoints[worldPoints.length - 1][1]))

    // Distance of the world line
    let worldDistance = 0;
    for (let i = 0; i < worldPoints.length - 1; i++) {
        worldDistance += distanceBetweenPoints(worldPoints[i], worldPoints[i + 1]);
    }

    // Collect the error between guess and world
    let procrustesResult: ProcrustesResult;
    if (previousCommands.length == 0) {
        procrustesResult = procrustes(segment1, segment2);
    } else if (worldDistance > 0.05) {
        // TODO: check if line 2 is much smaller than line 1, then use segment1 and segment2. Otherwise, use guessLine and worldPoints
        procrustesResult = procrustes(guessLine, worldPoints, 0.5);
    } else {
        // If the current frame doesn't contain that many points, just use previous guess
        procrustesResult = { translation: [0, 0], rotation: 0, distance: 0 };
    }

    // Correct the guess of the previous line
    let line = rotateCurve(guessLine.map((point: Point) => ({ x: point[0], y: point[1] })), procrustesResult.rotation).map((point: { x: number, y: number }) => [point.x, point.y]);
    line = applyTranslation(line, procrustesResult.translation);
    line = showLineAboveY(line, 0);


    if (worldDistance > 0.05) {
        // If we have enough points to append, add the new portion of the current camera frame
        let trimmedLine = cutOffLineAtOverlap(line, worldPoints);
        line = trimmedLine.overlap ? trimmedLine.line : blendLines(trimmedLine.line, worldPoints);
    }

    line = smoothLine(line);
    line = rebalanceCurve(line.map((point: Point) => ({ x: point[0], y: point[1] })), {}).map((point: { x: number, y: number }) => [point.x, point.y]);

    // Remove duplicate y values
    const seenY = new Set();
    line = line.filter((point: Point) => {
        const y = point[1];
        if (seenY.has(y)) {
            return false;
        }
        seenY.add(y);
        return true;
    });

    // Create the spline 
    const xs = line.map((point: Point) => point[0]);
    const ys = line.map((point: Point) => point[1]);
    const spline = new Spline.default(ys, xs); // Switch x and y so we no overlapping 'x' values

    // Find the end point for the Bezier curve
    let distance: number;
    if (test) {
        distance = distanceTest * 0.9;
    } else {
        distance = previousSpeed * delay + lookahead;
    }

    const x1 = findPointAtDistanceWithIncrements(spline, 0.001, distance - .01);
    const x2 = findPointAtDistanceWithIncrements(spline, 0.001, distance);
    const point1 = { x: spline.at(x1), y: x1 }
    const point2 = { x: spline.at(x2), y: x2 }

    // Extend point1 in the direction of the unit vector to make the Bezier control point
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const unitDx = dx / length;
    const unitDy = dy / length;

    const extendedPoint1 = {
        x: point1.x + unitDx * controlLength,
        y: point1.y + unitDy * controlLength
    };

    // Find the start point for the Bezier curve -- account for camera latency
    let x3: number;
    if (test) {
        x3 = spline.xs[0];
    } else {
        x3 = previousSpeed * delay;
    }
    const point3 = { x: spline.at(x3), y: x3 }

    // Find the x offset to correct
    const reference1 = [spline.at(spline.xs[0]), 0] // First point should be very close to 0
    const reference2 = [0, 0]

    let xOffset: number;
    if (test) {
        xOffset = 0;
    } else {
        xOffset = reference1[0] - reference2[0];
    }

    // We want to correct the offset and direct the robot to a future point on the curve
    // TODO: Add angle correction to the control points
    const bezier = new Bezier.Bezier(
        { x: point3.x - xOffset, y: point3.y },
        { x: point3.x - xOffset, y: point3.y + controlLength },
        extendedPoint1,
        point2
    );

    const motorCommands: Command[] = [];

    // Split the Bezier curve into a series of arcs
    const bezierPoints = bezierCurvePoints(bezier, bezierSamples);

    for (let i = 0; i < bezierPoints.length - 1; i++) {
        const command = calculateCurveBetweenPoints(bezierPoints[i], bezierPoints[i + 1]);
        motorCommands.push(command);
    }

    return { motorCommands, bezierPoints, line };

}


export function pixelToGroundCoordinates(pixelCoords: Point): Point {
    // Based on Franklin's algorithm
    const verticalPixels = imageDimensions[1] / verticalFOV;
    const angleP = pixelCoords[1] / verticalPixels;
    const angleC = (180 - (tiltAngle + 90));
    const angleY = 180 - angleC;
    const sideB = solveForSide(90, angleC, cameraHeight);
    const angleZ = 180 - angleP - angleY;
    const sideA = solveForSide(tiltAngle, 90, sideB);
    const distanceP = solveForSide(angleP, angleZ, sideB);
    const verticalOffset = sideA + distanceP;

    const horizontalPixels = imageDimensions[0] / horizontalFOV;
    const diversion = Math.abs(pixelCoords[0] - imageDimensions[0] / 2);
    const angleA = diversion / horizontalPixels;
    const sideK = Math.sqrt(verticalOffset * verticalOffset + cameraHeight * cameraHeight);
    const angleB = 90 - angleA;
    const horizontalOffset = pixelCoords[0] < imageDimensions[0] / 2 ? solveForSide(angleA, angleB, sideK) * -1 : solveForSide(angleA, angleB, sideK);

    return [horizontalOffset, verticalOffset];

}

function bezierCurvePoints(bezier: Bezier, n: number) {
    const points = [];

    for (let i = 0; i <= n; i++) {
        const t = i / n;
        const position = bezier.get(t);
        let orientation: number;
        if (i == 0) {
            orientation = Math.PI / 2;
        } else {
            const position2 = bezier.get((i - 1) / n);
            orientation = Math.atan2(position.y - position2.y, position.x - position2.x)
        }

        points.push({ x: position.x, y: position.y, angle: orientation });
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

    // Distance between points A and B
    const distanceAB = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    // Determine the radius by projecting from the midpoint to a perpendicular circle center
    const tanAngle = Math.tan((theta2Rad - theta1Rad) / 2);

    if (Math.abs(tanAngle) < 1e-6) {
        return { radius: Infinity, angle: 0 }; // Straight line, infinite radius
    }

    // Calculate the radius of the arc
    const radius = distanceAB / (2 * tanAngle);

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
