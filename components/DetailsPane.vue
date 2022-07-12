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
    mounted(){
        this.$root.$on("details", (msg) => {
            if(! this.open){
            document.getElementById("details-toggle").click();
            }
            document.getElementById("details-title").innerText = msg;
            document.getElementById("details-content").innerText = `All information about ${msg} will show up here.`;
        })
        // Todo - fix bug where, upon closing the details sidebar, the open variable is not reset (easy fix with jquery, but trying to avoid it)
        //$("#details").on('hidden.bs.collapse', function(){
        //    this.open = !this.open;
        //})
    }
}
</script>

<template>
  <div id="details-wrapper">
    <b-button v-b-toggle.details id="details-toggle" style="display: none;" @click="open= ! open">
    </b-button>
    <b-sidebar id="details" bg-variant="dark" text-variant="light" right shadow>
        <h2 id="details-title" class="ml-3"></h2>
        <p id="details-content" class="ml-3"></p>
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
