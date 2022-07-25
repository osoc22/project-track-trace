import { connect, MqttClient } from "mqtt";
import { Context, Plugin } from "@nuxt/types";
import { Inject } from "@nuxt/types/app";
import { eventBus, generateRandomId } from "~/plugins/utils";

/// Modules declaration
declare module "vue/types/vue" {
    interface Vue {
        /**
         * Connects to Flespi client and fetch position data.
         * @returns The mqtt client connected to Flespi
         */
        $initiateClient(): MqttClient
    }
}

/**
 * Creating and connecting Flespi client
 */
function createClient (): MqttClient {
    const client = connect("wss://mqtt.flespi.io", {
        clientId: generateRandomId(10),
        // see https://flespi.com/kb/tokens-access-keys-to-flespi-platform to read about flespi tokens
        username: "FlespiToken " + process.env.FLESPI_KEY,
        protocolVersion: 5,
        clean: true
    });

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
 * Creates the MqttClient to connect with Flespi
 *
 * @returns the connected client
 */
function setupClient (client: MqttClient, channels: Channel[]): MqttClient {
    // When the client is connected, we subscribe to the telemetry topic
    client.on("connect", () => {
        console.log("Connected...");
        channels.forEach((channel: Channel) => {
            client.subscribe("flespi/message/gw/channels/" + channel.id + "/+", { qos: 1 }, (err: Error) => {
                if (err) {
                    client.end(true); // force disconnect
                }
                console.log(`Subscribed ${channel.id}`);
            });
        });
    });

    // emits new coordinates whenever the subscription receives new data
    client.on("message", (_topic: string, msg: Buffer) => {
        const data = JSON.parse(msg.toString("utf-8"));
        emitNewCoordinates({
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

/**
 * Emits the new coordinates to the parent component
 */
function emitNewCoordinates (position: Position): void {
    eventBus.$emit("newCoordinates", position);
}

/**
 * Method plugin
 */
const plugin: Plugin = (_context: Context, inject: Inject) => {
    inject("initiateClient", createClient);
};

export default plugin;
