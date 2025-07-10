//import { procrustes } from "./transform-lines-2";
import {
    procrustesNormalizeCurve,
    findProcrustesRotationAngle,
    rebalanceCurve,
    shapeSimilarity,
    rotateCurve
  } from 'curve-matcher';

import { type Point, type ProcrustesResult, applyTranslation, distanceBetweenPoints, cutOffLineAtOverlap } from './LineHelper';


function calculateCentroid(line: Point[]) {
    const n = line.length;
    
    // Sum all x and y coordinates
    const sum = line.reduce((acc: number[], point: Point) => {
        return [acc[0] + point[0], acc[1] + point[1]];
    }, [0, 0]);
    
    // Return the average coordinates as the centroid
    return [sum[0] / n, sum[1] / n];
}


function getSublinesOfLength(line: Point[], totalDistance: number) {
    let sublines = [];

    // Iterate over each starting point in the line
    for (let start = 0; start < line.length - 1; start++) {
        let currentLine = [line[start]]; 
        let currentDistance = 0;

        // Extend the subline from the start point until the total distance is reached
        for (let i = start + 1; i < line.length; i++) {
            const point1 = line[i - 1];
            const point2 = line[i];
            const segmentDistance = distanceBetweenPoints(point1, point2);

            currentDistance += segmentDistance;
            currentLine.push(point2);

            // If the accumulated distance meets or exceeds the target, save the subline
            if (currentDistance >= totalDistance) {
                sublines.push(currentLine);
                break;
            }
        }
    }

    return sublines;
}


function findOptimalTranslation(line1: Point[], line2: Point[]) {
    // Calculate centroids for both lines
    const centroid1 = calculateCentroid(line1);
    const centroid2 = calculateCentroid(line2);
    
    // Determine translation vector needed to align centroids
    const translationVector = [
        centroid1[0] - centroid2[0],
        centroid1[1] - centroid2[1]
    ];

    // Apply translation to line2
    const translatedLine = applyTranslation(line2, translationVector);
    
    return {
        translationVector,
        translatedLine
    };
}


function rebalanceLine(line: Point[]) {
    return rebalanceCurve(line.map((point: Point) => ({ x: point[0], y: point[1] })), {}).map(point => [point.x, point.y]);
}

function mapLine(line: Point[]) {
    return line.map((point: Point) => ({ x: point[0], y: point[1] }))
}

function mapCurve(line: {x: number, y: number}[]) {
    return line.map((point: {x: number, y: number}) => [point.x, point.y]);
}

function getError(line1: Point[], line2: Point[]) {
    // Normalize and balance each curve
    const balanced1 = procrustesNormalizeCurve(rebalanceCurve(mapLine(line1), {}));
    const balanced2 = procrustesNormalizeCurve(rebalanceCurve(mapLine(line2), {}))

    // Find the rotation between the two lines
    const rotation = findProcrustesRotationAngle(balanced1, balanced2);
    
    const points1 = rebalanceLine(line1);
    const points2 = rebalanceLine(line2);

    let rotatedCurve1 = rotateCurve(mapLine(points1), rotation);

    // Find the translation between the two lines
    const {translatedLine, translationVector} = findOptimalTranslation(points2, mapCurve(rotatedCurve1));
    
    return {curve1: translatedLine, curve2: points2, rotation: rotation, translation: translationVector}
}

export function procrustes(line1: Point[], line2: Point[], ratio=0.5): ProcrustesResult {
    // Balance each line to have the same number of points
    line1 = mapCurve(rebalanceCurve(mapLine(line1), {}));
    line2 = mapCurve(rebalanceCurve(mapLine(line2), {}));

    const yValues = line2.map(point => point[1]);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    // Get the first ratio % of the 2nd line 
    const range = maxY - minY;
    const midY = minY + range*ratio;
    const line2Filtered = line2.filter(point => point[1] >= minY && point[1] <= midY);

    // Get the distance of the filtered line
    let totalDistance = 0;
    for (let i = 0; i < line2Filtered.length - 1; i++) {
        totalDistance += distanceBetweenPoints(line2Filtered[i], line2Filtered[i + 1]);
    }

    // Get a list of segments from the first line with around the same distance as the first line
    // TODO: Make this a range instead of a value
    let sublines = getSublinesOfLength(line1, totalDistance);

    // Get the most similar segment to the filtered second line
    let maxSimilarity = 0;
    let maxLine = sublines[0];
    for (const line of sublines) {
        const similarity = shapeSimilarity(mapLine(line), mapLine(line2Filtered), {checkRotations: false});
        if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
            maxLine = line;
        }
    }
    
    // Calculate the error between the most similar segments
    const { rotation, translation } = getError(maxLine, line2Filtered);
    let rotatedCurve1 = rotateCurve(mapLine(line1), rotation);
    let translatedLine1 = applyTranslation(mapCurve(rotatedCurve1), translation);

    const end = cutOffLineAtOverlap(translatedLine1, line2Filtered);

    return {rotation, translation, distance: end.distance };
}





