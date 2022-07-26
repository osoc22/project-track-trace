<template>
  <div>
    <vl-feature :properties="{details, device}">
      <vl-geom-point :coordinates="coordinates" />
      <vl-style>
        <vl-style-icon
          :src="iconSrc"
          :scale="scale"
          :anchor="anchor"
        />
      </vl-style>
    </vl-feature>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
    name: "VueLayerMarker",
    props: {
        coordinates: {
            type: Array,
            required: true
        },
        src: {
            type: String,
            default: "/marker.png"
        },
        scale: {
          type: Number,
          default: 0.2
        },
        anchor: {
          type: Array,
          default: () => [0.5, 0.75]
        },
        details: {
          type: Object as PropType<Position>,
          default: () => {}
        },
        device: {
          type: Object as PropType<Device>,
          default: () => undefined
        }
    },
    emits: ["popup-toggled"],
    data () {
      return {
        iconSrc: this.src
      };
    }
});
</script>
