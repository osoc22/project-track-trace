<template>
<<<<<<< HEAD
  <div>
    <FlyOut />
    <DetailsPane />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FlyOut from '~/components/FlyOut.vue'
import DetailsPane from '~/components/DetailsPane.vue'

export default Vue.extend({
    name: "IndexPage",
    components: { FlyOut, DetailsPane }
})
=======
  <vue-layer-map :initial-zoom="6" :initial-center="[4.356998572,50.855996576]">
    <template #features>
      <vue-layer-marker :coordinates="[4.356998572,50.855996576]" />
    </template>
  </vue-layer-map>
</template>

<script lang="ts">
import Vue from "vue";
import VueLayerMarker from "~/components/VueLayerMarker.vue";

export default Vue.extend({
  name: "IndexPage",
  components: { VueLayerMarker }
});
>>>>>>> master
</script>

<style lang="scss">
/*
 * This works to make the map responsive,
 * but this might be best to port this to the layout folder (https://nuxtjs.org/docs/concepts/views#custom-layout)
 * But, I can't seem to get to get multiple layout working *just* yet.
 *
 * TODO: Export html & body styling to layout component
 */
html, body, #__nuxt, #__layout{
    height: 100%;
    width: 100%;
}
</style>
