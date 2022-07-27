/**
 * This is the data the client device will send to Flespi
 */
declare type LocationData = {
    ident: string,
    timestamp: number,
    "position.longitude": number,
    "position.latitude": number,
    "position.altitude": number | null
}
