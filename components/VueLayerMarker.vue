<template>
  <div>
    <vl-interaction-select @select="onSelect" @unselect="onDeselect" />
    <vl-feature :properties="details">
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
        },
        details: { // ToDo - define positionData object like index.vue (or re-use that one by referencing it, somehow)
          type: Object,
          default: () => {}
        }
    },
    emits: ["popup-toggled"],
    data () {
      return {
        iconSrc: this.src
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
        // TODO - properly document in our docs
        /*
         * WARNING: the object that calls the event is NOT necesarily the correct component for the marker we clicked on
         * due to this behaviour, we cannot just pass this.details. We use the properties stored in the vl-feature of the component
         * that was clicked, and extract the details needed. This might also need updating in the future.
         *
         * We blame this behaviour on VueLayers being quirky.
         */
        const f = e.feature.getProperties();
        const details = { id: f.id, longitude: f.longitude, latitude: f.latitude };
        this.$root.$emit("popup-toggled", markerCoords, details);
        /*
         * console.log(this.displayDetails, this.details, this.coordinates);
         * re-transform to avoid disappearing markers
         */
        e.feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
      },
      onDeselect () {
        this.$root.$emit("popup-hide");
      }
    }
});
</script>
