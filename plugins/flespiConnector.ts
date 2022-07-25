import { connect, MqttClient } from "mqtt";
import { Context, Plugin } from "@nuxt/types";
import Vue from "vue";
import { Inject } from "@nuxt/types/app";

/// Modules declaration
declare module "vue/types/vue" {
    interface Vue {
        /**
         * Connects to Flespi client and fetch position data.
         * @returns The mqtt client connected to Flespi
         */
        $initiateClient(): MqttClient
        $getPositionData(client: MqttClient, channels: Channel[]): MqttClient
        $getDeviceList(): Promise<Device[]>
        $handleUpdatedPosition(client: MqttClient, result: GeolocationPosition): void
    }
}

declare module "@nuxt/types" {
    interface NuxtAppOptions {
        /**
         * Connects to Flespi client and fetch position data.
         * @returns The mqtt client connected to Flespi
         */
        $initiateClient(): MqttClient
        $getPositionData(client: MqttClient, channels: Channel[]): MqttClient
        $getDeviceList(): Promise<Device[]>
        $handleUpdatedPosition(client: MqttClient, result: GeolocationPosition): void
    }
    interface Context {
        /**
         * Connects to Flespi client and fetch position data.
         * @returns The mqtt client connected to Flespi
         */
        $initiateClient(): MqttClient
        $getPositionData(client: MqttClient, channels: Channel[]): MqttClient
        $getDeviceList(): Promise<Device[]>
        $handleUpdatedPosition(client: MqttClient, result: GeolocationPosition): void
    }
}

declare module "vuex/types/index" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Store<S> {
        /**
         * Connects to Flespi client and fetch position data.
         * @returns The mqtt client connected to Flespi
         */
        $initiateClient(): MqttClient
        $getPositionData(client: MqttClient, devices: Channel[]): MqttClient
        $getDeviceList(): Promise<Device[]>
        $handleUpdatedPosition(client: MqttClient, result: GeolocationPosition): void
    }
}

/// Event buses
/**
 * EventBus to transmit data to component.
 */
export const eventBus = new Vue(); // creating an event bus.

/// Methods
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

    const channels = [
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
 * Calls Flespi API to get the list of all active devices
 */
async function getDevices (): Promise<Device[]> {
    // Token needed to authenticate in Flespi
    const token: string = "FlespiToken " + process.env.FLESPI_KEY;

    // Get the data via the API
    const pendingResponse = await fetch(
        "https://flespi.io/gw/devices/all",
        {
            headers: {
                Authorization: token
            }
        }
    );

    const json = await pendingResponse.json();

    return json.result.map((device: any) => ({
        name: device.name,
        id: device.configuration.ident
    }));
}

function handleNewPosition (client: MqttClient, result: GeolocationPosition): void {
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

function generateRandomId (length: number): string {
    return "_" + Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Method plugin
 */
const plugin: Plugin = (_context: Context, inject: Inject) => {
    inject("initiateClient", createClient);
    inject("getPositionData", setupClient);
    inject("getDeviceList", getDevices);
    inject("handleUpdatedPosition", handleNewPosition);
};

export default plugin;
