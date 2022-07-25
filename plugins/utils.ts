import { Context, Plugin } from "@nuxt/types";
import { Inject } from "@nuxt/types/app";

/// Modules declaration
declare module "vue/types/vue" {
    interface Vue {
        $getDeviceName(device: Device): string
        $getDeviceId(position: Position): string
    }
}

declare module "@nuxt/types" {
    interface NuxtAppOptions {
        $getDeviceName(device: Device): string
        $getDeviceId(device: Device): string
    }
    interface Context {
        $getDeviceName(device: Device): string
        $getDeviceId(position: Position): string
    }
}

declare module "vuex/types/index" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Store<S> {
        $getDeviceName(device: Device): string
        $getDeviceId(position: Position): string
    }
}

function getDeviceName (device: Device): string {
    return device === undefined ? "Smartphone" : device.name;
}

function getDeviceId (position: Position): string {
    return position === undefined ? "Smartphone" : position.id;
}

/**
 * Method plugin
 */
const plugin: Plugin = (_context: Context, inject: Inject) => {
    inject("getDeviceName", getDeviceName);
    inject("getDeviceId", getDeviceId);
};

export default plugin;
