import { NuxtConfig } from "@nuxt/types";

const config: NuxtConfig = {
	// Target: https://go.nuxtjs.dev/config-target
	target: "static",

	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: "Paradar",
		meta: [
			{ charset: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ hid: "description", name: "description", content: "" },
			{ name: "format-detection", content: "telephone=no" }
		],
		link: [
			{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
		]
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [
	],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		{
			src: "@/plugins/vueLayers.js",
			ssr: false
		},
        "~/plugins/flespiConnector.ts"
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/typescript
		"@nuxt/typescript-build",
		// https://go.nuxtjs.dev/stylelint
		"@nuxtjs/stylelint-module",
		// https://www.npmjs.com/package/@nuxtjs/dotenv
		"@nuxtjs/dotenv"
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		// https://go.nuxtjs.dev/bootstrap
		"bootstrap-vue/nuxt",
		// https://go.nuxtjs.dev/pwa
		"@nuxtjs/pwa",
		"~/modules/vueLayers.ts"
	],

	// PWA module configuration: https://go.nuxtjs.dev/pwa
	pwa: {
		meta: {
			name: "Paradar",
			author: "Paradar Team",
			description: "Paradar allows you to view and track vital goods and personnel in times of chaos",
			theme_color: "#11A9A1"
		},
		manifest: {
			name: "Paradar Tracking",
			short_name: "Paradar",
			lang: "en"
		}
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
		extend (config, ctx) {
			if (ctx.isDev) {
				config.devtool = ctx.isClient ? "source-map" : "inline-source-map";
			}
		}
	}
};

export default config;
