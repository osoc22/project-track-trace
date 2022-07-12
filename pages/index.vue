<template>
  <vue-layer-map :initial-zoom="6" :initial-center="[4.356998572,50.855996576]">
    <template #features>
      <vue-layer-marker :coordinates="[baseCoordinates[0], baseCoordinates[1]]" />
    </template>
  </vue-layer-map>
</template>

<script lang="ts">
    import Vue from "vue";
    import { connect } from "mqtt";
    import VueLayerMarker from "~/components/VueLayerMarker.vue";

    export default Vue.extend({
        name: "IndexPage",
        data () {
            return {
                baseCoordinates: [0, 0]
            };
        },
        components: { VueLayerMarker },
        mounted () {
            connectToClient(this.baseCoordinates);
        }
    });

    // TODO : delete console logs ?
    function connectToClient (reference: Number[]) {
        const token = "cnYrjpRhZhECQVkE6CLiowFuAq7pN2rPed7nsOsfVVFAGN2AfBGuXbMlpKB2AQIC"; // TODO : store securely
        if (token.length !== 64) {
            console.log("please check the token");
            return;
        }
        const client = connect("wss://mqtt.flespi.io", {
            clientId: "track-and-trace",
            // see https://flespi.com/kb/tokens-access-keys-to-flespi-platform to read about flespi tokens
            username: "FlespiToken " + token,
            protocolVersion: 5,
            clean: true
        });

        // TODO : we should be able to see all trackers and not only one
        client.on("connect", () => {
            // Subscribe to the telemetry topic
            client.subscribe("flespi/state/gw/devices/4530445/telemetry/#", { qos: 1 }, (err) => {
                if (err) {
                    console.log("failed to subscribe to topic \"test\":", err);
                    return;
                }
                console.log("subscribed to \"test\"");
            });
        });

        client.on("message", (topic, msg) => {
            filter(topic, msg.toString("utf8"), reference);
        });

        client.on("close", () => {
            console.log("disconnected");
        });

        client.on("error", (err) => {
            console.log("mqtt client error:", err);
            client.end(true); // force disconnect
        });
    }

    /*
     * Filter the data received to keep only the latitude and longitude attributes
     * TODO : adapt to real needs
     */
    function filter (this: any, topic: string, msg: string, ref: Number[]) {
        const splitTopic: string[] = topic.split("/");
        const informationName: string = splitTopic[splitTopic.length - 1];

        if (informationName === "position.longitude") {
            ref[0] = Number(msg);
        } else if (informationName === "position.latitude") {
            ref[1] = Number(msg);
        }
    }
</script>

<style lang="scss">
/*
 * This works to make the map responsive,
 * but this might be best to port this to the layout folder (https://nuxtjs.org/docs/concepts/views#custom-layout)
 * But, I can't seem to get to get multiple layout working *just* yet.
 *
 * TODO: Export html & body styling to layout component
 */
html, body, #__nuxt, #__layout{
    height: 100%;
    width: 100%;
}
</style>
