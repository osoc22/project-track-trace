import { connect, MqttClient } from "mqtt";
import Vue from "vue";

declare module "vue/types/vue" {
    interface Vue {
        $connectToClient(): void
    }
}

Vue.prototype.$connectToClient =
    () => {
    const token = process.env.FLESPI_KEY || "not found"; // TODO : Handle when the key isn't there

    let longitude: number = 181; // Real life max longitude is 180
    let latitude: number = 91; // Real life max latitude is 90

    if (token.length !== 64) {
        return;
    }

    // Creating and connecting Flespi client
    const client: MqttClient = connect("wss://mqtt.flespi.io", {
        clientId: process.env.FLESPI_CLIENT_ID,
        // see https://flespi.com/kb/tokens-access-keys-to-flespi-platform to read about flespi tokens
        username: "FlespiToken " + token,
        protocolVersion: 5,
        clean: true
    });

    // TODO : we should be able to see all trackers and not only one
    client.on("connect", () => {
        // Subscribe to the telemetry topic
        client.subscribe("flespi/state/gw/devices/4530445/telemetry/#", { qos: 1 }, (err) => {
            if (err) {
                // TODO : handle in a correct way
            }
        });
    });

    client.on("message", (topic, msg) => {
        const splitTopic: string[] = topic.split("/");
        const informationName: string = splitTopic[splitTopic.length - 1];

        if (informationName === "position.longitude") {
            longitude = Number(msg.toString("utf8"));
        } else if (informationName === "position.latitude") {
            latitude = Number(msg.toString("utf8"));
        }
    });

    client.on("close", () => {
        // TODO : handle in a correct way
    });

    client.on("error", (err) => {
        // TODO : handle in a correct way
        client.end(true); // force disconnect
    });
};
