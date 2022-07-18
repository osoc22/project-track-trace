<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      /**
       * example trackers list, where the value will be all relevant info for that tracker
       * There is no need for these value lists to be equal size, some can have more/less pairs
       */
      trackers: {
        "Alpha 01": {
          description: "Description of Alpha 01",
          nickname: "Florian",
        },
        "Alpha 02": { description: "Description of Alpha 02", nickname: "Bo" },
        "Alpha 03": { description: "Description of Alpha 03", nickname: "Ben" },
        "Alpha 04": {
          description: "Description of Alpha 04",
          nickname: "Joshua",
        },
        "Phone 01": { description: "Description of Phone 01", nickname: "Meg" },
        "Phone 02": {
          description: "Description of Phone 02",
          nickname: "Jonathan",
          groups: "NCCN, flooding,  kitten stuck in a tree",
        },
      },
    };
  },
  mounted() {
    /**
     * event triggered on closing the details window, sent from the DetailsPane component
     */
    this.$root?.$on("details-closed", () => {
      this.clearActive();
    });
  },
  methods: {
    /**
     * function template in case we want to implement search
     */
    performSearch() {},
    /**
     * event triggered when clicking on a list item
     * @param event the event that triggered the function
     * @param details the list of details passed in, see the data()/trackers part
     */
    clickListItem(event: MouseEvent, details: Object) {
      const targetElement = event.target as HTMLElement;
      this.resetActive(targetElement);
      // emit data through root, to be caught by the DetailsPane component
      this.$root?.$emit("details", targetElement.innerText, details);
    },
    /**
     * resets the active element to the given one, if it is not already active itself
     * @param element the element for which to re-set the active class
     */
    resetActive(element: HTMLElement) {
      const add: Boolean = !element.classList.contains("active");
      this.clearActive();
      if (add) {
        element.classList.add("active");
      }
    },
    /**
     * gets called whenever the active element of the search list must be cleared
     * and does this by looping over all 'active' elements
     */
    clearActive() {
      const currentActive: HTMLCollectionOf<Element> =
        document.getElementsByClassName("active");
      for (let i = 0; i < currentActive.length; i++) {
        currentActive.item(i)?.classList.remove("active");
      }
    },
  },
});
</script>
<template>
  <div class="container" text-variant="light">
    <!-- search box row-->
    <div class="row align-items-center form-group">
      <b-input-group>
        <b-form-input size="sm" placeholder="Search tracker" />
        <b-input-group-append>
          <b-button size="sm" @click="performSearch">
            <img src="/svg/search.svg" alt="search button" />
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </div>
    <!-- tracker data row-->
    <div class="row align-items-center align-text-center">
      <div class="tracker-list-wrapper">
        <ul id="trackerList" class="list-group">
          <li
            v-for="(item, index) in trackers"
            :id="index"
            :key="index"
            class="list-group-item"
            @click="clickListItem($event, item)"
          >
            {{ index }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$paragon-green: #00a49a;

#trackerList {
  padding-right: 17px;
  border-radius: 0;
}
.tracker-list-wrapper {
  width: 100%;
}

li:nth-child(even):not(.active) {
  background: #fff;
}

li:nth-child(odd):not(.active) {
  background: #e0e0e0;
}

li:hover {
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;

  input {
    border-radius: 0;
    height: 40px;
  }
}

.form-control:focus {
  border: none;
}

.input-group {
  margin-right: 18px;
}

.input-group-append {
  height: 40px;
  position: absolute;
  right: 0;
}

.list-group-item {
  color: #343a40;
  border: none;

  &:hover {
    color: $paragon-green;
    transition-duration: 0.3s;
  }

  &.active {
    background-color: $paragon-green;
    color: white;
  }
}

input {
  border: none;
  z-index: 1;
}

button {
  border: none;
  background: transparent;
  border-radius: 0;
  z-index: 4;

  &:focus {
    border: none;
    background: transparent;
    box-shadow: none;
  }

  &:hover {
    background-color: rgba(0, 164, 154, 0.5);
  }
}
</style>
