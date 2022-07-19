<template>
  <div>
    <vl-interaction-select id="interact" @select="onSelect" @unselect="onDeselect" />
    <vl-feature id="position-feature">
      <vl-geom-point :coordinates="coordinates" />
      <vl-style>
        <vl-style-icon
          id="marker"
          :src="iconSrc"
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
    data () {
      return {
        iconSrc: this.src,
        // TODO hardcoded details for now, should be replaced by actual useful data!
        details: {
          name: "Alpha 03",
          id: "4527117",
          attribute: "value",
          hotel: "trivago",
          long: "aaaaaaaaaaaaa",
          longer: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        }
      };
    },
    methods: {
      onSelect (e : any) {
        /*
         * WARNING: the needed coordinates are regular long/lat (°N °E)
         * BE SURE TO CONVERT
         */
        e.feature.getGeometry().transform("EPSG:3857", "EPSG:4326");
        const markerCoords : Array<number> = e.feature.getGeometry().getCoordinates();
        this.$root.$emit("popup-toggled", markerCoords, this.details);
        // re-transform to avoid disappearing markers
        e.feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
      },
      onDeselect () {
        this.$root.$emit("popup-hide");
      }
    }
});
</script>
