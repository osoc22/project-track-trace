<script lang="ts">
import SearchTrackers from './SearchTrackers.vue';
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        InitOpen: {
            type: Boolean,
            default: false
        }
    },
    data() : Object {
        return {
            open: this.InitOpen
        };
    },
    components: { SearchTrackers }
})
</script>

<template>
  <div id="flyout-wrapper">
    <b-button v-b-toggle.flyout id="flyout-toggle" class="shadow-none" squared @click="open= ! open">
      <img id="menu-closed" v-if="!open" src="/svg/burger-menu.svg" width="32" height="32">
      <img id="menu-opened" v-else src="/svg/close-menu.svg" width="32" height="32" >
    </b-button>
    <b-sidebar id="flyout" bg-variant="dark" no-header shadow>
      <!-- because of no-header, we need an additional horizontal break-->
      <hr class="flyout-top">
      <SearchTrackers />
    </b-sidebar>
  </div>
</template>

<style>
  #flyout {
    height: 80%;
    width: 15%;
    margin-top: 5%;
    border-radius: 0 20px 20px 0;
    position: fixed;
    z-index: -1;
  }

  #flyout-toggle {
    margin-top: 5%;
    position: fixed;

    /* needed because of Bootstrap positioning  */
    z-index: 99999;
    background-color: #343a40;

    /* important to overwrite basic bootstrap border  */
    border-radius: 0 7px 7px 0 !important;
  }

  .flyout-top {
    clear: both;
    visibility: hidden;
    height: 50px;
  }
</style>
