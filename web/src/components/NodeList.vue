<template>
  <div class="node-list-container">
      <h1>Node List</h1>

        <div 
            v-for="node in first100" :key="node"
            v-on:click="$emit('select-pubkey', node)"
            class="node-tile"
        >
            <ul>
                <li>{{nodes[node].alias}}</li>
                <li>Public Key: {{node.slice(0,5)}}...{{node.slice(-5)}}</li>
                <li>{{nodes[node].region}}</li>
            </ul>
        </div>

  </div>
</template>
<script>
import Vue from "vue";

export default Vue.extend({
    name: 'NodeList',
    props: ['nodes'],
    data(){
        console.log("Sanity check")
        return {
            keyList: [],
            first100: []
        }
    },
    mounted() {
        console.log("why does this need to cshange to change propss")
        if (this.nodes) {
            this.keyList = Object.keys(this.nodes);
            this.first100 = this.keyList.slice(0, 99);
        } else {
            this.keyList = ['testing']
        }
        

    },
    methods: {
        
    }
})
</script>

<style lang="scss">
.node-list-container {
    position: absolute;
    top: 49px;
    right: 0px;
    width: 200px;
    height: calc(100vh - 50px);
    overflow: scroll;
    background: rgba(255, 255, 255, 0.8);
    .node-tile {
        ul {
            list-style: none;
            text-align: left;
            padding-left: 15px;
        }
    }
  }
</style>