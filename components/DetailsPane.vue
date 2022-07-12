<script>
export default {
    props: {
        InitOpen: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            open: this.InitOpen
        };
    },
}
</script>

<template>
  <div id="details-wrapper">
    <b-button v-b-toggle.details id="details-toggle" class="shadow-none" squared @click="open= ! open">
    X
    </b-button>
    <b-sidebar id="details" bg-variant="dark" text-variant="light" no-header right shadow>
      <!-- because of no-header, we need an additional horizontal break-->
      <hr>
      <hr>
    </b-sidebar>
  </div>
</template>

<style>
  #details {
    height: 80%;
    width: 15%;
    margin-top: 5%;
    border-radius: 20px 0 0 20px;
    position: fixed;
    z-index: -1;
  }

  #details-toggle {
    margin-top: 0;
    position: fixed;

    /* needed because of Bootstrap positioning  */
    z-index: 99999;
    background-color: #343a40;

    /* important to overwrite basic bootstrap border  */
    border-radius: 0 7px 7px 0 !important;
  }
</style>
