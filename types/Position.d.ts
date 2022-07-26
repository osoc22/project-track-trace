/**
 * This is the data received from Flespi
 * Questionmarks are mostly data that the phone does not have
 */
declare type Position = {
    altitude?: number,
    direction?: number,
    hdop?: number,
    latitude: number,
    longitude: number,
    pdop?: number,
    satellites?: number,
    speed?: number,
    valid?: boolean,
    timestamp: number,
    alarmEvent?: boolean,
    batteryLevel?: number,
    sleepMode?: boolean,
    movementStatus?: boolean,
    id: string
}
