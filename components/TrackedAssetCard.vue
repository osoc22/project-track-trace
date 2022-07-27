<template>
  <b-button
    class="d-flex justify-content-center align-items-center"
    @click="centerMap(position)"
  >
    {{
      device === undefined
        ? `Smartphone ${position.id}`
        : `Device ${device.name}`
    }}
  </b-button>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { eventBus } from "~/plugins/utils";

export default defineComponent({
  name: "TrackedAssetCard",
  props: {
    position: {
      type: Object as PropType<Position>,
      required: true
    },
    // eslint-disable-next-line vue/require-default-prop
    device: {
      type: Object as PropType<Device>
    }
  },
  methods: {
    centerMap (position: Position): void {
      eventBus.$emit("centerMapOnTrackedAsset", [
        position.longitude,
        position.latitude
      ]);
    }
  }
});
</script>

<style lang="scss" scoped>
button {
  width: 100%;
  margin-top: 0.5rem;
  font-size: 14px;
  height: 34px;
  border-radius: 0;
  background-color: #9da0a2;
  border-color: #9da0a2;
}
</style>
