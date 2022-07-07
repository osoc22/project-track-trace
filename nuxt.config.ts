import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	modules: [
		/*
		 * For more documentation surrounding this, please look at:
		 *  - https://github.com/kevinmarrec/nuxt-pwa-module
		 *  - https://pwa.nuxtjs.org/
		 */
		"@kevinmarrec/nuxt-pwa"
	],
	pwa: {
		workbox: {
			enabled: true
		},
		icon: {
			source:"./assets/icon.png"
		}
	},
	meta: {
		name: "Paradar",
		author: "Paradar Team",
		description: "Paradar allows you to view and track vital goods and personnel in times of chaos",
		theme_color: "#11A9A1",
		nativeUI: true
	},
	manifest: {
		name: "Paradar Tracking",
		short_name: "Paradar",
		useWebmanifestExtension: "true"
	}
});
