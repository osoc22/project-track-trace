<template>
  <div class="fullscreen">
    <dual-fly-out class="menu">
      <template #primary>
        <div class="d-flex flex-column align-items-start container">
          <phone-tracking-button class="my-1 w-100" :client="client" />
          <!-- <fly-out-button v-b-toggle.secondary-panel /> -->
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
          v-for="pos in positions"
          :key="pos.id"
          :coordinates="[pos.longitude, pos.latitude]"
          :src="pos.id.includes('sp_') ? '/sp_marker.png' : '/teltonika_marker.png'"
          :scale="0.1"
          :anchor="pos.id.includes('sp_') ? [0.5, 0.5] : [0.5, 450]"
          :anchor-y-mode="pos.id.includes('sp_') ? 'fraction' : 'pixels'"
        />
      </template>
    </vue-layer-map>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VueLayerMarker from "~/components/VueLayerMarker.vue";
import DualFlyOut from "~/components/FlyOut/DualFlyOut.vue";
import { eventBus } from "~/plugins/flespiConnector";

export default Vue.extend({
  name: "IndexPage",
  components: { VueLayerMarker, DualFlyOut },
  data () {
    return {
      positions: [] as Array<Position>,
      zoom: 6,
      client: this.$initiateClient(), // Initiate the client
      center: [4.3572, 50.8476],
      devices: [] as Array<Device>
    };
  },
  async fetch () {
    // Gets the list of devices from flespi
    this.devices = await this.$getDeviceList();
    console.log(this.devices);
  },
  fetchOnServer: false,
  created () {
    eventBus.$on("newCoordinates", (data: Position) => {
      const currentData = this.positions.filter(pos => pos.id === data.id);
      if (currentData.length > 0) {
        this.positions[this.positions.indexOf(currentData[0])] = data;
      } else {
        this.positions.push(data);
      }
    });
    setInterval(() => {
      this.positions.forEach((position, index) => {
        if (Math.abs(position.timestamp - Date.now() / 1000) >= 60) {
          this.positions.splice(index, 1);
        }
      });
    }, 60000);
  },
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
