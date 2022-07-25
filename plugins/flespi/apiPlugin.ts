import { Context, Plugin } from "@nuxt/types";
import { Inject } from "@nuxt/types/app";

/// Modules declaration
declare module "vue/types/vue" {
    interface Vue {
        /**
         * Calls Flespi API to get the list of all connected devices
         */
        $getDeviceList(): Promise<Device[]>
    }
}

/**
 * Calls Flespi API to get the list of all connected devices
 */
async function getDeviceList (): Promise<Device[]> {
    // Token needed to authenticate in Flespi
    const token: string = "FlespiToken " + process.env.FLESPI_KEY;
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

    return json.result.map((device: any) => ({
        name: device.name,
        id: device.configuration.ident
    }));
}

/**
 * Method plugin
 */
const plugin: Plugin = (_context: Context, inject: Inject) => {
    inject("getDeviceList", getDeviceList);
};

export default plugin;
