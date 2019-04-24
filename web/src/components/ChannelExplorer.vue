<template>
  <div class="channel-explorer-container">
        <LightningNode v-bind:node="node">
        </LightningNode>
        <ChannelList 
            v-bind:channels="channels"
            v-on:select-channelid="$emit('select-channelid', $event)">
        </ChannelList>
  </div>
</template>
<script>
import Vue from "vue";
import axios from 'axios';
import ChannelList from '@/components/ChannelList';
import ChannelPolicy from '@/components/ChannelPolicy';
import LightningNode from '@/components/LightningNode';

export default Vue.extend({
    name: 'ChannelExplorer',
    props: ['channels', 'node'],
    data(){
        console.log("Sanity check")
        return {
            selectedChannel: null
        }
    },
    mounted() {
        console.log("What it is: ", this.channels)
    },
    methods: {
        selectChannel(channelId) {
            this.selectedChannel = channelId;

        }
    } 
})
</script>

<style lang="scss">
.channel-explorer-container {
    background: rgba(255, 255, 255);
    
}
</style>