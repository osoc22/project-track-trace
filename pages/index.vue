<template>
  <div class="fullscreen">
    <dual-fly-out class="menu">
      <template #primary>
        <div class="d-flex flex-column align-items-start container">
          <phone-tracking-button class="my-1 w-100" :client="client" />
          <fly-out-button v-b-toggle.secondary-panel />
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
          :scale="pos.id.includes('sp_') ? 0.05 : 0.05"
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

interface PositionData {
  id: string,
  latitude: number,
  longitude: number
}

export default Vue.extend({
  name: "IndexPage",
  components: { VueLayerMarker, DualFlyOut },
  data () {
    return {
      positions: [] as Array<PositionData>,
      zoom: 6,
      client: this.$initiateClient(), // Initiate the client
        center: [4.3572, 50.8476]
    };
  },
  /*
   * async fetch () {
   *  // Gets the list of channels on which we will subscribe to get trackers data
   *  const channels = await this.$getChannelList();
   *  this.client = this.$getPositionData(this.client, channels); // Get the GPS data
   * },
   */
  fetchOnServer: false,
  created () {
    eventBus.$on("newCoordinates", (data: PositionData) => {
      const currentData = this.positions.filter(pos => pos.id === data.id);
      if (currentData.length > 0) {
        this.positions[this.positions.indexOf(currentData[0])] = data;
      } else {
        this.positions.push(data);
      }
    });
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
