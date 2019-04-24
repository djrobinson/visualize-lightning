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
            policy1: null,
            policy2: null
        }
    },
    async mounted() {
        const policy1 = await axios.post('http://localhost:3000/api/networkmap/policy', { publicKey: this.channel.node1_pub, channelId: this.channel.channel_id })
        const policy2 = await axios.post('http://localhost:3000/api/networkmap/policy', { publicKey: this.channel.node2_pub, channelId: this.channel.channel_id })
        console.log("What it is: ", policy1, policy2)
    },
    methods: {

    } 
})
</script>

<style lang="scss">
.channel-policy-container {
    
}
</style>