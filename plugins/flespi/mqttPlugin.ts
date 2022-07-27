import { connect, MqttClient } from "mqtt";
import { eventBus, generateRandomId } from "~/plugins/utils";

/**
 * Creating and connecting Flespi client
 * @returns the MqttClient used to send and receive data from Flespi
 */
export function createClient (): MqttClient {
    const client = connect("wss://mqtt.flespi.io", {
        clientId: generateRandomId(10),
        // see https://flespi.com/kb/tokens-access-keys-to-flespi-platform to read about flespi tokens
        username: "FlespiToken " + process.env.FLESPI_KEY,
        protocolVersion: 5,
        clean: true
    });

    // Hardcode channels for prototype, see also apiPlugin
    const channels: Channel[] = [
        {
            id: 1134425,
            name: "oSoc - Tracker"
        },
        {
            id: 1135031,
            name: "oSoc - Smartphone"
        }
    ];

    return setupClient(client, channels);
}

/**
 * Sets up the MqttClient to handle messages
 * @returns the connected client
 */
function setupClient (client: MqttClient, channels: Channel[]): MqttClient {
    // When the client is connected, we subscribe to the channel topics
    client.on("connect", () => {
        channels.forEach((channel: Channel) => {
            client.subscribe("flespi/message/gw/channels/" + channel.id + "/+", { qos: 1 }, (error: Error) => {
                if (error) {
                    client.end(true); // force disconnect if error
                }
            });
        });
    });

    // emits data from Flespi whenever the subscription receives it
    client.on("message", (_topic: string, msg: Buffer) => {
        const data = JSON.parse(msg.toString("utf-8"));
        eventBus.$emit("newCoordinates", {
            latitude: data["position.latitude"],
            longitude: data["position.longitude"],
            altitude: data["position.altitude"],
            direction: data["position.direction"],
            satellites: data["position.satellites"],
            speed: data["position.speed"],
            sleepMode: data["sleep.mode.status"],
            timestamp: data.timestamp,
            batteryLevel: data["battery.level"],
            alarmEvent: data["alarm.event"],
            movementStatus: data["movement.status"],
            id: data.ident
        });
    });

    client.on("error", (error) => {
        console.error(error);
        client.end(true);
    });

    return client;
}
