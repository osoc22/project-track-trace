<template>
  <b-button v-b-toggle.flyout class="shadow-none" squared @click="open= ! open">
    <img v-if="!open" src="/svg/burger-menu.svg" width="32" height="32">
    <img v-else src="/svg/close-menu.svg" width="32" height="32">
  </b-button>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    name: "FlyOutButton"
});
</script>
