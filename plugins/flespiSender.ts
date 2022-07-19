import { connect, MqttClient } from "mqtt";
import { Context, Plugin } from "@nuxt/types";
import { Inject } from "@nuxt/types/app";

declare module "vue/types/vue" {
    interface Vue {
        /**
         * Connects to Flespi client and setup location handler.
         * @returns the location handler that sends new location data to flespi
         */
        $setupLocationHandler(): (result: GeolocationPosition) => void
    }
}

declare module "@nuxt/types" {
    interface NuxtAppOptions {
        /**
         * Connects to Flespi client and setup location handler.
         * @returns the location handler that sends new location data to flespi
         */
        $setupLocationHandler(): (result: GeolocationPosition) => void
    }
    interface Context {
        /**
         * Connects to Flespi client and setup location handler.
         * @returns the location handler that sends new location data to flespi
         */
        $setupLocationHandler(): (result: GeolocationPosition) => void
    }
}

declare module "vuex/types/index" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Store<S> {
        /**
         * Connects to Flespi client and setup location handler.
         * @returns the location handler that sends new location data to flespi
         */
        $setupLocationHandler(): (result: GeolocationPosition) => void
    }
}

/**
 * LocationData interface to send location data to flespi
 */
export interface LocationData {
    ident: string,
    timestamp: number,
    "position.longitude": number,
    "position.latitude": number,
    "position.altitude": number | null
}

/**
 * Connects to Flespi client and setup location handler.
 * @returns the location handler that sends new location data to flespi
 */
function setupClient(): (result: GeolocationPosition) => void {
    // Token used to connect to Flespi
    const token = process.env.FLESPI_KEY;
    const device_id = generateRandomId(10);

    // Creating and connecting Flespi client
    const client: MqttClient = connect("wss://mqtt.flespi.io", {
        clientId: device_id,
        // see https://flespi.com/kb/tokens-access-keys-to-flespi-platform to read about flespi tokens
        username: "FlespiToken " + token,
        protocolVersion: 5,
        clean: true
    });

    /**
     * Sends new location data to flespi
     * @param result the new Location data that should be send to flespi
     */
    function handleNewPosition(result: GeolocationPosition): void {
        const data = {
            ident: device_id,
            timestamp: result.timestamp / 1000,
            "position.latitude": result.coords.latitude,
            "position.longitude": result.coords.longitude,
            "position.altitude": result.coords.altitude
        };
        sendLocationData(client, data);
    }

    return handleNewPosition;
}

/**
 * Sends data to flespi
 * @param client the MqttClient that will send the data to flespi
 * @param data the data that will be sent to flespi
 */
function sendLocationData(client: MqttClient, data: LocationData): void {
    client.publish("paradar/smartphone", JSON.stringify(data), { qos: 0 });
}

function generateRandomId(length: number): string {
    return '_' + Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Mqtt method plugin
 */
const mqttPlugin: Plugin = (_context: Context, inject: Inject) => {
    inject("setupLocationHandler", () => {
        return setupClient();
    });
};

export default mqttPlugin;