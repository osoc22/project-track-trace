<script>
export default {
    props: {
        InitOpen: {
            type: Boolean,
            default: false
        },
        InitDetails: {
          type: Object,
          default() {
            return {}
          }
        },
        InitName: {
          type: String,
          default: ""
        }
    },
    data() {
        return {
            open: this.InitOpen,
            details: this.InitDetails,
            name: this.InitName
        };
    },
    mounted(){
        this.$root.$on("details", (name, trackerDetails) => {
          // todo - add check if open & name is the same, we can close the details pane again
          // need to figure out how to overwrite the open=!open from hiding the details
          if(!this.open){
            document.getElementById("details-toggle").click();
          }
          this.details = trackerDetails;
          this.name = name;
        })
    }
}
</script>

<template>
  <div id="details-wrapper">
    <b-button v-b-toggle.details id="details-toggle" style="display: none;" @click="open=!open">
    </b-button>
    <b-sidebar id="details" bg-variant="dark" text-variant="light" right shadow @hidden="open=!open">
        <h2 id="details-title" v-if="this.name" class="ml-3">
          {{ this.name }}
        </h2>
        <h4 v-for="(item, index) in details" :key="index" class="ml-4 mr-1">
          <hr/>
          {{ index }}
          <p class="lead">
            {{ item }}
          </p>
        </h4>
    </b-sidebar>
  </div>
</template>

<style lang="scss">
  #details {
    height: 80%;
    width: 15%;
    margin-top: 5%;
    border-radius: 20px 0 0 20px;
    position: fixed;
  }
</style>
