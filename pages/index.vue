<template>
  <div class="fullscreen">
    <fly-out>
      <phone-tracking-button :client="client" />
      <SearchTrackers />
    </fly-out>
    <DetailsPane />
    <vue-layer-map :initial-zoom="zoom" :initial-center="center">
      <template #features>
        <vue-layer-marker v-for="position in positions" :key="position.id" :coordinates="[position.longitude, position.latitude]" />
        <vue-layer-marker v-for="pos in positions" :key="pos.trackerId" :coordinates="[pos.longitude, pos.latitude]" />
      </template>
    </vue-layer-map>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PropType } from "vue/types/v3-component-props";
import VueLayerMarker from "~/components/VueLayerMarker.vue";
import FlyOut from "~/components/FlyOut.vue";
import DetailsPane from "~/components/DetailsPane.vue";
import { eventBus } from "~/plugins/flespiConnector";

interface PositionData {
  id: string,
  latitude: number,
  longitude: number
}

export default Vue.extend({
  name: "IndexPage",
  components: { VueLayerMarker, FlyOut, DetailsPane },
  props: {
    dummyPositions: { // dummy data, to be OVERWRITTEN once we receive data from our client
      type: Array as PropType<Array<PositionData>>,
      default: () => [
        { trackerId: "BXL001", latitude: 50.8476, longitude: 4.3572 },
        { trackerId: "ANT001", latitude: 51.2213, longitude: 4.4051 },
        { trackerId: "TURN001", latitude: 51.3217, longitude: 4.9376 }]
    }
  },
  data () {
    return {
      positions: [] as Array<PositionData>,
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
    eventBus.$on("newCoordinates", (data: PositionData) => {
      const currentData = this.positions.filter(pos => pos.id === data.id);
      if (currentData.length > 0) {
        this.positions[this.positions.indexOf(currentData[0])] = data;
      } else {
        this.positions.push(data);
      }
      console.log(this.positions);
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
