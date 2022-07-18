import { connect, MqttClient } from "mqtt";
import { Context, Plugin } from "@nuxt/types";
import Vue from "vue";
import { Inject } from "@nuxt/types/app";

/// Models
/**
 * Position interface to get position data from a tracker
 */
export interface Position {
    altitude?: number,
    direction?: number,
    hdop?: number,
    latitude: number,
    longitude: number,
    pdop?: number,
    satellites?: number,
    speed?: number,
    valid?: boolean
}

/**
 * A device connected to Flespi
 */
export interface Device {
    id: number,
    name: string
}

/// Modules declaration
declare module "vue/types/vue" {
    interface Vue {
        /**
         * Connects to Flespi client and fetch position data.
         * @returns The mqtt client connected to Flespi
         */
        $initiateClient(): MqttClient
        $getPositionData(devices: Device[]): MqttClient
        $getDeviceList(): Promise<Device[]>
    }
}

declare module "@nuxt/types" {
    interface NuxtAppOptions {
        /**
         * Connects to Flespi client and fetch position data.
         * @returns The mqtt client connected to Flespi
         */
        $getPositionData(devices: Device[]): MqttClient
        $getDeviceList(): Promise<Device[]>
    }
    interface Context {
        /**
         * Connects to Flespi client and fetch position data.
         * @returns The mqtt client connected to Flespi
         */
        $getPositionData(devices: Device[]): MqttClient
        $getDeviceList(): Promise<Device[]>
    }
}

declare module "vuex/types/index" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Store<S> {
        /**
         * Connects to Flespi client and fetch position data.
         * @returns The mqtt client connected to Flespi
         */
        $getPositionData(devices: Device[]): MqttClient
        $getDeviceList(): Promise<Device[]>
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
    return connect("wss://mqtt.flespi.io", {
        clientId: process.env.FLESPI_CLIENT_ID,
        // see https://flespi.com/kb/tokens-access-keys-to-flespi-platform to read about flespi tokens
        username: "FlespiToken " + process.env.FLESPI_KEY,
        protocolVersion: 5,
        clean: true
    });
}

/**
 * Creates the MqttClient to connect with Flespi
 *
 * @returns the connected client
 */
function setupClient (devices: Device[]): MqttClient {
    const client:MqttClient = createClient();

    // When the client is connected, we subscribe to the telemetry topic
    client.on("connect", () => {
        devices.forEach((device) => {
             client.subscribe("flespi/state/gw/devices/" + device.id + "/telemetry/#", { qos: 1 }, (err: Error) => {
                 if (err) {
                     client.end(true); // force disconnect
                 }
             });
            console.log("testttt", device);
        });
    });

    // emits new coordinates whenever the subscription receives new data
    client.on("message", (topic: string, msg: Buffer) => {
        // topic as received is : flespi/state/gw/devices/4530445/telemetry/<informationName>
        const splitTopic: string[] = topic.split("/");
        const informationName: string = splitTopic[splitTopic.length - 1];
        const deviceID: number = Number(splitTopic[splitTopic.length - 3]); // Get the device ID

        if (informationName === "position") {
            // emitNewCoordinates(convertToObject(msg.toString("utf8"))); // Emit the new position
            console.log("emit new coordinates");
        }
    });

    return client;
}

/**
 * Convert the position string to an actual object
 */
function convertToObject (json: string): Position {
    return JSON.parse(json);
}

/**
 * Emits the new coordinates to the parent component
 */
function emitNewCoordinates (position: Position): void {
    eventBus.$emit("newCoordinates", [position.longitude, position.latitude]);
}

/**
 * Calls Flespi API to get the list of all connected devices
 */
async function callAPI (): Promise<Device[]> {
    // Token needed to authenticate in Flespi
    const token: string = "FlespiToken " + process.env.FLESPI_KEY;
    const devices: Device[] = [];

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

    for (let i = 0; i < json.result.length; i++) {
        devices.push(json.result[i]);
    }

    return devices;
}

/**
 * Method plugin
 */
const plugin: Plugin = (_context: Context, inject: Inject) => {
    inject("initiateClient", () => {
        return createClient();
    });
    inject("getPositionData", (devices: Device[]) => {
        return setupClient(devices);
    });
    inject("getDeviceList", () => {
        return callAPI();
    });
};

export default plugin;
