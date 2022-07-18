<template>
  <div v-if="display">
    <vl-overlay :position="pos">
      <div class="overlay-content">
        Alpha 03
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
            // WARNING: this position is regular long/lat (°N °E) BE SURE TO CONVERT
            pos: this.initPos
        };
    },
    mounted () {
        this.$root.$on("popup-toggled", (coordinates : Array<number>) => {
            this.display = true;
            this.pos = coordinates;
      });
    }
});
</script>

<style lang="scss" scoped>
.overlay-content {
    background: #efefef;
    box-shadow: 0 5px 10px rgb(2 2 2 / 20%);
    padding: 10px 20px;
    font-size: 16px;
}
</style>
