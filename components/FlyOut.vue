<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
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
    <b-button id="flyout-toggle" v-b-toggle.flyout class="shadow-none" squared @click="open= ! open">
      <img v-if="!open" id="menu-closed" src="/svg/burger-menu.svg" width="32" height="32">
      <img v-else id="menu-opened" src="/svg/close-menu.svg" width="32" height="32">
    </b-button>
    <b-sidebar id="flyout" bg-variant="dark" class="d-flex" height="75%" shadow @hidden="open=false">
      <template #header>
        <fly-out-button />
      </template>
      <hr class="flyout-top">
      <slot />
    </b-sidebar>
  </div>
</template>

<style lang="scss">

</style>
