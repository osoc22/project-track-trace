<template>
  <b-button @click="(tracking) ? StopTracking() : StartTracking()">
    <b-icon-pin-map />
    <p>{{ tracking ? "Stop Tracking" : "Track me!" }}</p>
  </b-button>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "PhoneTrackingButton",
  data () {
    return {
      tracking: false,
      watcherId: -1
    };
  },
  methods: {
    StartTracking () {
        this.tracking = true;
        this.watcherId = navigator.geolocation.watchPosition(result => console.log(result));
        console.log("Started tracking");
    },
    StopTracking () {
        this.tracking = false;
        navigator.geolocation.clearWatch(this.watcherId);
        this.watcherId = -1;
        console.log("Stop tracking");
    }
  }
});
</script>
