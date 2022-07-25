import { MqttClient } from "mqtt";
import { generateRandomId } from "~/plugins/utils";

export function handleNewPosition (client: MqttClient, result: GeolocationPosition): void {
    const data = {
        ident: client.options.clientId || generateRandomId(10),
        timestamp: result.timestamp / 1000,
        "position.latitude": result.coords.latitude,
        "position.longitude": result.coords.longitude,
        "position.altitude": result.coords.altitude
    };
    sendLocationData(client, data);
}

function sendLocationData (client: MqttClient, data: LocationData): void {
    client.publish("paradar/smartphone", JSON.stringify(data), { qos: 0 });
}
