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

export interface LocationData {
    ident: string,
    timestamp: number,
    "position.longitude": number,
    "position.latitude": number,
    "position.altitude": number | null
}

export interface Device {
}

export interface PositionData {
    id: string,
    latitude: number,
    longitude: number
}

/**
 * A Flespi channel
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

        /**
         * Calls Flespi API to get the list of all active channels
         */
        $getChannelList(): Promise<Channel[]>

        /**
         * Calls Flespi API to get the list of all connected devices
         */
        $getAllDevices(): Promise<Device[]>
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

        /**
         * Calls Flespi API to get the list of all active channels
         */
        $getChannelList(): Promise<Channel[]>

        /**
         * Calls Flespi API to get the list of all connected devices
         */
        $getAllDevices(): Promise<Device[]>
        $handleUpdatedPosition(client: MqttClient, result: GeolocationPosition): void
    }
    interface Context {
        /**
         * Connects to Flespi client and fetch position data.
         * @returns The mqtt client connected to Flespi
         */
        $initiateClient(): MqttClient
        $getPositionData(client: MqttClient, channels: Channel[]): MqttClient

        /**
         * Calls Flespi API to get the list of all active channels
         */
        $getChannelList(): Promise<Channel[]>

        /**
         * Calls Flespi API to get the list of all connected devices
         */
        $getAllDevices(): Promise<Device[]>
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

        /**
         * Calls Flespi API to get the list of all active channels
         */
        $getChannelList(): Promise<Channel[]>

        /**
         * Calls Flespi API to get the list of all connected devices
         */
        $getAllDevices(): Promise<Device[]>
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
    return connect("wss://mqtt.flespi.io", {
        clientId: generateRandomId(10),
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
        console.log("connected");
        channels.forEach((channel: Channel) => {
            client.subscribe("flespi/message/gw/channels/" + channel.id + "/+", { qos: 1 }, (err: Error) => {
                if (err) {
                    client.end(true); // force disconnect
                }
            });
        });
    });

    // emits new coordinates whenever the subscription receives new data
    client.on("message", (topic: string, msg: Buffer) => {
        const splitTopic: string[] = topic.split("/");
        const locationId: string = splitTopic[splitTopic.length - 1];
        const data = JSON.parse(msg.toString("utf-8"));
        emitNewCoordinates(locationId, {
            latitude: data["position.latitude"],
            longitude: data["position.longitude"]
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
function emitNewCoordinates (id: string, position: Position): void {
    eventBus.$emit("newCoordinates", { id, ...position });
}

// TODO : duplicate code (see getAllDevices())
/**
 * Calls Flespi API to get the list of all active channels
 */
async function getAllChannels (): Promise<Channel[]> {
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
 * Calls Flespi API to get the list of all connected devices
 */
async function getAllDevices (): Promise<Device[]> {
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
    console.log(devices);
    return devices;
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
    inject("getChannelList", getAllChannels);
    inject("getAllDevices", getAllDevices);
    inject("handleUpdatedPosition", handleNewPosition);
};

export default plugin;
