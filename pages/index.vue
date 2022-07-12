<template>
  <div>
    <FlyOut />
    <DetailsPane />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FlyOut from '~/components/FlyOut.vue'
import DetailsPane from '~/components/DetailsPane.vue'

export default Vue.extend({
    name: "IndexPage",
    components: { FlyOut, DetailsPane }
})
</script>
