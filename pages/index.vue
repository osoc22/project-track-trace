<template>
  <div class="fullscreen">
    <dual-fly-out class="menu">
      <template #primary>
        <div class="d-flex flex-column align-items-start container">
          <phone-tracking-button class="my-1 w-100" />
          <fly-out-button v-b-toggle.secondary-panel />
        </div>
      </template>
      <template #secondary>
        <div class="d-flex flex-column align-items-end container">
          <p>test</p>
        </div>
      </template>
    </dual-fly-out>
    <vue-layer-map :initial-zoom="zoom" :initial-center="[longitude, latitude]">
      <template #features>
        <vue-layer-marker :coordinates="[longitude, latitude]" />
      </template>
    </vue-layer-map>
  </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import VueLayerMarker from "~/components/VueLayerMarker.vue";
    import DualFlyOut from "~/components/FlyOut/DualFlyOut.vue";
    import { eventBus } from "~/plugins/flespiConnector";

    export default defineComponent({
        name: "IndexPage",
        components: { VueLayerMarker, DualFlyOut },
        data () {
            return {
                longitude: 4.3601,
                latitude: 50.5,
                zoom: 8,
                client: this.$getPositionData()
            };
        },
        created () {
            eventBus.$on("newCoordinates", (data: number[]) => {
                this.longitude = data[0];
                this.latitude = data[1];
            });
        },
        beforeDestroy () {
            this.client.on("close", () => {
                this.client.end(true); // force disconnect
            });

            this.client.on("error", () => {
                this.client.end(true); // force disconnect
            });
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
    html, body, #__nuxt, #__layout,.fullscreen {
        height: 100%;
        width: 100%;
    }
</style>
