<template>
  <div v-if="display">
    <vl-overlay :position="position">
      <div class="overlay-content">
        <h5 v-if="name" :class="attention ? 'ml-2 mr-2 mt-1 attention' : 'ml-2 mr-2 mt-1'">
          {{ name }}
        </h5>
        <h6 v-for="(item, index) in details" :key="index" :class="attention ? 'ml-2 mr-2 attention' : 'ml-2 mr-2'">
          {{ index }}
          <p class="lead">
            {{ item }}
          </p>
        </h6>
        <!-- <button type="button" class="btn btn-link" @click="toggleDetails">
          Details
        </button> -->
      </div>
    </vl-overlay>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { eventBus } from "~/plugins/utils";

export default defineComponent({
    name: "VueLayerMarkerPopup",
    props: {
        initPosition: {
            type: Array,
            default: () => [0, 0]
        },
        initDisplay: {
            type: Boolean,
            default: false
        },
        initDetails: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            display: this.initDisplay,
            // WARNING: this position is regular long/lat (°N °E) BE SURE TO CONVERT
            position: this.initPosition,
            details: this.initDetails,
            attention: false,
            name: "" as string | undefined
        };
    },
    mounted () {
        this.$root.$on("popup-toggled", (coordinates : Array<number>, details : Object, alarmEvent: boolean, name?: string) => {
            this.display = true;
            this.position = coordinates;
            this.details = details;
            this.attention = alarmEvent;
            this.name = name;
      });
      this.$root.$on("popup-hide", () => {
        this.display = false;
        this.position = [0, 0];
      });
      /**
       * when any coordinates are updated, we check if the updated data is linked to the current popup.
       * If it is, and we're displaying the popup, we also need to update its
       * TODO find out why this updates more often/more quickly than our marker location ?
       */
      eventBus.$on("newCoordinates", (data: Position) => {
        if (this.details && this.display) {
          if (this.details.ID === data.id) {
            this.position = [data.longitude, data.latitude];
          }
        }
      });
    },
    methods: {
      toggleDetails () {}
    }
});
</script>

<style lang="scss" scoped>
    .overlay-content {
        background: #fff;
        box-shadow: 5px 5px 5px rgb(2 2 2 / 50%);
        max-height: 260px;
        max-width: 175px;
        overflow: auto;
    }

    .lead{
        font-size: 16px;
        margin-bottom: 0;
        display: inline-block;
    }

    .btn:focus,.btn:active{
      outline: none;
      box-shadow: none;
    }

    .attention {
      color: red;
    }
</style>
