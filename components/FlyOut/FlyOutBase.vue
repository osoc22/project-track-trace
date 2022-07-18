<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "FlyOutBase",
  props: {
      initOpen: {
          type: Boolean,
          default: false
      }
  },
  data () {
      return {
          open: this.initOpen
      };
  }
});
</script>
<template>
  <div id="flyout-wrapper">
    <fly-out-button v-b-toggle.fly-out class="menu-button" :open="open" />
    <b-sidebar
      id="fly-out"
      class="d-flex s"
      shadow
      title="Paradar"
    >
      <slot />
    </b-sidebar>
  </div>
</template>

<style lang="scss" scoped>
.menu-button{
  z-index: 2;
  position: absolute;
  left: 3em;
  top: 1em;
}
.b-side-header{
  width: 100%;
}
</style>
