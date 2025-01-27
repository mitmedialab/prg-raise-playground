import * as Spline from "cubic-spline";
import * as Bezier from "bezier-js";
import { rebalanceCurve, rotateCurve } from "curve-matcher";
import { procrustes } from "./Procrustes";
import { type Point, type PointObject, type ProcrustesResult, type RobotPosition, type Command, calculateLineError, applyTranslation, cutOffLineAtOverlap, distanceBetweenPoints, approximateBezierWithArc } from './LineHelper';

// CONSTANTS
const maxDistance = 100;
const epsilon = 1;
const bezierSamples = 2;
const controlLength = .01;
let lookahead = .05;
let start = 0.005;
const spin = 10;

const imageDimensions = [640, 480];
const horizontalFOV = 53.4;
const verticalFOV = 41.41;
const cameraHeight = 0.098;
const tiltAngle = 25;
//const tiltAngle = 38;

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

function getRobotPositionAfterArc(
    command: Command,
    initialPosition: RobotPosition,
    percent: number
) {
    // Extract radius and angle from command
    let { radius, angle: angleDegrees } = command;
    const { x: initialX, y: initialY, angle: initialAngle } = initialPosition;

    // Clamp percent between 0 and 1 to avoid invalid inputs
    percent = Math.max(0, Math.min(1, percent));

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

    // Calculate the angle traveled based on the percentage of the arc
    const angleTraveled = angleRadians * percent;
    const finalAngleTraveled = initialAngle + angleTraveled * (direction === "left" ? -1 : 1);

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

function cleanLine(line, straightTolerance = 0.01, jaggedTolerance = 0.1) {
    if (line.length < 3) {
        // Not enough points to determine straightness or jaggedness
        return [];
    }

    // Helper function to calculate the angle between two points
    function calculateAngle(p1, p2) {
        return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
    }

    // Remove the first straight portion
    const initialAngle = calculateAngle(line[0], line[1]);
    let startIndex = 1;

    for (let i = 2; i < line.length; i++) {
        const currentAngle = calculateAngle(line[i - 1], line[i]);
        if (Math.abs(currentAngle - initialAngle) > straightTolerance) {
            startIndex = i - 1;
            break;
        }
    }

    let cleanedLine = line.slice(startIndex);

    // Remove jagged portions
    const smoothLine = [];
    for (let i = 1; i < cleanedLine.length - 1; i++) {
        const prevAngle = calculateAngle(cleanedLine[i - 1], cleanedLine[i]);
        const nextAngle = calculateAngle(cleanedLine[i], cleanedLine[i + 1]);
        const angleChange = Math.abs(nextAngle - prevAngle);

        if (angleChange <= jaggedTolerance) {
            smoothLine.push(cleanedLine[i]);
        }
    }

    // Ensure the first and last points are retained
    if (smoothLine.length > 0) {
        smoothLine.unshift(cleanedLine[0]);
        smoothLine.push(cleanedLine[cleanedLine.length - 1]);
    }

    return smoothLine;
}



function prependUntilTarget(line2) {
    let line = [...line2];
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


/**
 * Removes outliers from a 2D array of points using the IQR method.
 * @param points - Array of points ([x, y]) representing a line.
 * @param threshold - Multiplier for the IQR to define outliers (default is 1.5).
 * @returns A filtered array of points without outliers.
 */
function removeOutliers(points: Point[], threshold: number = 1.5): Point[] {
    if (points.length < 3) return points; // Not enough points to calculate outliers

    // Sort points by x-coordinate
    const sortedPoints = [...points].sort((a, b) => a[1] - b[1]);

    // Extract y-values
    const yValues = sortedPoints.map(point => point[0]);

    // Calculate Q1 (25th percentile) and Q3 (75th percentile)
    const q1 = percentile(yValues, 25);
    const q3 = percentile(yValues, 75);

    // Calculate IQR
    const iqr = q3 - q1;

    // Define lower and upper bounds for outliers
    const lowerBound = q1 - threshold * iqr;
    const upperBound = q3 + threshold * iqr;

    // Filter points within the bounds
    return sortedPoints.filter(([y, ]) => y >= lowerBound && y <= upperBound);
}

/**
 * Calculates the nth percentile of a sorted array.
 * @param values - Sorted array of numbers.
 * @param percentile - Percentile to calculate (0-100).
 * @returns The calculated percentile value.
 */
function percentile(values: number[], percentile: number): number {
    const index = (percentile / 100) * (values.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    return values[lower] * (1 - weight) + values[upper] * weight;
}



export function followLine(previousLine: Point[], pixels: Point[], next: Point[], delay: number, previousSpeed: number, previousCommands: Command[], previousTime: number[], totalTime: number[], test: Boolean, first = false) {

    let nextPoints: Point[];
    if (test) {
        nextPoints = simplifyLine(next, epsilon, 0.1);
        nextPoints = smoothLine(nextPoints, 2);
        
        nextPoints = nextPoints.map(point => pixelToGroundCoordinates(point));
        nextPoints = cutOffLineOnDistance(nextPoints.filter((point: Point) => point[1] < 420), 0.02);

    }

    let worldPoints = [];
    if (pixels.length > 0) {
        //pixels = removeOutliers(pixels, 2);
        worldPoints = simplifyLine(pixels, epsilon, 0.1);
        worldPoints = smoothLine(worldPoints, 2);
        
        
        // console.log("world", worldPoints);
        // console.log("command", previousCommands)
        if (worldPoints[0] == undefined) {
            worldPoints = [];
        }
        worldPoints = worldPoints.length > 0 ? worldPoints.map(point => pixelToGroundCoordinates(point)) : [];
        worldPoints = cutOffLineOnDistance(worldPoints.filter((point: Point) => point[1] < 420), 0.02);
        let procrustesLine; 


        if (first) {
            previousLine = worldPoints
        }

        if (previousLine.length == 0 && worldPoints.length > 0 && previousCommands[0].radius == 2) {
            previousLine = worldPoints;
        }
    }

    console.log("previous line", previousLine);


    /* TESTING */
    let multiplier = 1;
    let distanceTest = 0.06 / multiplier;
    if (test) {
        try {
            if (nextPoints && nextPoints.length > 20 && worldPoints.length > 20) {
                let res = procrustes(worldPoints, nextPoints, 0.6);
                distanceTest = Math.max(res.distance, 0.06);
            }

        } catch (e) { }
    }
    /* TESTING */

    previousLine = showLineAboveY(previousLine, 0);
    let guessLine = previousLine;
    let robotPosition = { x: 0, y: 0, angle: 0 };
    const sameLine = worldPoints.length > 0 && worldPoints[0][0] == previousLine[0][0];
    let guessFirst = true;
    if (worldPoints.length == 0) {
        
        console.log("found? ", guessLine.find(value => value[1] > 0));
        for (let i = 0; i < previousCommands.length; i++) {
            const command = previousCommands[i];
            if (command.radius == Infinity) {
                robotPosition.y = robotPosition.y + command.distance * Math.min((previousTime[i] / totalTime[i]), 1);
            } else {
                robotPosition = getRobotPositionAfterArc({ angle: command.angle * -1, radius: command.radius, distance: 0 }, robotPosition, Math.min((previousTime[i] / totalTime[i]), 1));
            }
        }
        guessLine = rotateAndTranslateLine(previousLine, -1 * robotPosition.angle, [-1 * robotPosition.x, -1 * robotPosition.y]);
        guessLine = showLineAboveY(guessLine, 0);
        if (guessLine.length < 50 || !guessLine.find(value => value[1] > 0)) {
            start = .03;
            lookahead = .07;
            console.log("MODIFIED");
            guessLine = previousLine;
        }
    }

    console.log("POSITION", robotPosition, "RATIO", Math.min((previousTime[0] / totalTime[0]), 1), "PREVIOUS", previousTime[0], totalTime[0]);
    // Guess the location of the previous line
    // console.log("position", robotPosition);

    //let guessLine = previousLine;
    console.log("before", previousLine, "after", guessLine);

    // console.log("guess", guessLine);
    if (guessLine.length == 0) {
        return;
    }

    let line;
    if (worldPoints.length > 0) {
        // Cutting off segments to the overlap portion
        let segment1 = showLineAboveY(guessLine, Math.max(worldPoints.length > 0 ? worldPoints[0][1] : 0, guessLine[0][1]));
        let segment2;
        if (worldPoints.length > 0) {
            segment2 = showLineBelowY(worldPoints, Math.min(guessLine[guessLine.length - 1][1], worldPoints[worldPoints.length - 1][1]))
        } else {
            segment2 = [];
        }

        // Distance of the world line
        let worldDistance = 0;
        for (let i = 0; i < worldPoints.length - 1; i++) {
            worldDistance += distanceBetweenPoints(worldPoints[i], worldPoints[i + 1]);
        }

        // Collect the error between guess and world
        let procrustesResult: ProcrustesResult;
        if (previousCommands.length == 0 && false) {

            procrustesResult = procrustes(segment1, segment2);
        } else if (worldDistance > 0.02) {

            const scaleValues = [];
            const start = 0.7;
            const end = 0.9;
            const interval = 0.01;
            for (let value = start; value <= end; value += interval) {
                scaleValues.push(value); // Keeps precision at 1 decimal
            }
            let lowestError = Infinity;
            let bestResult = null;
            scaleValues.forEach(scale => {
                // Apply the Procrustes transformation

                // Calculate cumulative error
                //TODO
                let world1 = worldPoints
                let guess1 = guessLine;
                try {
                    // segment 1 is guessLine
                    // segment 2 is worldPoints
                    let result = procrustes(guessLine, world1, scale);
                    let guessLine2 = rotateCurve(segment1.map(point => ({ x: point[0], y: point[1] })), result.rotation);
                    //console.log(guessLine2);
                    if (guessLine2) {
                        guessLine2 = guessLine2.map((point: { x: number, y: number }) => [point.x, point.y]);
                        guessLine2 = applyTranslation(guessLine2, result.translation);
                        guessLine2 = showLineAboveY(guessLine2, 0);
                        let cumulativeError = calculateLineError(segment2, guessLine2)
                        // Update if we find a lower cumulative error
                        if (cumulativeError < lowestError && (Math.abs(result.rotation) < 0.2) && Math.abs(result.translation[0]) < 0.03 && Math.abs(result.translation[1]) < 0.03) {
                        //if (cumulativeError < lowestError) {
                            lowestError = cumulativeError;
                            bestResult = result;
                        }
                    }
                } catch (e) {

                }
                // try {
                //     let result = procrustes(segment1, segment2, scale);
                //     let guessLine2 = rotateCurve(guessLine.map(point => ({ x: point[0], y: point[1] })), result.rotation);
                //     //console.log(guessLine2);
                //     if (guessLine2) {
                //         guessLine2 = guessLine2.map((point: { x: number, y: number }) => [point.x, point.y]);
                //         guessLine2 = applyTranslation(guessLine2, result.translation);
                //         guessLine2 = showLineAboveY(guessLine2, 0);
                //         let cumulativeError = calculateLineError(worldPoints, guessLine2)
                //         // Update if we find a lower cumulative error
                //         if (cumulativeError < lowestError) {
                //             lowestError = cumulativeError;
                //             bestResult = result;
                //         }
                //     }
                // } catch (e) {

                // }
            });
            procrustesResult = bestResult;
            // if (procrustesResult && (procrustesResult.rotation > 0.5 || procrustesResult.rotation < 0.5)) {
            //     procrustesResult = { translation: [0, 0], rotation: 0, distance: 0 };
            // } else if (!procrustesResult) {
            //     procrustesResult = { translation: [0, 0], rotation: 0, distance: 0 };
            // }
        } else {
            // If the current frame doesn't contain that many points, just use previous guess
            procrustesResult = { translation: [0, 0], rotation: 0, distance: 0 };
        }

        // Correct the guess of the previous line
        // console.log("guess line", guessLine);
        if (!procrustesResult) {
            procrustesResult = { translation: [0, 0], rotation: 0, distance: 0 };
        }
        console.log("result", procrustesResult, procrustesResult.translation[1]);
        line = rotateCurve(guessLine.map((point: Point) => ({ x: point[0], y: point[1] })), procrustesResult.rotation).map((point: { x: number, y: number }) => [point.x, point.y]);
        line = applyTranslation(line, procrustesResult.translation);
        line = showLineAboveY(line, 0);

        console.log("previous line", line);

        if (line.length < 1) {
            return;
        }

        let trimmedLine;
        if (worldDistance > 0.05 && line.length > 0) {
            // If we have enough points to append, add the new portion of the current camera frame
            let test2 = worldPoints.slice(Math.round(worldPoints.length/2), worldPoints.length)
            if (test2.length > 0) {
                let trimmedLine = cutOffLineAtOverlap(line, test2);
                line = trimmedLine.overlap ? trimmedLine.line : blendLines(trimmedLine.line, test2);
            } 
            
        }

        line = smoothLine(line);
    } else {
        line = guessLine;
        line = showLineAboveY(line, 0);
    }
    //line = rebalanceCurve(line.map((point: Point) => ({ x: point[0], y: point[1] })), {}).map((point: { x: number, y: number }) => [point.x, point.y]);

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

    if (line.length == 0) {
        return;
    }

    // Create the spline 
    let splineLine = line;
    if (line.length > 0 && line[0][1] > 0) {
        splineLine = prependUntilTarget(line);
    }
    const xs = splineLine.map((point: Point) => point[0]);
    const ys = splineLine.map((point: Point) => point[1]);
    //console.log(ys, xs);
    const spline = new Spline.default(ys, xs); // Switch x and y so we no overlapping 'x' values

    // Find the end point for the Bezier curve
    let distance: number;
    if (test) {
        distance = distanceTest * 0.8;
    } else {
        distance = lookahead * 1;
    }

    const x1 = findPointAtDistanceWithIncrements(spline, 0.001, distance - .02);
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
        x3 = start;
    }
    const splineValue = spline.at(x3);
    if (typeof splineValue === 'undefined') {
        // Handle the error case - either return early or use a default value
        return {
            motorCommands: [],
            bezierPoints: [],
            line: []
        };
    }
    const point3 = { x: splineValue, y: x3 };

    // Find the x offset to correct
    const reference1 = [spline.at(spline.xs[0]), 0] // First point should be very close to 0
    const reference2 = [0, 0]
    //console.log("TRANSLATION", procrustesResult);

    let xOffset: number;
    if (test) {
        xOffset = 0;
    } else {
        xOffset = ((reference1[0] - reference2[0]))/1;
        //xOffset = -1*procrustesResult.translation[0];
    }
    //console.log("X OFFSET", xOffset);

    // We want to correct the offset and direct the robot to a future point on the curve
    // TODO: Add angle correction to the control points
    const bezier = new Bezier.Bezier(
        { x: point3.x + xOffset, y: point3.y },
        { x: point3.x + xOffset, y: point3.y + controlLength },
        isNaN(extendedPoint1.x) ? point2 : extendedPoint1,
        point2
    );

    console.log("BEZIER", bezier);

    const motorCommands: Command[] = [];

    // // Split the Bezier curve into a series of arcs
    const bezierPoints = bezierCurvePoints(bezier, bezierSamples);

    // for (let i = 0; i < bezierPoints.length - 1; i++) {
    //     const command = calculateCurveBetweenPoints(bezierPoints[i], bezierPoints[i + 1]);
    //     motorCommands.push(command);
    // }

    let command = createArcFromPoints(bezier.points[0], bezier.get(0.5), bezier.get(1));
    let ratio = 4/4;
    // command.angle = (command.angle* ratio) > 35 ? 35 : (command.angle* ratio);
    // command.angle = (command.angle * ratio) < -35 ? -35 : (command.angle* ratio);
    // if (command.radius > 50) {
    //     command = {radius: Infinity, angle: 0, distance: 0.03}
    // }
    motorCommands.push(command);


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

function createArcFromPoints(P1: PointObject, P2: PointObject, P3: PointObject): Command {
    // Midpoints of the segments
    const mid1 = { x: (P1.x + P2.x) / 2, y: (P1.y + P2.y) / 2 };
    const mid2 = { x: (P2.x + P3.x) / 2, y: (P2.y + P3.y) / 2 };

    // Perpendicular directions
    const dir1 = { x: P2.y - P1.y, y: P1.x - P2.x }; // Perpendicular to P1 -> P2
    const dir2 = { x: P3.y - P2.y, y: P2.x - P3.x }; // Perpendicular to P2 -> P3

    // Solve for intersection (center of the circle)
    const det = dir1.x * dir2.y - dir1.y * dir2.x;
    if (Math.abs(det) < 1e-9) {
        // The points are collinear, no valid arc
        return { radius: Infinity, angle: 0, distance: distanceBetweenPoints([P1.x, P1.y], [P3.x, P3.y]) };
    }

    const dx = mid2.x - mid1.x;
    const dy = mid2.y - mid1.y;
    const t = (dy * dir2.x - dx * dir2.y) / det;

    const center = {
        x: mid1.x + t * dir1.x,
        y: mid1.y + t * dir1.y
    };

    // Radius of the circle
    const radius = Math.sqrt((P1.x - center.x) ** 2 + (P1.y - center.y) ** 2) * 39.37;

    // Angles of the points
    const startAngle = Math.atan2(P1.y - center.y, P1.x - center.x) * (180 / Math.PI);
    const middleAngle = Math.atan2(P2.y - center.y, P2.x - center.x) * (180 / Math.PI);
    const endAngle = Math.atan2(P3.y - center.y, P3.x - center.x) * (180 / Math.PI);

    // Determine sweep direction (left or right)
    const crossProduct = (P2.x - P1.x) * (P3.y - P2.y) - (P2.y - P1.y) * (P3.x - P2.x);
    let sweepAngle = endAngle - startAngle;

    if (sweepAngle > 180) {
        sweepAngle -= 360;
    } else if (sweepAngle < -180) {
        sweepAngle += 360;
    }

    if (crossProduct < 0) {
        // Left turn: negative angle
        if (sweepAngle > 0) sweepAngle = sweepAngle * -1;
    } else {
        // Right turn: positive angle
        if (sweepAngle < 0) sweepAngle = sweepAngle * -1;
    }

    return {
        radius,
        angle: sweepAngle * -1,
        distance: 0
    };
}


function calculateCurveBetweenPoints(pointA: RobotPosition, pointB: RobotPosition) {
    const { x: x1, y: y1, angle: theta1Rad } = pointA;
    const { x: x2, y: y2, angle: theta2Rad } = pointB;

    // Midpoint and distance between points A and B
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const distanceAB = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    // Calculate the bisector angle and tangent angle for radius calculation
    const angleBisector = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;
    const tanAngle = Math.tan((theta2Rad - theta1Rad) / 2);

    // If tanAngle is close to zero, it's a straight line
    if (Math.abs(tanAngle) < 1e-6) {
        // Return infinite radius and the straight-line distance
        return { radius: Infinity, angle: 0, distance: distanceAB };
    }

    // Calculate the radius of the curve
    const radius = distanceAB / (2 * tanAngle);

    // Angle to travel on the circumference
    const angleRad = 2 * Math.atan2(distanceAB, 2 * radius);

    // Convert to inches assuming pixels to inches ratio (e.g., 39.37 pixels/inch)
    const radiusInches = Math.abs(radius * 39.37);
    let angleDegrees = angleRad * (180 / Math.PI);
    if (angleDegrees > 180) {
        angleDegrees = angleDegrees - 360;
    }

    // Calculate arc length for the curved path (angle in radians * radius)
    const arcLength = Math.abs(angleRad * radiusInches);

    return { radius: radiusInches, angle: angleDegrees, distance: arcLength };
}
