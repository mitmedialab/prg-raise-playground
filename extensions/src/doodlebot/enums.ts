const anim = {
    angry: "a",
    annoyed: "y",
    confused: "m",
    disgust: "d",
    engaged: "e",
    fear: "f",
    happy: "h",
    love: "o",
    neutral: "n",
    sad: "s",
    sleeping: "l",
    surprise: "p",
    wink: "i",
    worried: "r",
    wrong: "w",
} as const;

export type Anim = keyof typeof anim;

export const anims = Object.keys(anim) as Anim[];

export const command = {
    enable: "e",
    disable: "x",
    motor: "m",
    arc: "t",
} as const;

export type CommandKey = keyof typeof command;
export type Command = typeof command[CommandKey];

export const sensor = {
    battery: "f",
    bumper: "b",
    humidity: "h",
    pressure: "p",
    distance: "d",
    altimeter: "u",
    magnometer: "o",
    temperature: "t",
    accelerometer: "a",
    gyroscope: "g",
    light: "l",
} as const;

export type SensorKey = keyof typeof sensor;
export type Sensor = typeof sensor[SensorKey];
export type SensorKeyByValue = { [K in SensorKey as typeof sensor[K]]: K };

export const keyBySensor = Object.fromEntries(Object.entries(sensor).map(([key, value]) => [value, key])) as SensorKeyByValue;

export const motorCommandReceived = "ms";

export type ReceivedCommand = Sensor | typeof motorCommandReceived;