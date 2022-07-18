<template>
  <b-button @click="tracking ? StopTracking() : StartTracking()">
    <b-icon-pin-map />
    <p>{{ tracking ? "Stop Tracking" : "Track me!" }}</p>
  </b-button>
</template>

<script lang="ts">
import Vue from "vue";
import { connect, MqttClient } from "mqtt";

export default Vue.extend({
  name: "PhoneTrackingButton",
  data() {
    return {
      tracking: false,
      watcherId: -1,
    };
  },
  computed: {
    client() {
      const token = process.env.FLESPI_KEY;

      const client = connect("wss://mqtt.flespi.io", {
        clientId: "track-and-trace-2",
        // see https://flespi.com/kb/tokens-access-keys-to-flespi-platform to read about flespi tokens
        username: "FlespiToken " + token,
        protocolVersion: 5,
        clean: true,
      });

      client.on("connect", () => console.log("Connected client..."));
      client.on("disconnect", () => console.log("disconnected client..."));

      return client;
    },
  },
  methods: {
    StartTracking() {
      this.tracking = true;
      console.log("Starting tracker...");
      this.watcherId = navigator.geolocation.watchPosition((result) => {
        const data = {
          ident: "smartphone-tracker",
          timestamp: result.timestamp / 1000,
          "position.latitude": result.coords.latitude,
          "position.longitude": result.coords.longitude,
        };
        console.log(data);
        this.client.publish("paradar/smartphone", JSON.stringify(data), {
          qos: 0,
        });
      });
    },
    StopTracking() {
      this.tracking = false;
      console.log("Stopping tracker...");
      navigator.geolocation.clearWatch(this.watcherId);
      this.client.end(true);
      this.watcherId = -1;
    },
  },
});
</script>
