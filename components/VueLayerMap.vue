<template>
  <client-only>
    <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true" data-projection="EPSG:4326">
      <vl-view ref="vlview" :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation" data-projection="EPSG:4326" />
      <slot name="features" />
      <slot name="overlays" />
      <vl-layer-tile id="osm">
        <vl-source-osm />
      </vl-layer-tile>
      <vl-interaction-select @select="onSelect" @unselect="onDeselect">
        <vl-style>
          <vl-style-icon
            :src="selectIconSrc"
            :scale="scale"
            :anchor="anchor"
          />
        </vl-style>
      </vl-interaction-select>
    </vl-map>
  </client-only>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import View from "ol/View";
import { fromLonLat, toLonLat } from "ol/proj";
import { eventBus } from "~/plugins/utils";

interface Properties {
  device?: Device, // If the name is unknown to Flespi, device will be undefined
  position: Position
}

export default defineComponent({
    name: "VueLayerMap",
    props: {
        initialZoom: {
            type: Number,
            default: 2
        },
        initialCenter: {
            type: Array,
            default: () => [0, 0]
        },
        initialRotation: {
            type: Number,
            default: 0
        },
        selectSrc: {
            type: String,
            default: "/marker-selected.png"
        },
        scale: {
          type: Number,
          default: 0.15
        },
        anchor: {
          type: Array,
          default: () => [0.5, 0.75]
        }
    },
    data () {
        return {
            zoom: this.initialZoom,
            center: this.initialCenter,
            rotation: this.initialRotation,
            selectIconSrc: this.selectSrc
        };
    },
    mounted () {
        // center and zoom in on the clicked marker
        eventBus.$on("centerMapOnTrackedAsset", (position: number[]) => {
            const view: View = (this.$refs.vlview as any).$view;
            view.animate({ center: fromLonLat(position), zoom: 18 });
        });
    },
    methods: {
      /**
       * gets called upon selecting any marker
       * @param e - the 'event' sent, it looks like {type:string, feature: Feature } where feature is a VueLayers feature
       */
      onSelect (e : any) {
        /*
         * WARNING: the object that calls the event is NOT necesarily the correct component for the marker we clicked on
         * due to this behaviour, we cannot just pass this.details. We use the properties stored in the vl-feature of the component
         * that was clicked, and extract the details needed. This might also need updating in the future.
         *
         * We blame this behaviour on VueLayers being quirky.
         */
        const featureProps: Properties = e.feature.getProperties();
        const position = featureProps.position;
        const device = featureProps.device;
        /*
         * set the selectIcon - slower than the onselect triggering, so we see the 'wrong' icon for a 0.5s (+-until zoomed in)
         * BUG - try to figure out a way to hide the selected style until this onselect function is triggered to update the icon
         */
        position.id.includes("sp_") ? this.selectIconSrc = "/phone-selected.png" : this.selectIconSrc = "/marker-selected.png";
        // convert timestamp to readable format
        const timestamp : Date = new Date(position.timestamp * 1000);
        const tsString : string = timestamp.toLocaleString();
        // Get the coordinates in Longitude Latitude format for display
        const markerCoords : Array<number> = e.feature.getGeometry().getCoordinates();
        const lonlat = toLonLat(markerCoords);

        const details = Object.fromEntries(Object.entries({
          ID: position.id,
          Longitude: position.longitude,
          Latitude: position.latitude,
          "Battery Level": position.batteryLevel,
          "Last Received Data": tsString
        }).filter(([_key, value]) => value));
        // if the tracked device is moving display it on popup
        if (position.movementStatus) {
          details.Moving = undefined;
        }
        // smooth zoom into tracker location
        eventBus.$emit("centerMapOnTrackedAsset", lonlat);
        this.$root.$emit("popup-toggled", lonlat, details, position.alarmEvent, device?.name);
      },
      onDeselect () {
        this.$root.$emit("popup-hide");
      }
    }
});
</script>
