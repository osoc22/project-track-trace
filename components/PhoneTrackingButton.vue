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
        // Remove the line before when you're implementing this
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.watcherId = navigator.geolocation.watchPosition((result) => { /* Write your function here */ });
    },
    StopTracking () {
        this.tracking = false;
        navigator.geolocation.clearWatch(this.watcherId);
        this.watcherId = -1;
    }
  }
});
</script>

<style lang="scss" scoped>
.btn {
    width: fit-content;
    display: flex;
    flex-flow: row nowrap;
    min-width: max-content;
    gap: 0.5rem;
    p {
        margin: 0;
    }
}
</style>
