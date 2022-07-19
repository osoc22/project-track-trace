<template>
  <b-button @click="tracking ? StopTracking() : StartTracking()">
    <b-icon-pin-map />
    <p>{{ tracking ? "Stop Tracking" : "Track me!" }}</p>
  </b-button>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "PhoneTrackingButton",
  data() {
    return {
      tracking: false,
      watcherId: -1,
      locationHandler: this.$setupLocationHandler(),
    };
  },
  methods: {
    StartTracking() {
      this.tracking = true;
      console.log("Starting tracker...");
      this.watcherId = navigator.geolocation.watchPosition(
        this.locationHandler
      );
    },
    StopTracking() {
      this.tracking = false;
      console.log("Stopping tracker...");
      navigator.geolocation.clearWatch(this.watcherId);
      this.watcherId = -1;
    },
  },
});
</script>
