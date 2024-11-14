export type Command = { radius: number, angle: number, distance: number };
export type Point = number[];
export type PointObject = {x: number, y: number};
export type RobotPosition = { x: number, y: number, angle: number };
export type ProcrustesResult = { rotation: number, translation: number[], distance: number };

export function distanceBetweenPoints(p1: Point, p2: Point): number {
    return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
}

function distance(p1: PointObject, p2: PointObject): number {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
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

export function calculateLineError(line1: Point[], line2: Point[]) {
    // Filter line points based on the overlapping y-range
    const yMin = Math.max(
        Math.min(...line1.map(([x, y]) => y)),
        Math.min(...line2.map(([x, y]) => y))
    );
    const yMax = Math.min(
        Math.max(...line1.map(([x, y]) => y)),
        Math.max(...line2.map(([x, y]) => y))
    );

    // Filter both lines to keep only points within the overlapping y range
    const line1Filtered = line1.filter(([x, y]) => y >= yMin && y <= yMax);
    const line2Filtered = line2.filter(([x, y]) => y >= yMin && y <= yMax);

    // Calculate cumulative translation error by finding the closest point
    let cumulativeError = 0;
    let count = 0;

    for (const [x1, y1] of line1Filtered) {
        let minDistance = Infinity;

        for (const [x2, y2] of line2Filtered) {
            // Calculate Euclidean distance between points
            const distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
            if (distance < minDistance) {
                minDistance = distance;
            }
        }

        // Sum the minimum distance found for this point in line1
        cumulativeError += minDistance;
        count++;
    }

    // Calculate average translation error
    const averageError = count > 0 ? cumulativeError / count : 0;
    return averageError;
}

function lerp(a: PointObject, b: PointObject, t: number): PointObject {
    return {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t
    };
}

function bezierMidpoint(P1: PointObject, C1: PointObject, C2: PointObject, P2: PointObject): PointObject {
    const A = lerp(P1, C1, 0.5);
    const B = lerp(C1, C2, 0.5);
    const C = lerp(C2, P2, 0.5);
    const D = lerp(A, B, 0.5);
    const E = lerp(B, C, 0.5);
    return lerp(D, E, 0.5);
}

function findSingleCircle(
P1: PointObject,
P2: PointObject,
midpoint: PointObject
): { center: PointObject; radius: number; angle: number } | null {
    const mid1 = { x: (P1.x + midpoint.x) / 2, y: (P1.y + midpoint.y) / 2 };
    const mid2 = { x: (P2.x + midpoint.x) / 2, y: (P2.y + midpoint.y) / 2 };

    const dir1 = { x: midpoint.y - P1.y, y: P1.x - midpoint.x };
    const dir2 = { x: midpoint.y - P2.y, y: P2.x - midpoint.x };

    const det = dir1.x * dir2.y - dir1.y * dir2.x;
    if (Math.abs(det) < 1e-9) return null;

    const dx = mid2.x - mid1.x;
    const dy = mid2.y - mid1.y;
    const u = (dy * dir2.x - dx * dir2.y) / det;

    const center = {
        x: mid1.x + u * dir1.x,
        y: mid1.y + u * dir1.y
    };

    const radiusInPixels = distance(center, P1);
    const radiusInInches = radiusInPixels * 39.3701; // Convert pixels to inches

    // Calculate angles in radians
    const angle1 = Math.atan2(P1.y - center.y, P1.x - center.x);
    const angle2 = Math.atan2(P2.y - center.y, P2.x - center.x);

    // Calculate the angle difference
    let angleInDegrees = (angle2 - angle1) * (180 / Math.PI);

    // Normalize the angle to range [-180, 180]
    if (angleInDegrees > 180) {
        angleInDegrees -= 360;
    } else if (angleInDegrees < -180) {
        angleInDegrees += 360;
    }

    return { center, radius: radiusInInches, angle: -1*angleInDegrees };
}


export function approximateBezierWithArc(P1: PointObject, C1: PointObject, C2: PointObject, P2: PointObject): { center: PointObject; radius: number; angle: number } | null {
    const midpoint = bezierMidpoint(P1, C1, C2, P2);
    return findSingleCircle(P1, P2, midpoint);
}