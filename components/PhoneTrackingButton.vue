<template>
  <b-button @click="(tracking) ? StopTracking() : StartTracking()">
    <b-icon-pin-map />
    <p>{{ tracking ? "Stop Tracking" : "Track me!" }}</p>
  </b-button>
</template>

<link href="toastr.css" rel="stylesheet"/>
<script src="toastr.js"/>

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
        this.$bvToast.toast("You are being tracked.", {
            title: "Paradar message",
            autoHideDelay: 3000,
            variant: "danger",
            solid: true,
            toaster: "b-toaster-top-center"
        });
    },
    StopTracking () {
        this.tracking = false;
        navigator.geolocation.clearWatch(this.watcherId);
        this.watcherId = -1;
        this.$bvToast.toast("You are not being tracked anymore.", {
            title: "Paradar message",
            autoHideDelay: 3000,
            variant: "success",
            solid: true,
            toaster: "b-toaster-top-center"
        });
    }
  }
});
</script>
