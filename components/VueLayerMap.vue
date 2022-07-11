<template>
    <client-only>
      <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true">
        <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation" />
        <vl-layer-tile id="osm">
          <vl-source-osm />
        </vl-layer-tile>
      </vl-map>
    </client-only>
</template>

<script lang="ts">
    export default {
        name: "VueLayerMap",
        data () {
            return {
                zoom: 2,
                center: [0, 0],
                rotation: 0
            };
        }
    };
</script>
