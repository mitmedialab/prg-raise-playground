//import { procrustes } from "./transform-lines-2";
import {
    procrustesNormalizeCurve,
    procrustesNormalizeRotation,
    findProcrustesRotationAngle,
    rebalanceCurve,
    shapeSimilarity,
    rotateCurve
  } from 'curve-matcher';

type Point = number[];

function distanceBetweenPoints(p1: Point, p2: Point): number {
    return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
}

function calculateCentroid(line: Point[]) {
    const n = line.length;
    const sum = line.reduce((acc: number[], point: Point) => {
        return [acc[0] + point[0], acc[1] + point[1]];
    }, [0, 0]);
    
    return [sum[0] / n, sum[1] / n]; // Return the average of the x and y coordinates
}

export function applyTranslation(line: Point[], translationVector: number[]) {
    return line.map(point => [
        point[0] + translationVector[0],
        point[1] + translationVector[1]
    ]);
}

function getSublinesOfLength(line: Point[], totalDistance: number) {
    let sublines = [];

    for (let start = 0; start < line.length - 1; start++) {
        let currentLine = [line[start]]; 
        let currentDistance = 0;

        for (let i = start + 1; i < line.length; i++) {
            const point1 = line[i - 1];
            const point2 = line[i];
            const segmentDistance = distanceBetweenPoints(point1, point2);

            currentDistance += segmentDistance;
            currentLine.push(point2);

            if (currentDistance >= totalDistance) {
                sublines.push(currentLine);
                break;
            }
        }
    }

    return sublines;
}


function findOptimalTranslation(line1: Point[], line2: Point[]) {
    const centroid1 = calculateCentroid(line1);
    const centroid2 = calculateCentroid(line2);
    
    const translationVector = [
        centroid1[0] - centroid2[0],
        centroid1[1] - centroid2[1]  
    ];

    const translatedLine2 = applyTranslation(line2, translationVector);
    
    return {
        translationVector,
        translatedLine2
    };
}

function rebalanceLine(line: Point[]) {
    return rebalanceCurve(line.map((point: Point) => ({ x: point[0], y: point[1] })), {}).map(point => [point.x, point.y]);
}

function mapLine(line: Point[]) {
    return line.map((point: Point) => ({ x: point[0], y: point[1] }))
}

function mapCurve(line: Point[]) {
    return line.map((point: Point) => [point.x, point.y]);
}

function getError(line1: Point[], line2: Point[]) {
    const balanced1 = procrustesNormalizeCurve(rebalanceCurve(mapLine(line1), {}));
    const balanced2 = procrustesNormalizeCurve(rebalanceCurve(mapLine(line2), {}))
    const rotation = findProcrustesRotationAngle(balanced1, balanced2);

    
    const points1 = rebalanceLine(line1);
    const points2 = rebalanceLine(line2);

    let rotatedCurve1 = rotateCurve(mapLine(points1), rotation);

    const {translatedLine2, translationVector} = findOptimalTranslation(points2, mapCurve(rotatedCurve1));
    const translatedLine1 = translatedLine2;
    
    return {curve1: translatedLine1, curve2: points2, rotation: rotation, translation: translationVector}
}

function findClosestPoint(line: Point[], targetPoint: Point): number {
    let closestPointIndex = 0;
    let minDistance = Infinity;

    line.forEach((point, index) => {
        const distance = distanceBetweenPoints(point, targetPoint);
        if (distance < minDistance) {
            minDistance = distance;
            closestPointIndex = index;
        }
    });

    return closestPointIndex; // Return the index of the closest point
}

export function cutOffLineAtOverlap(line1: Point[], line2: Point[]): { line: Point[], distance: number, overlap: Boolean } {
    const line2StartPoint = line2[0];
    let closestPointIndex: number;
    const line1End = line1[line1.length - 1];
    const line2End = line2[line2.length - 1];
    
    let finalLine: Point[];
    let overlap = false;

    closestPointIndex = findClosestPoint(line1, line2StartPoint);
    if (line2End[1] > line1End[1]) {
        finalLine = line1.slice(0, closestPointIndex + 1);
        
    } else {
        finalLine = line1;
        overlap = true;
    }

    const trimmedLine = line1.slice(0, closestPointIndex + 1);

    let totalDistance = 0;

    for (let i = 0; i < trimmedLine.length - 1; i++) {
        const point1 = trimmedLine[i];
        const point2 = trimmedLine[i + 1];
        
        const distance = Math.sqrt(
            Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2)
        );
        totalDistance += distance;
    }

    return {line: finalLine, distance: totalDistance, overlap};
}


export function procrustes(line1: Point[], line2: Point[], ratio=0.5): { rotation: number, translation: number[] } {
    line1 = mapCurve(rebalanceCurve(mapLine(line1), {}));
    line2 = mapCurve(rebalanceCurve(mapLine(line2), {}));

    const yValues = line2.map(point => point[1]);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    let midY: number;
    const range = maxY - minY;
    midY = minY + range*ratio;
    const line2Filtered = line2.filter(point => point[1] >= minY && point[1] <= midY);

    let totalDistance = 0;
    for (let i = 0; i < line2Filtered.length - 1; i++) {
        totalDistance += distanceBetweenPoints(line2Filtered[i], line2Filtered[i + 1]);
    }

    let sublines = getSublinesOfLength(line1, totalDistance);
    sublines = [...sublines]
    let maxSimilarity = 0;
    let maxLine = sublines[0];

    for (const line of sublines) {
        const similarity = shapeSimilarity(mapLine(line), mapLine(line2Filtered), {checkRotations: false});
        if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
            maxLine = line;
        }
    }
    
    const { rotation, translation } = getError(maxLine, line2Filtered);
    let rotatedCurve1 = rotateCurve(mapLine(line1), rotation);
    let translatedLine1 = applyTranslation(mapCurve(rotatedCurve1), translation);

    const end = cutOffLineAtOverlap(translatedLine1, line2Filtered);

    return {rotation, translation };
}





