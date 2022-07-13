<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        initOpen: {
            type: Boolean,
            default: false
        },
        initDetails: {
          type: Object,
          default () {
            return {};
          }
        },
        initName: {
          type: String,
          default: ""
        }
    },
    data () : Object {
        return {
            open: this.initOpen,
            details: this.initDetails,
            name: this.initName
        };
    },
    mounted () {
      /**
       * event triggered on toggling the details window
       * @param name the name of the tracker to show in the details pane
       * @param trackerDetails the tracker details Object (key-value pairs)
       */
        this.$root?.$on("details", (name : string, trackerDetails : Object) => {
          if (!this.open || this.name === name) {
            document.getElementById("details-toggle")?.click();
          }
          this.details = trackerDetails;
          this.name = name;
        });
    },
    methods: {
      /**
       * function called by details pane being hidden
       * emits an event via the root to notify that the details pane has been closed
       */
      onSidebarClose () {
        this.open = false;
        this.$root?.$emit("details-closed");
        this.name = "";
      }
    }
});
</script>

<template>
  <div id="details-wrapper">
    <b-button id="details-toggle" v-b-toggle.details style="display: none;" @click="open=!open" />
    <b-sidebar
      id="details"
      bg-variant="dark"
      text-variant="light"
      right
      shadow
      @hidden="onSidebarClose"
    >
      <hr class="flyout-top">
      <h2 id="details-title" :v-if="name" class="ml-3">
        {{ name }}
      </h2>
      <h4 v-for="(item, index) in details" :key="index" class="ml-4 mr-4">
        <hr>
        {{ index }}
        <p class="lead">
          {{ item }}
        </p>
      </h4>
    </b-sidebar>
  </div>
</template>

<style lang="scss">
  $dark-blue: #141f2e;

  #details {
    height: 80%;
    width: 15%;
    margin-top: 5%;
    border-radius: 20px 0 0 20px;
    position: fixed;
    background-color: $dark-blue !important;
  }
</style>
