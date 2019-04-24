<template>
  <div class="channel-explorer-container">
        <LightningNode v-bind:node="node">
        </LightningNode>
        <div class="row">
            <ChannelList 
                v-bind:channels="channels"
                v-on:select-channelid="$emit('select-channelid', $event)"
                v-on:highlight-channelid="$emit('highlight-channelid', $event)">
            </ChannelList>
        </div>
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