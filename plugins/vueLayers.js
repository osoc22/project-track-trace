/*
 * The "VueLayers" package doesn't have any types definition,
 * so to avoid enraging the TypeScript gods, we'll leave this as an plain JS file
 */

import Vue from "vue";
import VueLayers, { SelectInteraction } from "vuelayers";
import "vuelayers/dist/vuelayers.css"; // needs css-loader

Vue.use(VueLayers);
Vue.use(SelectInteraction);
