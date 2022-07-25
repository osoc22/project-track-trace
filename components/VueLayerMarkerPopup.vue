<template>
  <div v-if="display">
    <vl-overlay :position="position">
      <div class="overlay-content">
        <h6 v-for="(item, index) in details" :key="index" class="ml-2 mr-2">
          {{ index }}
          <p class="lead">
            {{ item }}
          </p>
        </h6>
        <!-- <button type="button" class="btn btn-link" @click="toggleDetails">
          Details
        </button> -->
      </div>
    </vl-overlay>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "VueLayerMarkerPopup",
    props: {
        initPosition: {
            type: Array,
            default: () => [0, 0]
        },
        initDisplay: {
            type: Boolean,
            default: false
        },
        initDetails: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            display: this.initDisplay,
            // WARNING: this position is regular long/lat (°N °E) BE SURE TO CONVERT
            position: this.initPosition,
            details: this.initDetails
        };
    },
    mounted () {
        this.$root.$on("popup-toggled", (coordinates : Array<number>, details : Object) => {
            this.display = true;
            this.position = coordinates;
            this.details = details;
      });
      this.$root.$on("popup-hide", () => {
        this.display = false;
        this.position = [0, 0];
      });
    },
    methods: {
      toggleDetails () {
        console.log("toggling details");
      }
    }
});
</script>

<style lang="scss" scoped>
    .overlay-content {
        background: #fff;
        box-shadow: 5px 5px 5px rgb(2 2 2 / 50%);
        max-height: 225px;
        max-width: 150px;
        overflow: auto;
    }

    .lead{
        font-size: 16px;
        margin-bottom: 0;
    }

    .btn:focus,.btn:active{
      outline: none;
      box-shadow: none;
    }
</style>
