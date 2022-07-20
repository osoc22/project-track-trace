<template>
  <vl-feature>
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
import Vue from "vue";

export default Vue.extend({
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
