<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "DualFlyOut",
  props: {
    primaryVisibility: {
      type: Boolean,
      default: false
    },
    secondaryVisibility: {
      type: Boolean,
      default: false
    }
  },
  emits: ["primaryChange", "secondaryChange"],
  data () {
      return {
          primaryOpen: this.primaryVisibility,
          secondaryOpen: this.secondaryVisibility
      };
  },
  methods: {
    handlePrimaryPanel (opened:boolean) {
      if (this.secondaryOpen && opened) {
        this.secondaryOpen = false;
      }
      this.primaryOpen = opened;
      this.$emit("primaryChange", opened);
    },
    handleSecondaryPanel (opened:boolean) {
      if (this.primaryOpen && opened) {
        this.primaryOpen = false;
      }
      this.secondaryOpen = opened;
      this.$emit("secondaryChange", opened);
    }
  }
});
</script>
<template>
  <div id="flyout-wrapper">
    <fly-out-button v-b-toggle.primary-panel class="menu-button" />
    <b-sidebar
      id="primary-panel"
      ref="primaryPanel"
      class="d-flex"
      shadow
      title="Paradar"
      header-class="w-100"
      :visible="primaryOpen"
      @change="(event) => handlePrimaryPanel(event)"
    >
      <slot name="primary" />
    </b-sidebar>
    <b-sidebar
      id="secondary-panel"
      ref="secondaryPanel"
      class="d-flex"
      shadow
      right
      header-class="w-100"
      :visible="secondaryOpen"
      @change="(event) => handleSecondaryPanel(event)"
    >
      <slot name="secondary" />
    </b-sidebar>
  </div>
</template>

<style lang="scss" scoped>
.menu-button{
  z-index: 2;
  position: absolute;
  left: 3em;
  top: 1em;
}
</style>
