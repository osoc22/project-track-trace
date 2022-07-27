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
            attention: false, // when alarm event was sent, this marker needs attention
            name: "" as string | undefined
        };
    },
    mounted () {
        this.$root.$on("popup-toggled", (positionInfo: Position, name?: string) => {
            this.display = true;
            this.position = [positionInfo.longitude, positionInfo.latitude];
            this.details = this.parseDetails(positionInfo);
            this.attention = !!positionInfo.alarmEvent;
            this.name = name;
      });
      // Hide popup on global event
      this.$root.$on("popup-hide", () => {
        this.display = false;
        this.position = [0, 0];
      });
      /**
       * when any coordinates are updated, we check if the updated data is linked to the current popup.
       * If it is, and we're displaying the popup, we also need to update its location.
       */
      eventBus.$on("newCoordinates", (data: Position) => {
        if (this.details && this.display) {
          // if the data ID is the same as the current popup ID
          if (this.details.ID === data.id) {
            // We update the position
            this.position = [data.longitude, data.latitude];
            // centers map on currently selected marker whenever its location is updated
            eventBus.$emit("centerMapOnTrackedAsset", this.position);
            // update popup details when the attached asset has sent an update
            this.details = this.parseDetails(data);
          }
        }
      });
      eventBus.$on("removedMarker", (elementID : string) => {
        if (this.display && this.details.ID === elementID) {
          this.display = false;
        }
      });
    },
    methods: {
      toggleDetails () {},
      parseDetails (data : Position) {
        // convert timestamp to readable format
        const timestamp : Date = new Date(data.timestamp * 1000);
        const tsString : string = timestamp.toLocaleString();
        const details = Object.fromEntries(Object.entries({
              ID: data.id,
              Longitude: data.longitude,
              Latitude: data.latitude,
              "Battery Level": data.batteryLevel,
              "Last Received Data": tsString
            }).filter(([_key, value]) => value));
            if (data.movementStatus) {
              details.Moving = undefined;
            }
            return details;
      }
    }
    /**
     * Placeholder to toggle details on the right side of the window
     * methods: {
     *   toggleDetails () {}
     * }
     */
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
