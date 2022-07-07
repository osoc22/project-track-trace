import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    modules: [
        /* For more documentation surrounding this, please look at:
            - https://github.com/kevinmarrec/nuxt-pwa-module
            - https://pwa.nuxtjs.org/
        */
        '@kevinmarrec/nuxt-pwa'
    ],
    pwa: {
        workbox: {
            enabled: true
        }
    },
    meta: {
        meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }]
    }
})
