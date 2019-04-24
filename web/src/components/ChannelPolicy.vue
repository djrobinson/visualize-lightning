<template>
  <div class="channel-explorer-container">
    <div class="node1-container">
        <p>{{channel}}</p>
    </div>
    <div class="channel-container">

    </div>
    <div class="node2-container">

    </div>
  </div>
</template>
<script>
import Vue from "vue";
import axios from 'axios';
import ChannelList from '@/components/ChannelList';
import LightningNode from '@/components/LightningNode';

export default Vue.extend({
    name: 'ChannelPolicy',
    props: ['channel'],
    data(){
        console.log("Sanity check")
        return {
        }
    },
    mounted() {
        console.log("What it is: ", this.channels)
    },
    methods: {

    } 
})
</script>

<style lang="scss">
.channel-policy-container {
    
}
</style>