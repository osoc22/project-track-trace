<template>
  <b-button class="d-flex justify-content-center" @click="centerMap(position)">
    {{ device === undefined ? `Smartphone ${position.id}` : `Device ${device.name}` }}
  </b-button>
</template>

<script lang="ts">
    import { defineComponent, PropType } from "vue";
    import { eventBus } from "~/plugins/flespiConnector";

    export default defineComponent({
        name: "TrackedAssetCard",
        props: {
            position: {
                type: Object as PropType<Position>,
                required: true
            },
            device: {
                type: Object as PropType<Device>,
                required: true
            }
        },
        methods: {
            centerMap (position: Position): void {
                eventBus.$emit("centerMapOnTrackedAsset", [position.longitude, position.latitude]);
            }
        }
    });
</script>

<style lang="scss" scoped>
.btn {
    width: 100%;
    margin-top: 0.5rem;
}
</style>
