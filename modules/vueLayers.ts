import { Module } from "@nuxt/types";

const vueLayers: Module = function () {
    this.options.css.push("vuelayers/dist/vuelayers.css");
};

export default vueLayers;
