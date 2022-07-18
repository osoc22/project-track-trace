<template>
  <div v-if="display">
    <vl-overlay :position="coordinates">
      <div style="background: #fff;">
        Popup displayed
      </div>
    </vl-overlay>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "VueLayerMarkerPopup",
    props: {
        initCoordinates: {
            type: Array,
            required: true
        },
        initDisplay: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            display: this.initDisplay,
            coordinates: this.initCoordinates
        };
    },
    mounted () {
        this.$root.$on("popup-toggled", (coordinates : Array<number>) => {
            this.display = true;
            this.coordinates = coordinates;
      });
    }
});
</script>
