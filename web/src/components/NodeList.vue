<template>
  <div class="node-list-container">
    <h5>{{title}}</h5>
    <div 
        v-for="node in keyList" :key="node"
        v-on:click="$emit('select-pubkey', node)"
        class="node-tile"
        v-bind:style="{ 'border-left': `solid 6px rgb(${nodes[node].color})`, 'border-right': `solid 6px rgb(${nodes[node].color})` }">
        <div class="flag">
            <h5>{{nodes[node].country_flag_emoji}}</h5>
        </div>
        <ul>
            <li>{{nodes[node].alias}}
            <li><i class="fa fa-copy" style="font-size:12px"></i>  {{node.slice(0,5)}}...{{node.slice(-5)}}</li>
        </ul>
    </div>
  </div>
</template>
<script>
import Vue from "vue";

export default Vue.extend({
    name: 'NodeList',
    props: ['nodes', 'title'],
    data(){
        console.log("Sanity check")
        return {
            keyList: [],
            first100: []
        }
    },
    mounted() {
        if (this.nodes) {   
            console.log("WE get here?", this.nodes)
            this.keyList = Object.keys(this.nodes);
        } else {
            this.keyList = ['testing']
        }
    },
    watch: { 
        nodes: function(newVal, oldVal) { // watch it
            console.log('Prop changed: ', newVal, ' | was: ', oldVal)
            this.keyList = Object.keys(newVal);
        }
    },
    methods: {
        
    }
})
</script>

<style lang="scss">
.node-list-container {

    top: 49px;
    right: 0px;
    width: 200px;
    height: calc(100vh - 150px);
    overflow: scroll;
    background: rgba(255, 255, 255);

    .node-tile {
        .flag {
            width: 20%;
        }
        ul {
            width: 79%;
            padding: 0;
            margin-top: 1px;
            list-style: none;
            text-align: left;
            padding-left: 15px;
        }
    }

    .node-tile:hover {
        ul {
            padding-left: 20px;
        }
        
    }
  }
</style>