<template>
  <div class="channel-list-container">
    <h1>Channel List</h1>
    <div 
        v-for="channel in channels" :key="channel.channel_id" 
        v-on:click="$emit('select-channelid', channel.channel_id)"
        class="channel-tile"
    >
        <ul>
            <li>{{channel.channel_id}}</li>
            <li>Capacity: {{channel.capacity}}</li>
        </ul>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import axios from 'axios';

export default Vue.extend({
    name: 'ChannelList',
    props: ['channels'],
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
.channel-list-container {
    position: absolute;
    top: 49px;
    width: 200px;
    height: calc(100vh - 50px);
    background: rgba(255, 255, 255, 0.8);
    overflow: scroll;
    .channel-tile {
        ul {
            padding-left: 10px;
            text-align: left;
            list-style: none;
        }
    }
    
  }
</style>