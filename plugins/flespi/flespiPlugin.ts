import { MqttClient } from "mqtt";
import { Context, Plugin } from "@nuxt/types";
import { Inject } from "@nuxt/types/app";
import { createClient } from "~/plugins/flespi/mqttPlugin";
import { getDeviceList } from "~/plugins/flespi/apiPlugin";
import { handleNewPosition } from "~/plugins/flespi/positionDataPlugin";

/// Modules declaration
declare module "vue/types/vue" {
    interface Vue {
        /**
         * Connects to Flespi client and fetch position data.
         * @returns The mqtt client connected to Flespi
         */
        $initiateClient(): MqttClient
        /**
         * Gets the list of all connected Flespi devices
         * @returns list of all connected Flespi devices
         */
        $getDeviceList(): Promise<Device[]>
        /**
         * Sends new locationdata from the client device to Flespi
         * @param client - the MqttClient used to send data
         * @param result - the new location of the client device
         */
        $handleUpdatedPosition(client: MqttClient, result: GeolocationPosition): void
    }
}

/**
 * Method plugin (ref: https://nuxtjs.org/docs/directory-structure/plugins/)
 */
const plugin: Plugin = (_context: Context, inject: Inject) => {
    inject("initiateClient", createClient);
    inject("getDeviceList", getDeviceList);
    inject("handleUpdatedPosition", handleNewPosition);
};

export default plugin;
