import { Sensor } from "./enums"

type SensorMessageReceived<Type extends Sensor, Parameters extends Record<string, string | number>> = {
    type: Sensor,
    parameters: (string | number)[]
}