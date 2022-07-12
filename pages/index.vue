<template>
  <vue-layer-map />
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "IndexPage"
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
html, body, #__nuxt, #__layout{
    height: 100%;
    width: 100%;
}
</style>
