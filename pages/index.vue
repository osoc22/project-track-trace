<template>
  <vue-layer-map :initial-zoom="zoom" :initial-center="[longitude, latitude]">
    <template #features>
      <vue-layer-marker v-for="(value, key) in positions" :key="key" :coordinates="[value.longitude, value.latitude]" />
    </template>
  </vue-layer-map>
</template>

<script lang="ts">
    import Vue from "vue";
    import VueLayerMarker from "~/components/VueLayerMarker.vue";
    import { eventBus, Device, Position } from "~/plugins/flespiConnector";
    import { connect } from "mqtt";

    export default Vue.extend({
        name: "IndexPage",
        components: { VueLayerMarker },
        data () {
            return {
                longitude: 0,
                latitude: 0,
                zoom: 6,
                client: this.$getPositionData([]),
                positions: new Map<Device, Position>()
            };
        },
        async fetch () {
            const devices = await this.$getDeviceList();
            devices.forEach(device => this.positions.set(device, { longitude: 0, latitude: 0 }));
            // this.client = this.$getPositionData(devices);
            this.client = connect("wss://mqtt.flespi.io", {
            clientId: process.env.FLESPI_CLIENT_ID,
                // see https://flespi.com/kb/tokens-access-keys-to-flespi-platform to read about flespi tokens
                username: "FlespiToken " + process.env.FLESPI_KEY,
                protocolVersion: 5,
                clean: true
        });
        },
        created () {
            eventBus.$on("newCoordinates", (data: number[]) => {
                this.longitude = data[0];
                this.latitude = data[1];
            });
        },
        beforeDestroy () {
            this.client.on("close", () => {
                this.client.end(true); // force disconnect
            });

            this.client.on("error", () => {
                this.client.end(true); // force disconnect
            });
        }
    });
</script>

<style lang="scss">
    /*
     * This works to make the map responsive,
     * but this might be best to port this to the layout folder (https://nuxtjs.org/docs/concepts/views#custom-layout)
     * But, I can't seem to get to get multiple layout working *just* yet.
     *
     * TODO : Export html & body styling to layout component
     */
    html,
    body,
    #__nuxt,
    #__layout {
        height: 100%;
        width: 100%;
    }
</style>
