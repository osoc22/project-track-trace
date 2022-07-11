<script>
  export default{
    methods:{
        updateMenu(){
          const closedIcon = document.getElementById("menu-closed");
          const openedIcon = document.getElementById("menu-opened");
          if(closedIcon.classList.contains("shown")){
            closedIcon.classList.remove("shown");
            closedIcon.classList.add("hidden");
            openedIcon.classList.remove("hidden");
            openedIcon.classList.add("shown");
          }else{
            openedIcon.classList.remove("shown");
            openedIcon.classList.add("hidden");
            closedIcon.classList.remove("hidden");
            closedIcon.classList.add("shown");
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
      <hr>
      <h1 class="px-3 py-2"> Paradar </h1>
      <div class="px-3 py-2">
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
          in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
        </p>
        <b-img src="../static/icon.png" fluid></b-img>
      </div>
    </b-sidebar>
  </div>
</template>

<style>
  .hidden {
    display: none;
  }

  .shown {
    display: block;
  }

  #flyout {
    height: 80%;
    width: 200px;
    margin-top: 5%;
    border-radius: 0 20px 20px 0;
    position: fixed;
    z-index: -1;
  }

  #flyout-toggle {
    margin-top: 5%;
    transition: 0.5s;
    position: fixed;
    z-index: 99999;
    background-color: #343a40;
    border-style: none;
  }
</style>
