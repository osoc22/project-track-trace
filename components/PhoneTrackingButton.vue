<template>
  <b-button class="d-flex justify-content-center" @click="(tracking) ? StopTracking() : StartTracking()">
    <b-icon-pin-map />
    <p>{{ tracking ? "Stop Tracking" : "Track me!" }}</p>
  </b-button>
</template>

<link href="toastr.css" rel="stylesheet" />
<script src="toastr.js" />

<script lang="ts">
import { defineComponent } from "vue";
import { MqttClient } from "mqtt";

export default defineComponent({
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
        this.watcherId = navigator.geolocation.watchPosition((result) => {
          if (!this.tracking) {
            this.$bvToast.toast("You are being tracked.", {
              title: "Paradar message",
              autoHideDelay: 3000,
              variant: "danger",
              solid: true,
              toaster: "b-toaster-top-center"
            });
            this.tracking = true;
          }
          this.$handleUpdatedPosition(this.client, result);
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

<style lang="scss" scoped>
.btn {
    width: 100%;
    gap: 0.5rem;
    p {
        margin: 0;
    }
}
</style>
