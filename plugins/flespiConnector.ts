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
export interface Channel {
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
        $getPositionData(client: MqttClient, channels: Channel[]): MqttClient
        $getChannelList(): Promise<Channel[]>
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
        $getChannelList(): Promise<Channel[]>
    }
    interface Context {
        /**
         * Connects to Flespi client and fetch position data.
         * @returns The mqtt client connected to Flespi
         */
        $initiateClient(): MqttClient
        $getPositionData(client: MqttClient, channels: Channel[]): MqttClient
        $getChannelList(): Promise<Channel[]>
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
        $getChannelList(): Promise<Channel[]>
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
function setupClient (client: MqttClient, channels: Channel[]): MqttClient {
    // When the client is connected, we subscribe to the telemetry topic
    client.on("connect", () => {
        channels.forEach((channel: Channel) => {
             //client.subscribe("flespi/message/gw/channels/" + channel.id + "/+", { qos: 1 }, (err: Error) => {
             client.subscribe("flespi/message/gw/channels/1134425/+", { qos: 1 }, (err: Error) => {
                 console.log(err);
                 if (err) {
                     console.log("testttt");
                     client.end(true); // force disconnect
                 }
             });
        });
    });

    // emits new coordinates whenever the subscription receives new data
    client.on("message", (topic: string, msg: Buffer) => {
        console.log("test");
        console.log(topic, msg.toString("utf8"));
        /* const splitTopic: string[] = topic.split("/");
        const informationName: string = splitTopic[splitTopic.length - 1];
        const deviceID: number = Number(splitTopic[splitTopic.length - 3]); // Get the device ID

        if (informationName === "position") {
            // emitNewCoordinates(convertToObject(msg.toString("utf8"))); // Emit the new position
            console.log("emit new coordinates");
        } */
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
 * Calls Flespi API to get the list of all active channels
 */
async function callAPI (): Promise<Channel[]> {
    // Token needed to authenticate in Flespi
    const token: string = "FlespiToken " + process.env.FLESPI_KEY;
    const channels: Channel[] = [];

    // Get the data via the API
    const pendingResponse = await fetch(
    "https://flespi.io/gw/channels/all",
    {
            headers: {
                Authorization: token
            }
        }
    );

    const json = await pendingResponse.json();

    for (let i = 0; i < json.result.length; i++) {
        channels.push(json.result[i]);
    }

    return channels;
}

/**
 * Method plugin
 */
const plugin: Plugin = (_context: Context, inject: Inject) => {
    inject("initiateClient", () => {
        return createClient();
    });
    inject("getPositionData", (client: MqttClient, channels: Channel[]) => {
        return setupClient(client, channels);
    });
    inject("getChannelList", () => {
        return callAPI();
    });
};

export default plugin;
