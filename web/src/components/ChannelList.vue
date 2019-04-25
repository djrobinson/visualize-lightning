<template>
  <div class="channel-list-container">
    <h5>Channel List</h5>
    <div class="scroller">
        <div 
            v-for="channel in channels" :key="channel.channel_id" 
            v-on:click="$emit('select-channelid', channel.channel_id)"
            @mouseover="$emit('highlight-channelid', channel.channel_id)"
            class="channel-tile"
        >
            <p><b>ID:</b> <span>{{channel.channel_id}}</span></p>
            <p><b>Capacity:</b> <span>{{channel.capacity}}</span></p>
        </div>
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

    },
    methods: {

    } 
})
</script>

<style lang="scss">
.channel-list-container {
    background: rgba(255, 255, 255);
    

    .scroller {
        height: calc(100vh - 400px);
        overflow: scroll;
        width: 100%;
        .channel-tile {
            border-top: solid 1px black;
            padding-left: 10px;
            padding-right: 10px;
            text-align: left;
            margin: 0;
            cursor: pointer;
            p {
                margin:0;
                padding: 5px;
                b {
                    text-align: left;
                }
                span {
                    float: right;
                }
            }

        }
    }
    
    .channel-tile:hover {
        background-color: lightgray;

    }
}
</style>