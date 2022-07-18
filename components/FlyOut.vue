<script lang="ts">
import { defineComponent } from "vue";
import SearchTrackers from "./SearchTrackers.vue";
import "@fontsource/actor";

export default defineComponent({
  components: { SearchTrackers },
  props: {
    initOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      open: this.initOpen,
    };
  },
});
</script>

<template>
  <nav role="navigation" id="flyout-wrapper">
    <div id="flyout-toggle">
      <input type="checkbox" class="hamburger" />
      <div class="background"></div>
      <span></span>
      <span></span>
      <span></span>
      <ul id="flyout">
        <SearchTrackers />
      </ul>
    </div>
  </nav>
</template>

<style lang="scss">
$dark-blue: #141f2e;
$paragon-green: #00a49a;

body {
  font-family: "Actor", sans-serif;
}

#flyout {
  height: calc(90vh - 100px);
  width: 100%;
  position: fixed;
  z-index: -1;
  background-color: $dark-blue !important;
  box-shadow: 4px 0px 10px 3px rgba(0, 0, 0, 0.19);
}

#flyout-toggle {
  position: fixed;
  top: 110px;
  padding: 18px 15px 12px 15px;
  z-index: 99999; /* needed because of Bootstrap positioning  */
  border: none; /* important to overwrite basic bootstrap border  */

  &.not-collapsed {
    background: transparent;
  }

  .hamburger {
    display: block;
    width: 70px;
    height: 56px;
    position: absolute;
    top: 0;
    left: -5px;

    cursor: pointer;

    opacity: 0; /* hide this */
    z-index: 2; /* and place it over the hamburger */

    -webkit-touch-callout: none;
  }

  .background {
    display: block;
    width: 70px;
    height: 56px;
    position: absolute;
    top: 0;
    left: -5px;

    background: $dark-blue;
    opacity: 0.8;
  }

  .hamburger:checked + .background {
    background: transparent;
  }

  .hamburger:checked ~ span {
    opacity: 1;
    transform: rotate(45deg) translate(-2px, -1px);
  }

  .hamburger:checked ~ span:nth-last-child(3) {
    opacity: 0;
    transform: rotate(0deg) scale(0.2, 0.2);
  }

  .hamburger:checked ~ span:nth-last-child(2) {
    transform: rotate(-45deg) translate(0, -1px);
  }

  .hamburger:checked ~ ul {
    transform: none;
  }

  span {
    display: block;
    width: 33px;
    height: 2px;
    margin-bottom: 7px;
    position: relative;

    background: white;

    z-index: 1;

    transform-origin: 4px 0px;

    transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
      background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1), opacity 0.55s ease;

    &:first-child {
      transform-origin: 0% 0%;
    }

    &:first-child {
      transform-origin: 0% 0%;
    }

    &:nth-last-child(2) {
      transform-origin: 0% 100%;
    }
  }
}

#flyout {
  position: absolute;
  padding-top: 60px;
  width: 300px;
  overflow: scroll;
  left: -25px;
  top: 0;
  list-style-type: none;
  -webkit-font-smoothing: antialiased;
  transform-origin: 0% 0%;
  transform: translate(-100%, 0);
  transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
}

@media (min-width: 768px) {
  #flyout {
    width: 15%;
    min-width: 250px;
    background-color: rgba(20, 31, 46, 0.8) !important;
  }
}
</style>
