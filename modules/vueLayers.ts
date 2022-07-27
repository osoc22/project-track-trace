import { Module } from "@nuxt/types";
// Adding vuelayers css (ref: https://nuxtjs.org/docs/directory-structure/modules)

const vueLayers: Module = function () {
    this.options.css.push("vuelayers/dist/vuelayers.css");
};

export default vueLayers;
