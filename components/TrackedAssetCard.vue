<template>
  <b-button @click="centerMap(position)">
    {{ id }}
  </b-button>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import { eventBus } from "~/plugins/flespiConnector";

    export default defineComponent({
        name: "TrackedAssetCard",
        props: {
            position: {
                type: Array,
                required: true
            },
            id: {
                type: String,
                required: true
            }
        },
        methods: {
            centerMap (position: number[]): void {
                eventBus.$emit("centerMapOnTrackedAsset", position);
            }
        }
    });
</script>

<style lang="scss" scoped>
.btn {
    width: fit-content;
    display: flex;
    flex-flow: row nowrap;
    min-width: max-content;
    gap: 0.5rem;
    p {
        margin: 0;
    }
}
</style>
