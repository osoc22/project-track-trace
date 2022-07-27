<template>
  <b-button
    class="d-flex justify-content-center tracking-button"
    @click="tracking ? stopTracking() : startTracking()"
  >
    <b-icon-pin-map />
    <p>{{ tracking ? "Stop Tracking" : "Track me!" }}</p>
  </b-button>
</template>

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
      watcherId: -1 // the Id of the current location watcher, to be able to stop tracking
    };
  },
  beforeDestroy () {
    this.stopTracking();
    this.client.end(true);
  },
  methods: {
    startTracking () {
        // this function gets called every time the device gets a new position
        this.watcherId = navigator.geolocation.watchPosition((result) => {
          if (!this.tracking) {
            // it this is the first message you are sending, you get notified
            this.$bvToast.toast("You are being tracked.", {
              title: "Paradar message",
              autoHideDelay: 3000,
              variant: "danger",
              solid: true,
              toaster: "b-toaster-top-center"
            });
            this.tracking = true;
          }
          // Send location data to Flespi
          this.$handleUpdatedPosition(this.client, result);
        });
    },
    stopTracking () {
        this.tracking = false;
        navigator.geolocation.clearWatch(this.watcherId); // remove the watch function
        this.watcherId = -1;
        // notifies the user
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

<style lang="scss">
@import "../assets/scss/main";
.tracking-button {
  border-radius: 0;
  height: 44px;
  font-size: 20px;
  margin-bottom: 20px !important;

  &:hover {
    color: $paragon-green;
    background: white;
  }
}

.b-toaster-slot * {
  border-radius: 0;
  border: none;
  font-size: 18px;
}
</style>
