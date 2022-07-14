import { connect, MqttClient } from "mqtt";
import { Plugin } from "@nuxt/types";
import Vue from "vue";

declare module "vue/types/vue" {
    interface Vue {
        /**
         * Connects to Flespi client and fetch position data.
         * @returns void
         */
        $getPositionData(): void
    }
}

declare module "@nuxt/types" {
    interface NuxtAppOptions {
        $getPositionData(): void
    }
    interface Context {
        $getPositionData(): void
    }
}

declare module "vuex/types/index" {
    interface Store<S> {
        $getPositionData(): void
    }
}

/**
 * EventBus to transmit data to component.
 */
export const eventBus = new Vue(); // creating an event bus.

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
 * Emits the new coordinates to the parent component
 */
function emitNewCoordinates (position: Position): void {
    eventBus.$emit("newCoordinates", [position.longitude, position.latitude]);
}

/**
 * Convert the position string to an actual object
 */
function convertToObject (json: string): Position {
    return JSON.parse(json);
}

const indexPlugin: Plugin = (context, inject) => {
    inject("getPositionData", () => {
        // Token used to connect to Flespi
        const token = process.env.FLESPI_KEY || "not found"; // TODO : Handle when the key isn't there

        if (token.length !== 64) { return; }

        // Creating and connecting Flespi client
        const client: MqttClient = connect("wss://mqtt.flespi.io", {
            clientId: process.env.FLESPI_CLIENT_ID,
            // see https://flespi.com/kb/tokens-access-keys-to-flespi-platform to read about flespi tokens
            username: "FlespiToken " + token,
            protocolVersion: 5,
            clean: true
        });

        /*
         * TODO : we should be able to see all trackers and not only one
         * When the client is connected, we subscribe to the telemetry topic
         */
        client.on("connect", () => {
            /*
             * Subscribe to the telemetry topic
             * Alfa 03 : flespi/state/gw/devices/4530445/telemetry/#
             * Alfa 01 : flespi/state/gw/devices/4527117/telemetry/#
             */
            client.subscribe("flespi/state/gw/devices/4530445/telemetry/#", { qos: 1 }, (err) => {
                if (err) {
                    // TODO : handle in a correct way
                }
            });
        });

        // emits new coordinates whenever the subscription receives new data
        client.on("message", (topic, msg) => {
            // topic as received is : flespi/state/gw/devices/4530445/telemetry/<informationName>
            const splitTopic: string[] = topic.split("/");
            const informationName: string = splitTopic[splitTopic.length - 1];

            if (informationName === "position") {
                emitNewCoordinates(convertToObject(msg.toString("utf8")));
            }
        });

        client.on("close", () => { }); // TODO : handle in a correct way

        client.on("error", (err) => { // TODO : handle in a correct way
            client.end(true); // force disconnect
        });
    });
};

export default indexPlugin;
