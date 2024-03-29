<template>
  <div class="fullscreen">
    <dual-fly-out class="menu">
      <template #primary>
        <div class="d-flex flex-column align-items-start container">
          <phone-tracking-button class="my-1 w-100" :client="client" />
          <!-- <fly-out-button v-b-toggle.secondary-panel /> -->
          <tracked-asset-card
            v-for="position in positions"
            :key="position.id"
            :position="position"
            :device="devices.find(device => device.id === position.id)"
          />
        </div>
      </template>
      <template #secondary>
        <div class="d-flex flex-column align-items-end container">
          <p>test</p>
        </div>
      </template>
    </dual-fly-out>
    <vue-layer-map :initial-zoom="zoom" :initial-center="center">
      <template #features>
        <vue-layer-marker
          v-for="position in positions"
          :key="position.id"
          :coordinates="[position.longitude, position.latitude]"
          :details="position"
          :src="position.id.includes('sp_') ? '/phone.png' : '/marker.png'"
          :select-src="position.id.includes('sp_') ? '/phone-selected.png' : '/marker-selected.png'"
          :scale="0.15"
          :anchor="position.id.includes('sp_') ? [0.5, 0.75] : [0.5, 0.75]"
          :device="devices.find(device => device.id === position.id)"
        />
        <vue-layer-marker-popup />
      </template>
    </vue-layer-map>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VueLayerMarker from "~/components/VueLayers/VueLayerMarker.vue";
import VueLayerMarkerPopup from "~/components/VueLayers/VueLayerMarkerPopup.vue";
import DualFlyOut from "~/components/FlyOut/DualFlyOut.vue";
import TrackedAssetCard from "~/components/TrackedAssetCard.vue";
import { eventBus } from "~/plugins/utils";

export default Vue.extend({
  name: "IndexPage",
  components: { TrackedAssetCard, VueLayerMarker, DualFlyOut, VueLayerMarkerPopup },
  data () {
    return {
      positions: [] as Array<Position>, // Details about the tracked devices
      zoom: 6,
      client: this.$initiateClient(), // Initiate the client
      center: [4.3572, 50.8476],
      devices: [] as Array<Device> // List of connected named devices
    };
  },
  async fetch () {
    // Gets the list of devices from flespi
    this.devices = await this.$getDeviceList();
  },
  fetchOnServer: false,
  created () {
    // When new Position data is received, store it in the positions array
    eventBus.$on("newCoordinates", (data: Position) => {
      const currentData = this.positions.filter(pos => pos.id === data.id);
      // check if this id already exists and update, else push
      if (currentData.length > 0) {
        this.positions[this.positions.indexOf(currentData[0])] = data;
      } else {
        this.positions.push(data);
      }
    });

    /**
     * Remove tracker when it doesn't send data for too long (max 120 seconds)
     * Calls this function every minute,
     * and removes tracker if it hasn't send any new data for more than a minute
     */
    setInterval(() => {
      this.positions.forEach((position, index) => {
        if (Math.abs(position.timestamp - Date.now() / 1000) >= 60) {
          const removedElement = this.positions.splice(index, 1)[0];
          eventBus.$emit("removedMarker", (removedElement.id));
        }
      });
    }, 60000);
  },
  // disconnects client when application is closed
  beforeDestroy () {
    this.client.end(true);
  }
});
</script>

<style lang="scss">
/*
    * This works to make the map responsive,
    * but this might be best to port this to the layout folder (https://nuxtjs.org/docs/concepts/views#custom-layout)
    * But, I can't seem to get to get multiple layout working *just* yet.
    *
    * TODO: Export html & body styling to layout component
    */
html,
body,
#__nuxt,
#__layout,
.fullscreen {
  height: 100%;
  width: 100%;
}
</style>
