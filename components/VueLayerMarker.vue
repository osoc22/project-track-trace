<template>
  <vl-feature>
    <vl-geom-point :coordinates="coordinates" />
    <vl-style>
      <vl-style-icon
        :src="src"
        :scale="scale"
        :anchor="anchor"
        :anchor-y-units="anchorYMode"
        :anchor-x-mode="anchorXMode"
      />
    </vl-style>
  </vl-feature>
</template>

<script lang="ts">
import { defineComponent } from "vue";

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
          default: () => [0.5, 1]
        },
        anchorYMode: {
          type: String,
          default: "fraction"
        },
        anchorXMode: {
          type: String,
          default: "fraction"
        }
    }
});
</script>
