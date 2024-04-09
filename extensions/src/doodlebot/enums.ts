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
    wifi: "k",
    lowPower: "q",
    display: "w",
    pen: "u",
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

export const display = {
    clear: "c",
    sad: "s",
    happy: "T",
    child: "H"
} as const;

export type DisplayKey = keyof typeof display;
export type Display = typeof display[DisplayKey];
export const displayKeys = Object.keys(display) as DisplayKey[];


export const keyBySensor = Object.fromEntries(Object.entries(sensor).map(([key, value]) => [value, key])) as SensorKeyByValue;

export const motorCommandReceived = "ms";

export const networkStatus = {
    ipPrefix: "RPI ipaddr:",
    hostnamePrefix: "hname:",
} as const;

export type NetworkStatusKey = keyof typeof networkStatus;
export type NetworkStatus = typeof networkStatus[NetworkStatusKey];

export type ReceivedCommand = Sensor | typeof motorCommandReceived;

export const port = {
    websocket: "8765",
    camera: "8000"
}

const endpoint = {
    camera: "video_feed'"
}