<template>
  <div class="channel-policy-container">

    <h5>Channel</h5>
    <p><b>Channel ID:</b> <span>{{channel.channel_id}}</span></p>
    <p><b>Last Update:</b> <span>{{channel.last_update}}</span></p>
    <p><b>Capacity</b> <span>{{channel.capacity}}</span></p>
    <h5>Node 1 Policy</h5>
    <p><b>Public Key: </b> <span><i class="fa fa-copy" style="font-size:12px"></i> {{channel.node1_pub.slice(0,5)}}...{{channel.node1_pub.slice(-5)}} </span></p>
    <p><b>Alias: </b> <span>{{channel.node1_alias}}</span></p>
    <p><b>IP: </b> <span>{{channel.node1_ip}}</span></p>
    <p><b>Location: </b> <span>{{channel.node1_country_flag_emoji}} {{channel.node1_country_name}} </span></p>
    <p><b>Fee Base (msats): </b> <span>{{policy1.fee_base_msat}}</span></p>
    <p><b>Fee Rate (milli msats): </b> <span>{{policy1.fee_rate_milli_msat}}</span></p>
    <p><b>Minimum HTLC: </b> <span>{{policy1.min_htlc}}</span></p>
    <p><b>Disabled: </b> <span>{{!policy1.disabled}}</span></p>
    <h5>Node 2 Policy</h5>
    <p><b>Public Key: </b> <span><i class="fa fa-copy" style="font-size:12px"></i> {{channel.node2_pub.slice(0,5)}}...{{channel.node2_pub.slice(-5)}} </span></p>
    <p><b>Alias: </b> <span>{{channel.node2_alias}}</span></p>
    <p><b>IP: </b> <span>{{channel.node2_ip}}</span></p>
    <p><b>Location: </b> <span>{{channel.node2_country_flag_emoji}} {{channel.node2_country_name}} </span></p>
    <p><b>Fee Base (msats): </b> <span>{{policy2.fee_base_msat}}</span></p>
    <p><b>Fee Rate (milli msats): </b> <span>{{policy2.fee_rate_milli_msat}}</span></p>
    <p><b>Minimum HTLC: </b> <span>{{policy2.min_htlc}}</span></p>
    <p><b>Disabled: </b> <span>{{!policy2.disabled}}</span></p>
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
            policy1: {},
            policy2: {}
        }
    },
    async mounted() {
        const policy1_res = await axios.post('http://localhost:3000/api/networkmap/policy', { publicKey: this.channel.node1_pub, channelId: this.channel.channel_id })
        const policy2_res = await axios.post('http://localhost:3000/api/networkmap/policy', { publicKey: this.channel.node2_pub, channelId: this.channel.channel_id })
        this.policy1 = policy1_res.data.policy[0];
        this.policy2 = policy2_res.data.policy[0];
        console.log("What it is: ", this.policy1, this.policy2)
    },
    methods: {

    } 
})
</script>

<style lang="scss">
.channel-policy-container {
    height: 550px;
    overflow: scroll;
    padding-left: 10px;
    padding-right: 10px;
    text-align: left;
    h5 {
        text-align: center;
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