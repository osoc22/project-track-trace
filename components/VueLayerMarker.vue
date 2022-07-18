<template>
  <div>
    <vl-interaction-select @select="onSelect" />
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
  </div>
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
    },
    emits: ["popup-toggled"],
    methods: {
      onSelect (e : any) {
        /*
         * WARNING: the needed coordinates are regular long/lat (°N °E)
         * BE SURE TO CONVERT
         */
        e.feature.getGeometry().transform("EPSG:3857", "EPSG:4326");
        const markerCoords : Array<number> = e.feature.getGeometry().getCoordinates();
        this.$root.$emit("popup-toggled", markerCoords);
      }
    }
});
</script>
