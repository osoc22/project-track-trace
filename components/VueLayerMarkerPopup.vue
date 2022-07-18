<template>
  <div v-if="display">
    <vl-overlay :position="pos">
      <div class="overlay-content">
        <h6 v-for="(item, index) in details" :key="index" class="ml-2 mr-2">
          {{ index }}
          <p class="lead">
            {{ item }}
          </p>
        </h6>
      </div>
    </vl-overlay>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "VueLayerMarkerPopup",
    props: {
        initPos: {
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
            pos: this.initPos,
            details: this.initDetails
        };
    },
    mounted () {
        this.$root.$on("popup-toggled", (coordinates : Array<number>, details : Object) => {
            this.display = true;
            this.pos = coordinates;
            this.details = details;
      });
      this.$root.$on("popup-hide", () => {
        this.display = false;
        this.pos = [0, 0];
      });
    }
});
</script>

<style lang="scss" scoped>
    .overlay-content {
        background: #efefef;
        box-shadow: 0 5px 10px rgb(2 2 2 / 20%);
    }

    .lead{
        font-size: 16px;
        margin-bottom: 0;
    }
</style>
