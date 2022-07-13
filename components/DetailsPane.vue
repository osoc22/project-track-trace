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
          if(!this.open || this.name === name){
            document.getElementById("details-toggle").click();
          }
          this.details = trackerDetails;
          this.name = name;
        })
    },
    methods: {
      onSidebarClose(){
        this.open=false;
        this.$root.$emit('details-toggled');
        this.name='';
      }
    }
}
</script>

<template>
  <div id="details-wrapper">
    <b-button v-b-toggle.details id="details-toggle" style="display: none;" @click="open=!open">
    </b-button>
    <b-sidebar id="details" bg-variant="dark" text-variant="light" right shadow @hidden="onSidebarClose">
      <hr class="flyout-top">
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
