<!-- REMOVE THIS ONCE THE MARKERS ARE IMPLEMENTED! -->
<!-- eslint-disable no-console -->
<template>
  <b-button class="d-flex justify-content-center" @click="(tracking) ? StopTracking() : StartTracking()">
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
      this.watcherId = navigator.geolocation.watchPosition((result) => {
        this.$handleUpdatedPosition(this.client, result);
      });
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
