<template>
  <vue-layer-map :initial-zoom="zoom" :initial-center="[longitude, latitude]">
    <template #features>
      <vue-layer-marker :coordinates="[longitude, latitude]" />
    </template>
  </vue-layer-map>
</template>

<script lang="ts">
    import Vue from "vue";
    import VueLayerMarker from "~/components/VueLayerMarker.vue";

    export default Vue.extend({
        name: "IndexPage",
        components: { VueLayerMarker },
        data () {
            return {
                longitude: 0,
                latitude: 0,
                zoom: 6
            };
        },
        mounted () {
            this.$connectToClient();
        }
    });
</script>

<style lang="scss">
    /*
     * This works to make the map responsive,
     * but this might be best to port this to the layout folder (https://nuxtjs.org/docs/concepts/views#custom-layout)
     * But, I can't seem to get to get multiple layout working *just* yet.
     *
     * TODO : Export html & body styling to layout component
     */
    html,
    body,
    #__nuxt,
    #__layout {
        height: 100%;
        width: 100%;
    }
</style>
