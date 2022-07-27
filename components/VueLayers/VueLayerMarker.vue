<template>
  <div>
    <vl-feature :properties="{details, device}">
      <vl-geom-point :coordinates="position" />
      <vl-style>
        <vl-style-icon
          :src="iconSrc"
          :scale="scale"
          :anchor="anchor"
        />
      </vl-style>
    </vl-feature>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { eventBus } from "~/plugins/utils";

export default defineComponent({
    name: "VueLayerMarker",
    props: {
        coordinates: {
            type: Array,
            default: () => [0, 0]
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
          default: () => [0.5, 0.75]
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
        position: this.coordinates
      };
    },
    mounted () {
      /**
       * when any coordinates are updated, we check if the updated data is linked to the current marker.
       * If it is, and we're displaying the popup, we also need to update its location.
       * This happens faster than receiving the new location through our v-for loop in the Index
       */
      eventBus.$on("newCoordinates", (data: Position) => {
        if (this.details) {
          if (this.details.id === data.id) {
            this.position = [data.longitude, data.latitude];
          }
        }
      });
    }
});
</script>
