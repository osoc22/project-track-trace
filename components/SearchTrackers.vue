<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    methods: {
        // temporary function to generate list items -> to be replaced by actual data
        generateList() {
            const trackerList = document.getElementById("trackerList");
            if(trackerList != null){
                trackerList.innerHTML = "";
                for (let i = 0; i < 7; i++) {
                    let li = document.createElement("li");
                    let name = `Alpha ${String(i)}`;
                    li.classList.add("list-group-item");
                    li.innerText = name;
                    let docRoot = this.$root;
                    li.addEventListener('click', function(event){
                        const clickElement = event.target as HTMLElement;
                        docRoot.$emit("details",clickElement.innerText);
                    })
                    trackerList.appendChild(li);
                }
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
                <b-button size="sm" variant="outline-success" @click="generateList">🔍</b-button>
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
            </ul>
          </div>
          <div class="col-sm-2"></div>
        </div>
      </div>
</template>

<style lang="scss">
  hr {
    clear: both;
    visibility: hidden;
  }

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