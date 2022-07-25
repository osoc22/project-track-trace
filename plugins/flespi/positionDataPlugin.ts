import { MqttClient } from "mqtt";
import { Context, Plugin } from "@nuxt/types";
import { Inject } from "@nuxt/types/app";
import { generateRandomId } from "~/plugins/utils";

/// Modules declaration
declare module "vue/types/vue" {
    interface Vue {
        $handleUpdatedPosition(client: MqttClient, result: GeolocationPosition): void
    }
}

declare module "@nuxt/types" {
    interface NuxtAppOptions {
        $handleUpdatedPosition(client: MqttClient, result: GeolocationPosition): void
    }
    interface Context {
        $handleUpdatedPosition(client: MqttClient, result: GeolocationPosition): void
    }
}

declare module "vuex/types/index" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Store<S> {
        $handleUpdatedPosition(client: MqttClient, result: GeolocationPosition): void
    }
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

/**
 * Method plugin
 */
const plugin: Plugin = (_context: Context, inject: Inject) => {
    inject("handleUpdatedPosition", handleNewPosition);
};

export default plugin;
