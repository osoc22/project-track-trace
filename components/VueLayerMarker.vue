<template>
  <vl-feature id="position-feature">
    <vl-geom-point :coordinates="coordinates" />
    <vl-style>
      <vl-style-icon
        :src="src"
        :scale="0.2"
        :anchor="[0.5, 1]"
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
        }
    }
});
</script>
