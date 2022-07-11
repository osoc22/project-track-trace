<template>
  <div>
    <FlyOut />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FlyOut from '~/components/FlyOut.vue'

export default Vue.extend({
    name: "IndexPage",
    components: { FlyOut}
})
</script>
