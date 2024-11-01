export type Command = { radius: number, angle: number };
export type Point = number[];
export type RobotPosition = { x: number, y: number, angle: number };
export type ProcrustesResult = { rotation: number, translation: number[] };

export function distanceBetweenPoints(p1: Point, p2: Point): number {
    return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
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
    
    let line: Point[];
    let overlap = false;

    closestPointIndex = findClosestPoint(line1, line2StartPoint);
    if (line2End[1] > line1End[1]) {
        line = line1.slice(0, closestPointIndex + 1);
    } else {
        line = line1;
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

    return {line, distance: totalDistance, overlap};
}

export function applyTranslation(line: Point[], translationVector: number[]) {
    return line.map(point => [
        point[0] + translationVector[0],
        point[1] + translationVector[1]
    ]);
}