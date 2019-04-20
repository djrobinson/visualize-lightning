<template>
  <div class="network-loading-container">
      <h1>Load the Network</h1>
      <button v-on:click="loadDescribeGraph">Describe Graph</button>
  </div>
</template>
<script>
import Vue from "vue";
import axios from 'axios';

export default Vue.extend({
    data(){
        console.log("Sanity check")
        return {
        }
    },
    methods: {
        loadDescribeGraph() {
            axios
            .get('http://localhost:3000/api/graph/describe')
            .then(response => {
                this.graph = response.data
                console.log("What are describe nodes looking like?", this.graph.nodes)
                console.log("What are describe edges looking like?", this.graph.edges)
            })
        }
    }
    
})
</script>

<style lang="scss">
</style>