<template>
  <div class="node-list-container">
    <h5>{{title}}</h5>
    <div 
        v-for="node in keyList" :key="node"
        v-on:click="$emit('select-pubkey', node)"
        @mouseover="$emit('preview-node', node)"
        class="node-tile"
        v-bind:style="{ 'border-left': `solid 6px rgb(${nodes[node].color})`, 'border-right': `solid 6px rgb(${nodes[node].color})` }">
        <div class="node-container">
            <p><b>Alias:</b> <span>{{nodes[node].alias}}</span></p>
            <p><b>Public Key:</b> <span>{{node.slice(0,5)}}...{{node.slice(-5)}} </span></p>
            <p><b>Location:</b> <span>{{nodes[node].country_flag_emoji}} {{nodes[node].country}}</span></p>
        </div>
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
            this.keyList = Object.keys(this.nodes);
        } else {
            this.keyList = ['testing']
        }
    },
    watch: { 
        nodes: function(newVal, oldVal) { // watch it
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
    width: 100%;
    height: calc(100vh - 150px);
    overflow: scroll;
    background: rgba(255, 255, 255);

    .node-tile {
        margin-top: 3px;
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
        .node-container {
            margin-top: 10px;
            text-align: left;
            padding-left: 10px;
            padding-right: 15px;
            cursor: pointer;
            * {
                margin: 0;
                padding: 2px;
            } 
            span {
                float: right;
            }
        }
        .node-container:hover {
            padding-left: 20px;
            padding-right: 5px;
            
        }

    }

    .node-tile:hover {
        ul {
            padding-left: 20px;
        }
        
    }
  }
</style>