<template>
  <div class="channel-explorer-container">
    <p>{{channel.channel_id}}</p>
                <p>Capacity: {{channel.capacity}}</p>
    <div class="participants-container">
        <div class="participant-tile">
            <ul>
                <li>Alias: {{channel.node1_alias}}</li>
                <li>Country: {{channel.node1_country_flag_emoji}}</li>
                <li>IP: {{channel.node1_ip}}</li>
            </ul>
        </div>
        <div class="participant-tile">
            <ul>
                <li>Alias: {{channel.node2_alias}}</li>
                <li>Country: {{channel.node2_country_flag_emoji}}</li>
                <li>IP: {{channel.node2_ip}}</li>
            </ul>
        </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import axios from 'axios';

export default Vue.extend({
    name: 'ChannelExplorer',
    props: ['channel'],
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
.channel-explorer-container {
    position: absolute;
    bottom: 0;
    height: 200px;
    width: calc(100vw - 400px);
    left: 200px;
    background: rgba(255, 255, 255, 0.8);
    overflow: scroll;
    .participants-container {
        display: flex;
        flex-direction: row;
    }
    .participant-tile {
        width: 50%;
        ul {
            padding-left: 150px;
            text-align: left;
            list-style: none;
        }
    }
    
  }
</style>