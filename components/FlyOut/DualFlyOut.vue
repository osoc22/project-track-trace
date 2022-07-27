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
      secondaryOpen: this.secondaryVisibility,
      windowWidth: 0
    };
  },
  beforeDestroy () {
    window.removeEventListener("resize", this.onResize);
  },
  mounted () {
    this.windowWidth = window.innerWidth;
    window.addEventListener("resize", this.onResize);
  },
  methods: {
    handlePrimaryPanel (opened: boolean) {
      if (this.secondaryOpen && opened && this.windowWidth < 992) {
        this.secondaryOpen = false;
      }
      this.primaryOpen = opened;
      this.$emit("primaryChange", opened);
    },
    handleSecondaryPanel (opened: boolean) {
      if (this.primaryOpen && opened && this.windowWidth < 992) {
        this.primaryOpen = false;
      }
      this.secondaryOpen = opened;
      this.$emit("secondaryChange", opened);
    },
    onResize () {
      this.windowWidth = window.innerWidth;
    }
  }
});
</script>
<template>
  <div id="flyout-wrapper">
    <fly-out-button v-b-toggle.primary-panel class="menu-button" />
    <!--
      Honestly, this width is on par of CSS injecting.
      It works, but it's definitely not meant to do this, but because `width` directly injects into `style`, this can be possible.
    -->
    <b-sidebar
      id="primary-panel"
      ref="primaryPanel"
      class="d-flex reduced-width"
      shadow
      header-class="w-100"
      width="40%; max-width: 320px"
      :visible="primaryOpen"
      @change="(event) => handlePrimaryPanel(event)"
    >
      <img
        src="https://osoc.be/editions/2022/projects/paradar.svg"
        width="50px"
      />
      <div class="title">PARADAR</div>
      <slot name="primary" />
    </b-sidebar>
    <b-sidebar
      id="secondary-panel"
      ref="secondaryPanel"
      class="d-flex reduced-width"
      shadow
      right
      header-class="w-100"
      :visible="secondaryOpen"
      width="40%; max-width: 320px"
      @change="(event) => handleSecondaryPanel(event)"
    >
      <slot name="secondary" />
    </b-sidebar>
  </div>
</template>

<style lang="scss">
@import "../../assets/scss/main";

.b-sidebar-header,
.b-sidebar-body {
  background: $dark-blue;
  color: white;
  text-align: center;

  .title {
    font-size: 30px;
    font-weight: 500;
    margin-bottom: 40px;
  }
}

.b-sidebar-header {
  position: absolute;
  background: transparent;

  button {
    opacity: 1;

    svg {
      color: $paragon-green;
      font-size: 50px;
    }
  }

  .title {
    font-size: 30px;
    font-weight: 500;
    margin-bottom: 40px;
  }
}

.b-sidebar-body {
  padding-top: 3vh;
}

.menu-button {
  z-index: 2;
  position: absolute;
  left: 3em;
  top: 1em;
  border: none;
  border-radius: 0;
  width: 60px;
  height: 45px;
  background: $dark-blue;

  svg {
    color: $paragon-green;
    font-size: 34px !important;
  }
}

@media (max-width: 500px) {
  #primary-panel {
    width: 100%;
  }
}
</style>
