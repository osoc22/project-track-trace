<template>
  <div>
    <vl-interaction-select @select="onSelect" @unselect="onDeselect">
      <vl-style>
        <vl-style-icon
          id="marker"
          :src="selectediconSrc"
          :scale="0.2"
          :anchor="[0.5, 1]"
        />
      </vl-style>
    </vl-interaction-select>
    <vl-feature :properties="{details, device}">
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
import { defineComponent, PropType } from "vue";
import { toLonLat } from "ol/proj";

interface Properties {
  device?: Device,
  details: Position
}

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
        selectSrc: {
            type: String,
            default: "/marker.png"
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
        iconSrc: this.src,
        selectediconSrc: this.selectSrc
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
        const featureProps: Properties = e.feature.getProperties();
        const positionInfo = featureProps.details;
        const device = featureProps.device;
        // convert timestamp to readable format
        const timestamp : Date = new Date(positionInfo.timestamp * 1000);
        const tsString : string = timestamp.toLocaleString();
        const details = Object.fromEntries(Object.entries({
          id: positionInfo.id,
          longitude: positionInfo.longitude,
          latitude: positionInfo.latitude,
          "Battery Level": positionInfo.batteryLevel,
          "Last Received Data": tsString
        }).filter(([_key, value]) => value));
        if (positionInfo.movementStatus) {
          details.Moving = undefined;
        }
        this.$root.$emit("popup-toggled", lonlat, details, positionInfo.alarmEvent, device?.name);
      },
      onDeselect () {
        this.$root.$emit("popup-hide");
      }
    }
});
</script>
