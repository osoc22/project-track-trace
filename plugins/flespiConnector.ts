import { connect, MqttClient } from "mqtt";
import { Context, Plugin } from "@nuxt/types";
import Vue from "vue";
import { Inject } from "@nuxt/types/app";

declare module "vue/types/vue" {
    interface Vue {
        /**
         * Connects to Flespi client and fetch position data.
         * @returns The mqtt client connected to Flespi
         */
        $getPositionData(): MqttClient
    }
}

declare module "@nuxt/types" {
    interface NuxtAppOptions {
        /**
         * Connects to Flespi client and fetch position data.
         * @returns The mqtt client connected to Flespi
         */
        $getPositionData(): MqttClient
    }
    interface Context {
        /**
         * Connects to Flespi client and fetch position data.
         * @returns The mqtt client connected to Flespi
         */
        $getPositionData(): MqttClient
    }
}

declare module "vuex/types/index" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Store<S> {
        /**
         * Connects to Flespi client and fetch position data.
         * @returns The mqtt client connected to Flespi
         */
        $getPositionData(): MqttClient
    }
}

/**
 * EventBus to transmit data to component.
 */
export const eventBus = new Vue(); // creating an event bus.

/**
 * Position interface to get position data from a tracker
 */
export interface Position {
    altitude: number,
    direction: number,
    hdop: number,
    latitude: number,
    longitude: number,
    pdop: number,
    satellites: number,
    speed: number,
    valid: boolean
}

/**
 * Creates the MqttClient to connect with Flespi
 *
 * @returns the connected client
 */
function createClient (): MqttClient {
    // Token used to connect to Flespi
    const token = process.env.FLESPI_KEY; // TODO : Handle when the key isn't there

    // Creating and connecting Flespi client
    const client: MqttClient = connect("wss://mqtt.flespi.io", {
        clientId: process.env.FLESPI_CLIENT_ID,
        // see https://flespi.com/kb/tokens-access-keys-to-flespi-platform to read about flespi tokens
        username: "FlespiToken " + token,
        protocolVersion: 5,
        clean: true
    });

    // Starting setup of the client

    // When the client is connected, we subscribe to the telemetry topic
    client.on("connect", () => {
        /*
         * Subscribe to the telemetry topic
         * Alfa 03 : flespi/state/gw/devices/4527117/telemetry/#
         * Alfa 01 : flespi/state/gw/devices/4530445/telemetry/#
         */
        client.subscribe("flespi/state/gw/devices/4530445/telemetry/#", { qos: 1 }, (err: Error) => {
            if (err) {
                client.end(true); // force disconnect
            }
        });
    });

    // emits new coordinates whenever the subscription receives new data
    client.on("message", (topic: string, msg: Buffer) => {
        // topic as received is : flespi/state/gw/devices/4530445/telemetry/<informationName>
        const splitTopic: string[] = topic.split("/");
        const informationName: string = splitTopic[splitTopic.length - 1];

        if (informationName === "position") {
            emitNewCoordinates(convertToObject(msg.toString("utf8")));
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
 * Mqtt method plugin
 */
const mqttPlugin: Plugin = (_context: Context, inject: Inject) => {
    inject("getPositionData", () => {
        return createClient();
    });
};

export default mqttPlugin;
