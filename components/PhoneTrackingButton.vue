<!-- REMOVE THIS ONCE THE MARKERS ARE IMPLEMENTED! -->
<!-- eslint-disable no-console -->
<template>
  <b-button @click="tracking ? StopTracking() : StartTracking()">
    <b-icon-pin-map />
    <p>{{ tracking ? "Stop Tracking" : "Track me!" }}</p>
  </b-button>
</template>

<script lang="ts">
import Vue from "vue";
import { MqttClient } from "mqtt";

export default Vue.extend({
  name: "PhoneTrackingButton",
  props: {
    client: {
      type: MqttClient,
      required: true
    }
  },
  data () {
    return {
      tracking: false,
      watcherId: -1
    };
  },
  beforeDestroy () {
    this.StopTracking();
    this.client.end(true);
  },
  methods: {
    StartTracking () {
      this.tracking = true;
      console.log("Starting tracker...");
      this.watcherId = navigator.geolocation.watchPosition((result) => {
        this.$handleUpdatedPosition(this.client, result);
      });
    },
    StopTracking () {
      this.tracking = false;
      console.log("Stopping tracker...");
      navigator.geolocation.clearWatch(this.watcherId);
      this.watcherId = -1;
    }
  }
});
</script>
