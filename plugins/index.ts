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

function emitNewCoordinates (topic: string, content: string): void {
    let longitude: number = 0;
    let latitude: number = 0;

    const splitTopic: string[] = topic.split("/");
    const informationName: string = splitTopic[splitTopic.length - 1];

    if (informationName === "position.longitude") {
        longitude = Number(content);
    } else if (informationName === "position.latitude") {
        latitude = Number(content);
    }

    eventBus.$emit("newCoordinates", [longitude, latitude]);
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
            // Subscribe to the telemetry topic
            client.subscribe("flespi/state/gw/devices/4530445/telemetry/#", { qos: 1 }, (err) => {
                if (err) {
                    // TODO : handle in a correct way
                }
            });
        });

        // emits new coordinates whenever the subscription receives new data
        client.on("message", (topic, msg) => {
            emitNewCoordinates(topic, msg.toString("utf8"));
        });

        client.on("close", () => { }); // TODO : handle in a correct way

        client.on("error", (err) => { // TODO : handle in a correct way
            client.end(true); // force disconnect
        });
    });
};

export default indexPlugin;
