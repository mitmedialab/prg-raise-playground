type RGB = {
    x: number;
    y: number;
    z: number;
};

export const Color = {
    Red: "red",
    Yellow: "yellow",
    Green: "green",
    Cyan: "cyan",
    Blue: "blue",
    Magenta: "magenta",
    White: "white",
    Random: "random",
    Off: "off",
} as const;
export type ColorType = typeof Color[keyof typeof Color];
type ColorDefType = {
    value: RGB;
};

export const colorDef: Record<ColorType, ColorDefType> = {
    [Color.Red]: {
        value: { x: 255, y: 0, z: 0 },
    },
    [Color.Yellow]: {
        value: { x: 255, y: 69, z: 0 },
    },
    [Color.Green]: {
        value: { x: 0, y: 167, z: 0 },
    },
    [Color.Cyan]: {
        value: { x: 0, y: 167, z: 48 },
    },
    [Color.Blue]: {
        value: { x: 0, y: 0, z: 255 },
    },
    [Color.Magenta]: {
        value: { x: 255, y: 0, z: 163 },
    },
    [Color.White]: {
        value: { x: 255, y: 255, z: 255 },
    },
    [Color.Random]: {
        value: { x: -1, y: -1, z: -1 },
    },
    [Color.Off]: {
        value: { x: 0, y: 0, z: 0 },
    },
};