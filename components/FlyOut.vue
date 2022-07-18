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
    <b-sidebar id="flyout" bg-variant="dark" no-header shadow @hidden="open=false">
      <!-- because of no-header, we need an additional horizontal break-->
      <hr class="flyout-top">
      <slot />
    </b-sidebar>
  </div>
</template>

<style lang="scss">
  $dark-blue: #141f2e;

  #flyout {
    height: 80%;
    width: 15%;
    margin-top: 5%;
    border-radius: 0 20px 20px 0;
    position: fixed;
    z-index: -1;
    background-color: $dark-blue !important;
  }

  .b-sidebar-body{
    display: flex;
    flex-flow: column nowrap;
    gap: 2rem;
  }

  #flyout-toggle {
    margin-top: 5%;
    position: fixed;

    /* needed because of Bootstrap positioning  */
    z-index: 99999;
    background-color: $dark-blue;

    /* important to overwrite basic bootstrap border  */
    border-color: $dark-blue !important;
    border-radius: 0 5px 5px 0 !important;
  }

  hr {
    clear: both;
    visibility: hidden;
  }

  .flyout-top {
    height: 50px;
  }
</style>
