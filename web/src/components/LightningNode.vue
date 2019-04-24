<template>
  <div class="lightning-node-container">
    <p><b>Alias: </b><span>{{node.alias || 'unknown'}}</span> <span class="dot" v-bind:style="{ 'background-color': `rgb(${node.color})` }"></span> </p>
    <p><b>Public Key:</b><span><i class="fa fa-copy" style="font-size:12px"></i> {{node.publicKey.slice(0,5)}}...{{node.publicKey.slice(-5)}}</span></p>
    <p><b>IP Address:</b> <span>{{node.ip}}</span></p>
    <p><b>Long/Lat:</b> <span>[{{node.position.toString()}}]</span></p>
    <p><b>Location:</b> <span> {{node.country_flag_emoji}} {{node.region}} {{node.country}}</span></p>
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

    },
    methods: {

    } 
})
</script>

<style lang="scss">
.lightning-node-container {
    text-align: left;
    padding-left: 10px;
    padding-right: 10px;
    background: rgba(255, 255, 255);
    .dot {
        height: 11px;
        width: 11px;
        border-radius: 50%;
        display: inline;
    }
    p {
        b {
            text-align: left;
        }
        span {
            float: right;
        }
    }
  }
</style>