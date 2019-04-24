<template>
  <div class="channel-list-container">
    <h5>Channel List</h5>
    <div class="scroller">
        <div 
            v-for="channel in channels" :key="channel.channel_id" 
            v-on:click="$emit('select-channelid', channel.channel_id)"
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
        console.log("What it is: ", this.channels)
    },
    methods: {

    } 
})
</script>

<style lang="scss">
.channel-list-container {
    background: rgba(255, 255, 255);

    .scroller {
        overflow: scroll;
        height: 400px;
        width: 100%;
        .channel-tile {
            border-top: solid 1px black;
            padding-left: 10px;
            padding-right: 10px;
            text-align: left;
            p {
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
        border-top: solid 4px black;
        border-bottom: solid 3px black;

    }
}
</style>