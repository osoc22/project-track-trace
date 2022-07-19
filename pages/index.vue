<template>
  <div class="fullscreen">
    <fly-out>
      <phone-tracking-button :client="client" />
      <SearchTrackers />
    </fly-out>
    <DetailsPane />
    <vue-layer-map :initial-zoom="zoom" :initial-center="[longitude, latitude]">
      <template #features>
        <vue-layer-marker :coordinates="[longitude, latitude]" />
      </template>
    </vue-layer-map>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VueLayerMarker from "~/components/VueLayerMarker.vue";
import FlyOut from "~/components/FlyOut.vue";
import DetailsPane from "~/components/DetailsPane.vue";
import { eventBus } from "~/plugins/flespiConnector";

export default Vue.extend({
  name: "IndexPage",
  components: { VueLayerMarker, FlyOut, DetailsPane },
  data () {
    return {
      longitude: 4,
      latitude: 51,
      zoom: 6,
      client: this.$initiateClient() // Initiate the client
    };
  },
  async fetch () {
    // Gets the list of channels on which we will subscribe to get trackers data
    const channels = await this.$getChannelList();
    this.client = this.$getPositionData(this.client, channels); // Get the GPS data
  },
  fetchOnServer: false,
  created () {
    eventBus.$on("newCoordinates", (data: number[]) => {
      this.longitude = data[0];
      this.latitude = data[1];
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
