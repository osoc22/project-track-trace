<script>
  export default{
    methods:{
        updateMenu(){
          const closedIcon = document.getElementById("menu-closed");
          const openedIcon = document.getElementById("menu-opened");
          if(closedIcon.classList.contains("shown")){
            closedIcon.classList.replace("shown", "hidden");
            openedIcon.classList.replace("hidden","shown");
          }else{
            closedIcon.classList.replace("hidden", "shown");
            openedIcon.classList.replace("shown","hidden");
          }
    },
    // temporary function to generate list items -> to be replaced by actual data
    generateList(){
      const trackerList = document.getElementById("trackerList");
      trackerList.innerHTML = "";
      for(let i=0; i<7; i++){
        let li = document.createElement("li");
        let name = `Alpha ${String(i)}`;
        li.classList.add("list-group-item");
        li.innerText = name;
        trackerList.appendChild(li);
      }
    }
  }
        }
</script>

<template>
  <div id="flyout-wrapper">
    <b-button v-b-toggle.flyout id="flyout-toggle" class="shadow-none" @click="updateMenu" squared>
      <img id="menu-closed" class="shown" src="../static/svg/burger-menu.svg" width="32" height="32">
      <img id="menu-opened" class="hidden" src="../static/svg/close-menu.svg" width="32" height="32" >
    </b-button>
    <b-sidebar id="flyout" bg-variant="dark" text-variant="light" no-header shadow>
      <!-- because of no-header, we need an additional horizontal break-->
      <hr>
      <hr>
      <!-- search box row-->
      <div class="container">
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
    </b-sidebar>
  </div>
</template>

<style>
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

  .form-group {
    margin-bottom: 15px;
  }

  .list-group-item {
    color: #343a40;
  }

  .hidden {
    display: none;
  }

  .shown {
    display: block;
  }

  #flyout {
    height: 80%;
    width: 15%;
    margin-top: 5%;
    border-radius: 0 20px 20px 0;
    position: fixed;
    z-index: -1;
  }

  #flyout-toggle {
    margin-top: 5%;
    position: fixed;

    /* needed because of Bootstrap positioning  */
    z-index: 99999;
    background-color: #343a40;

    /* important to overwrite basic bootstrap border  */
    border-radius: 0 7px 7px 0 !important;
  }
</style>
