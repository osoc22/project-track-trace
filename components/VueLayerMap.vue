<template>
  <client-only>
    <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true" data-projection="EPSG:4326">
      <vl-view ref="vlview" :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation" data-projection="EPSG:4326" />
      <slot name="features" />
      <slot name="overlays" />
      <vl-layer-tile id="osm">
        <vl-source-osm />
      </vl-layer-tile>
    </vl-map>
  </client-only>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import View from "ol/View";
import { fromLonLat } from "ol/proj";
import { eventBus } from "~/plugins/utils";

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
        }
    },
    data () {
        return {
            zoom: this.initialZoom,
            center: this.initialCenter,
            rotation: this.initialRotation
        };
    },
    created () {
        eventBus.$on("centerMapOnTrackedAsset", (position: number[]) => {
            const view: View = (this.$refs.vlview as any).$view;
            view.animate({ center: fromLonLat(position), zoom: 18 });
        });
    }
});
</script>
