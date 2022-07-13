<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    methods: {
        performSearch(){
          console.log("performing search");
        },
        clickListItem(event : MouseEvent, details : Object) {
          let targetElement = event.target as HTMLElement;
          this.resetActive(targetElement);
          // emit data through root, to be caught by the DetailsPane component
          this.$root.$emit("details",targetElement.innerText, details);
        },
        resetActive(element : HTMLElement) {
          let add : Boolean = !element.classList.contains('active');
          this.clearActive();
          if(add){
            element.classList.add('active');
          }
        },
        clearActive(){
        let currentActive : HTMLCollectionOf<Element> = document.getElementsByClassName("active");
          for (var i = 0; i < currentActive.length; i++) {
            currentActive.item(i)?.classList.remove('active');
          }
        }
    },
    mounted(){
      this.$root.$on("details-toggled", ()=> {
        this.clearActive();
      })
    },
    data(){
      return {
        trackers: {
          'Alpha 01' : {"description": "Description of Alpha 01","nickname": "Florian"},
          'Alpha 02' : {"description": "Description of Alpha 02","nickname": "Bo"},
          'Alpha 03' : {"description": "Description of Alpha 03","nickname": "Ben"},
          'Alpha 04' : {"description": "Description of Alpha 04","nickname": "Joshua"},
          'Phone 01' : {"description": "Description of Phone 01","nickname": "Meg"},
          'Phone 02' : {"description": "Description of Phone 02","nickname": "Jonathan", "groups" : "NCCN, flooding,  kitten stuck in a tree"},
        }
      }
    }
})
</script>
<template>
      <div class="container" text-variant="light">
        <!-- search box row-->
        <div class="row align-items-center form-group">
          <div class="col-sm-2"></div>
          <div class="col-sm-8">
            <b-input-group>
              <b-form-input size="sm" placeholder="search tracker"></b-form-input>
              <b-input-group-append>
                <b-button size="sm" variant="outline-success" @click="performSearch">🔍</b-button>
              </b-input-group-append>
            </b-input-group>
          </div>
          <div class="col-sm-2"></div>
        </div>
        <!-- tracker data row-->
        <div class="row align-items-center align-text-center">
          <div class="col-sm-2"></div>
          <div class="col-sm-8">
            <ul class="list-group" id="trackerList">
              <li class="list-group-item" v-for="(item, index) in trackers" :key="index" @click="clickListItem($event, item)" :id="index">
                {{ index }}
              </li>
            </ul>
          </div>
          <div class="col-sm-2"></div>
        </div>
      </div>
</template>

<style lang="scss">
  li:nth-child(even) {
    background: #fff;
  }

  li:nth-child(odd) {
    background: #e0e0e0;
  }

  li:hover {
    cursor: pointer;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .list-group-item {
    color: #343a40;
  }
</style>