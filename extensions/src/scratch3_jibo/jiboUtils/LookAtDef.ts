
type Coords = {
    x: number;
    y: number;
    z: number;
};
export const Direction = {
    up: `up`,
    down: `down`,
    right: `right`,
    left: `left`,
    forward: `forward`,
    //backward: `backward`,
} as const;
export type DirType = typeof Direction[keyof typeof Direction];
type DirDefType = {
    value: Coords;
};
export const directionDef: Record<DirType, DirDefType> = {
    [Direction.up]: {
        value: { x: 500, y: 100, z: 500 },
    },
    [Direction.down]: {
        value: { x: 500, y: 100, z: -500 },
    },
    [Direction.left]: {
        value: { x: 100, y: 500, z: 100 },
    },
    [Direction.right]: {
        value: { x: 100, y: -500, z: 100 },
    },
    [Direction.forward]: {
        value: { x: 500, y: 100, z: 100 },
    },
    /*[Direction.backward]: {
        value: { x: -500, y: 100, z: 100 },
    },*/
};