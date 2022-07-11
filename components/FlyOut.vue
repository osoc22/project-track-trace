<script>
  export default{
    methods:{
        animateButton(){
          const btn = document.getElementById("flyout-toggle");
          btn.classList.add("open");
        }
    }
  }
</script>

<template>
  <div id="flyout-wrapper">
    <b-button v-b-toggle.flyout id="flyout-toggle" @click="animateButton">
      <img src="../static/svg/burger-menu.svg" width="32" height="32">
    </b-button>
    <b-sidebar id="flyout" title="Paradar" bg-variant="dark" text-variant="light" shadow>
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
  #flyout-wrapper {
    display: flex;
    flex-direction: row;
  }

  #flyout {
    height: 80%;
    width: 200px;
    margin-top: 5%;
    background-color: dimgrey;
    border-radius: 0 20px 20px 0;
    order: 0;
  }

  #flyout-toggle {
    margin-top: 8%;
    border-radius: 0;
    order: 1;
    transition: 0.5s;
  }

  #flyout-toggle.open {
    margin-left: 200px;
  }

</style>
