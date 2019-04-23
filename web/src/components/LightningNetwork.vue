<template>

    <div class="canvas-container">
      <div id="map"></div>
      <!-- <ChannelList
        v-bind:channels="activeChannels"
        v-on:select-channelid="selectChannel($event)"
      /> -->
      <NodeList 
        v-if="nodes"
        v-on:select-pubkey="selectNode($event)"
        v-bind:nodes="nodes"
      />
      <ChannelExplorer
        v-if="selectedChannel"
        v-bind:channel="selectedChannel"
      />
    </div>

</template>
<script>
import Vue from 'vue';
import {Deck, MapController} from '@deck.gl/core';
import {MapboxLayer} from '@deck.gl/mapbox';
import {GeoJsonLayer, ArcLayer, ScatterplotLayer} from '@deck.gl/layers';
import {scaleQuantile} from 'd3-scale';
import {NodeList} from '@/components/NodeList';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';


export default Vue.extend({
  name: 'LightningNetwork',
  data(){
      console.log("Sanity check")
      return {
          map: null,
          deck: null,
          graph: null,
          pong: null,
          arcs: null,
          nodes: null,
          edges: null,
          map: null,
          activeChannels: [],
          nodesInView: [],
          popups: [],
          selectedNode: null,
          selectedChannel: null,
          mapCenter: [55,40],
          standardZoom: 1.1,
          INITIAL_VIEW_STATE: {
            longitude: -100,
            latitude: 40.7,
            zoom: 3,
            maxZoom: 15,
            pitch: 30,
            bearing: 30
          }
      }
  },
  async mounted(){
      mapboxgl.accessToken = 'pk.eyJ1IjoiZGFubnkxcm9iaW5zb24iLCJhIjoiY2p1bTExc21tMHliNzN5bXFoNGZua3MzZyJ9.4RybkDpAAixpKuuCmTeEyA'
      const response = await axios.get('http://localhost:3000/api/networkmap/ips')
      this.selectedNode = '038863cf8ab91046230f561cd5b386cbff8309fa02e3f0c3ed161a3aeb64a643b9';
      this.popups = [];
      console.log("Working with new response: ", response);
      const northpole_res = await axios.get('http://localhost:3000/api/networkmap/northpole')
      console.log("What is north pole", northpole_res);
      const ipNodes = response.data.nodes.reduce((acc, node) => {
        if (!acc[node.public_key] && parseFloat(node.longitude) && parseFloat(node.latitude)) {
          acc[node.public_key] = {
            public_key: node.public_key,
            position: [parseFloat(node.longitude), parseFloat(node.latitude)],
            color:  this._hexToRgbNew(node.color),
            radius: 1000,
            alias: node.alias,
            ip: node.ip_address,
            city: node.city,
            country: node.country_name,
            region: node.region_name
          }
        };
        return acc;
      }, {});
      const northpoleNodes = northpole_res.data.nodes.reduce((acc, node, i) => {
        if (!acc[node.public_key]) {
          acc[node.public_key] = {
            public_key: node.public_key,
            position: [-165 + (i * 0.5), 70 + (1 * (i % 7))],
            color:  this._hexToRgbNew(node.color),
            radius: 1000,
            alias: node.alias,
          }
        };
        return acc;
      }, {});

      const ipVals = Object.values(ipNodes);
      const npVals = Object.values(northpoleNodes);
      const allNodes = ipVals.concat(npVals);
      this.nodes = {...ipNodes, ...northpoleNodes};
      this.scatterData = allNodes;
      console.log("What all nodes is: ", allNodes);

      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: this.mapCenter,
        pitch: 22 ,
        bearing: 0,
        zoom: this.standardZoom,
      });
      this.map = map;
      map.on('load', () => {
        const scatterplotlayer = new MapboxLayer({
          id: 'scatter',
          type: ScatterplotLayer,
          getRadius: d => d.radius,
          getColor: d =>d.color,
          radiusMinPixels: 3,
          data: this.scatterData,
        })
        map.addLayer(scatterplotlayer)
        this.recalculateArcs()
        this._mapLoaded(map)
      });
  },
  methods: {
    _hexToRgbNew(hex) {
      if(hex.substring(0,1) == '#') {
        hex = hex.substring(1);
      }
      var arrBuff = new ArrayBuffer(4);
      var vw = new DataView(arrBuff);

      vw.setUint32(0,parseInt(hex, 16),false);
      var arrByte = new Uint8Array(arrBuff);
      const color = [arrByte[1], arrByte[2], arrByte[3]];
      return color;
    },
    _mapLoaded(map) {
      const popups = this.popups;
      const scatterData = this.scatterData;
      const boundSetNodes = this.setNodesInView.bind(this);
       map.on('click', function (e) {
        console.log('reg click')
        const currZoom = map.getZoom();
        if (currZoom === 7) {
          this.nodesInView = []
          map.setZoom(this.standardZoom);
          map.setCenter(this.mapCenter);
          if (this.popups) {
            this.popups.forEach(popup => popup.remove());
          }
        } else {
          map.setZoom(7);
          map.setCenter(e.lngLat);
          const bounds = map.getBounds();
          boundSetNodes(bounds);
          this.popups = popups;
        }
      });
    },
    setNodesInView(bounds) {
      this.nodesInView = this.scatterData.filter(node => {
        if (bounds._sw.lng < node.position[0] && node.position[0] < bounds._ne.lng && bounds._sw.lat < node.position[1] && node.position[1] < bounds._ne.lat) {
          const currentNode = node;
            if (currentNode && currentNode.position) {
              var popup = new mapboxgl.Popup({closeOnClick: false})
              .setLngLat(currentNode.position)
              .setHTML(`
                <p>IP: ${currentNode.ip || ''}</p>
                <p>City: ${currentNode.city}</p>
              `)
              .addTo(this.map);
              this.popups.push(popup);
            }
          return true
        } else {
          return false
        };
      });
    },
    selectChannel(channel_id) {
      const chan = this.edges.filter(edge => edge.channel_id === channel_id)
      if (chan.length) {
        this.selectedChannel = chan[0]
      }
      console.log("New selected Channel", this.selectedChannel, channel_id);
    },
    async selectNode(pub_key) {
      console.log("Pusgb: ", pub_key)
      this.selectedNode = pub_key;
      await this.recalculateArcs();
    },
    async recalculateArcs() {
      const arcRes = await axios.post('http://localhost:3000/api/networkmap/arcs', { publicKey: this.selectedNode })
      this.activeChannels = [];

      const theseNodes = this.nodes;
      this.edges = arcRes.data.mapChannels;
      
      const arcs = arcRes.data.mapChannels.reduce((acc, edge) => {

        if ((theseNodes[edge.node1_pub] && theseNodes[edge.node2_pub]) && (!edge.node2_longitude || !edge.node1_longitude)) {
          acc.push({
            source: theseNodes[edge.node1_pub].position,
            target: theseNodes[edge.node2_pub].position,
            value: parseInt(edge.capacity)
          });
        } else if (this.selectedNode === edge.node1_pub || this.selectedNode === edge.node2_pub) {
          this.activeChannels.push(edge)
          acc.push({
            source: [parseFloat(edge.node1_longitude), parseFloat(edge.node1_latitude)],
            target: [parseFloat(edge.node2_longitude), parseFloat(edge.node2_latitude)],
            value: parseInt(edge.capacity)
          });
        }
        return acc;
      }, []);
      

      const scale = scaleQuantile()
        .domain(arcs.map(a => Math.abs(a.value)))

      arcs.forEach(a => {
        a.gain = Math.sign(a.value);
        a.quantile = scale(Math.abs(a.value));
      });
      this.arcs = arcs;
      if (this.map.getLayer('arc')) {
        this.map.removeLayer('arc')
      }
      this.map.setZoom(this.standardZoom);
      this.map.setCenter(this.mapCenter);
      const arclayer = new MapboxLayer({
        id: 'arc',
        type: ArcLayer,
        data: this.arcs,
        opacity: 0.1,
        getColor: [0,0,0],
        getSourcePosition: d => d.source,
        getTargetPosition: d => d.target,
        getWidth: 3
      })

      this.map.addLayer(arclayer)
    },
  }
})
</script>

<style lang="scss">
  .canvas-container {
    position: absolute;
    width: 100vw;
    height: 100vh;
    left: 0;
    margin: 0px;
    padding: 0px;
    border: solid 1px black;
  }
  #map {
    width: 100%;
    height: 100vh;;
    margin-top: -10px;
  }
  canvas {
    left: 0;
  }
  #marker {
  // background-image: url('https://docs.mapbox.com/mapbox-gl-js/assets/washington-monument.jpg');
  background-size: cover;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  }
</style>