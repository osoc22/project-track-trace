<template>
  <div>
    <vl-interaction-select @select="onSelect" @unselect="onDeselect">
      <vl-style>
        <vl-style-icon
          id="marker"
          :src="selectIconSrc"
          :scale="scale"
          :anchor="anchor"
          :anchor-y-units="anchorYMode"
          :anchor-x-mode="anchorXMode"
        />
      </vl-style>
    </vl-interaction-select>
    <vl-feature :properties="details">
      <vl-geom-point :coordinates="coordinates" />
      <vl-style>
        <vl-style-icon
          id="marker"
          :src="iconSrc"
          :scale="scale"
          :anchor="anchor"
          :anchor-y-units="anchorYMode"
          :anchor-x-mode="anchorXMode"
        />
      </vl-style>
    </vl-feature>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { toLonLat } from "ol/proj";

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
        },
        selectSrc: {
            type: String,
            default: "/marker-selected.png"
        },
        details: { // ToDo - define positionData object like index.vue (or re-use that one by referencing it, somehow)
          type: Object,
          default: () => {}
        }
    },
    emits: ["popup-toggled"],
    data () {
      return {
        iconSrc: this.src,
        selectIconSrc: this.selectSrc
      };
    },
    methods: {
      /**
       * gets called upon selecting any marker
       * @param e - the 'event' sent, it looks like {type:string, feature: Feature } where feature is a VueLayers feature
       */
      onSelect (e : any) {
        /*
         * WARNING: the needed coordinates are regular long/lat (°N °E)
         * BE SURE TO CONVERT
         */
        const markerCoords : Array<number> = e.feature.getGeometry().getCoordinates();
        const lonlat = toLonLat(markerCoords);
        // TODO - properly document in our docs
        /*
         * WARNING: the object that calls the event is NOT necesarily the correct component for the marker we clicked on
         * due to this behaviour, we cannot just pass this.details. We use the properties stored in the vl-feature of the component
         * that was clicked, and extract the details needed. This might also need updating in the future.
         *
         * We blame this behaviour on VueLayers being quirky.
         */
        const f = e.feature.getProperties();
        // convert timestamp to readable format
        const timestamp : Date = new Date(f.timestamp * 1000);
        const tsString : string = timestamp.toLocaleString();
        const details = { id: f.id, longitude: f.longitude, latitude: f.latitude, timestamp: tsString };
        this.$root.$emit("popup-toggled", lonlat, details);
      },
      onDeselect () {
        this.$root.$emit("popup-hide");
      }
    }
});
</script>
