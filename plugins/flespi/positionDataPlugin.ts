import { MqttClient } from "mqtt";
import { generateRandomId } from "~/plugins/utils";

/**
 * Sends new locationdata from the client device to Flespi
 * @param client - the MqttClient used to send data
 * @param result - the new location of the client device
 */
export function handleNewPosition (client: MqttClient, result: GeolocationPosition): void {
    const data = {
        ident: client.options.clientId || generateRandomId(10),
        timestamp: result.timestamp / 1000, // convert miliseconds to seconds
        "position.latitude": result.coords.latitude,
        "position.longitude": result.coords.longitude,
        "position.altitude": result.coords.altitude
    };
    client.publish("paradar/smartphone", JSON.stringify(data), { qos: 0 });
}
