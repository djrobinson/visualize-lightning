<template>
  <div class="lightning-node-container">
      <h1>test</h1>
    <p>{{node}}</p>
  </div>
</template>
<script>
import Vue from "vue";
import axios from 'axios';

export default Vue.extend({
    name: 'LightningNode',
    props: ['node'],
    data(){
        console.log("Sanity check")
        return {
        }
    },
    mounted() {
        console.log("What it is: ", this.channel)
    },
    methods: {

    } 
})
</script>

<style lang="scss">
.lightning-node-container {

    background: rgba(255, 255, 255);
  }
</style>