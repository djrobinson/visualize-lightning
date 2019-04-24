<template>

  <div class="canvas-container">
    <div id="map"></div>
    <div class="sidebar-pane">
      <div class="tab-row">
        <div
          v-if="!selectedNode"
          class="tab">
          <h5>Map Search</h5>
        </div>
        <div 
          v-if="selectedNode && !selectedChannel"
          class="tab">
          <span><p><a v-on:click="clearSelected"><i class="fa fa-arrow-left"></i> Choose A Different Node</a></p></span>
          <h5>Node Detail</h5>
        </div>
        <div 
          v-if="selectedChannel"
          class="tab">
          <span><p><a v-on:click="clearChannel"><i class="fa fa-arrow-left"></i> Choose A Different Channel</a></p></span>
          <h5>Channel Detail</h5>
        </div>
      </div>

      <NodeList 
        v-if="!selectedNode"
        v-on:select-pubkey="selectNode($event)"
        v-on:preview-node="showPreview($event)"
        v-bind:nodes="nodesInView"
      />
      <ChannelExplorer
        v-if="selectedNode && !selectedChannel"
        v-on:highlight-channelid="hightlightChannel($event)"
        v-on:select-channelid="selectChannel($event)"
        
        v-bind:channels="activeChannels"
        v-bind:node="nodes[selectedNode]"
      >
      </ChannelExplorer>
      <ChannelPolicy 
          v-if="selectedChannel"
          v-bind:channel="selectedChannel"
      >
      </ChannelPolicy>

    </div>
    <button v-on:click="searchMap" class="map-search-button button">Redo Search in This Area</button>
    <button v-on:click="backToCenter" class="map-zoom-button button">Zoom Out and Center</button>
    
  </div>

</template>
<script>
import Vue from 'vue';
import {Deck, MapController} from '@deck.gl/core';
import {MapboxLayer} from '@deck.gl/mapbox';
import {GeoJsonLayer, ArcLayer, ScatterplotLayer} from '@deck.gl/layers';
import {scaleQuantile} from 'd3-scale';
import {NodeList} from '@/components/NodeList';
import {ChannelExplorer} from '@/components/ChannelExplorer';
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
          activeNodes: [],
          activeChannels: [],
          nodesInView: [],
          popups: [],
          selectedNode: null,
          previewNode: null,
          selectedChannel: null,
          activeMapSearch: false,
          mapCenter: [40,40],
          standardZoom: 1.5,
      }
  },
  async mounted(){
      mapboxgl.accessToken = 'pk.eyJ1IjoiZGFubnkxcm9iaW5zb24iLCJhIjoiY2p1bTExc21tMHliNzN5bXFoNGZua3MzZyJ9.4RybkDpAAixpKuuCmTeEyA'
      const response = await axios.get('http://localhost:3000/api/networkmap/ips')
      this.popups = [];
      const northpole_res = await axios.get('http://localhost:3000/api/networkmap/northpole')
      const ipNodes = response.data.nodes.reduce((acc, node) => {
        if (!acc[node.public_key] && parseFloat(node.longitude) && parseFloat(node.latitude)) {
          acc[node.public_key] = {
            publicKey: node.public_key,
            position: [parseFloat(node.longitude), parseFloat(node.latitude)],
            color:  this._hexToRgbNew(node.color),
            radius: 1000,
            alias: node.alias,
            ip: node.ip_address,
            city: node.city,
            country: node.country_name,
            region: node.region_name,
            country_flag: node.country_flag,
            country_flag_emoji: node.country_flag_emoji
          }
        };
        return acc;
      }, {});
      const northpoleNodes = northpole_res.data.nodes.reduce((acc, node, i) => {
        if (!acc[node.public_key]) {
          acc[node.public_key] = {
            publicKey: node.public_key,
            position: [-165 + (i * 0.4), 75 + (1 * (i % 8))],
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
      this.nodesInView = this.nodes;
      this.scatterData = allNodes;

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
          getColor: d => d.color,
          radiusMinPixels: 4,
          data: this.scatterData,
        })
        map.addLayer(scatterplotlayer)
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
      const scatterData = this.scatterData;
      const mapCenter = this.mapCenter;
      this.setNodesInView();
    },
    clearSelected() {
      this.selectedNode = null;
      this.activeNodes = [];
      this.activeChannels = [];
    },
    clearChannel() {
      this.selectedChannel = null;
    },
    changeTabs() {
      this.activeMapSearch = !this.activeMapSearch;
    },
    searchMap() {
      this.clearSelected();
      this.activeMapSearch = true;
      this.setNodesInView()
    },
    backToCenter() {
      this.map.setZoom(this.standardZoom)
      this.map.setCenter(this.mapCenter)
    },
    
    setNodesInView() {
      const bounds = this.map.getBounds() 
      this.nodesInView = this.scatterData.reduce((acc, node) => {
        if (bounds._sw.lng < node.position[0] && node.position[0] < bounds._ne.lng && bounds._sw.lat < node.position[1] && node.position[1] < bounds._ne.lat) {
          const currentNode = node;
          acc[node.publicKey] = node;
        }
        return acc;
      }, {});
    },
    selectChannel(channel_id) {
      const chan = this.edges.filter(edge => edge.channel_id === channel_id)
      if (chan.length) {
        this.selectedChannel = chan[0]
      }
    },
    async showPreview(pubKey) {
      this.previewNode = pubKey;
      await this.calculatePreviewArcs();
    },
    async hightlightChannel(channelId) {
      await this.hightlightArc(channelId);
    },
    async selectNode(pub_key) {
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
          this.activeChannels.push(edge)
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

      const activeNodes = this.edges.reduce((acc, edge) => {
        if (acc.indexOf(edge.node1_pub) === -1 && this.nodes[edge.node2_pub]) {
          acc.push(this.nodes[edge.node1_pub]);
        }
        if (acc.indexOf(edge.node2_pub) === -1 && this.nodes[edge.node2_pub]) {
          acc.push(this.nodes[edge.node2_pub]);
        }
        return acc;
      }, []);

      if (this.map.getLayer('scatter-active')) {
        this.map.removeLayer('scatter-active')
      }
      if (activeNodes.length) {
        console.log("What active nodes", activeNodes)
        const scatterplotActive = new MapboxLayer({
          id: 'scatter-active',
          type: ScatterplotLayer,
          stroked: true,
          getRadius: d => d.radius,
          getColor: d => d.color,
          radiusMinPixels: 7,
          data: activeNodes,
        })
        this.map.addLayer(scatterplotActive)
      }

      console.log("What are active nodes: ", activeNodes);

      this.arcs = arcs;
      if (this.map.getLayer('arc')) {
        this.map.removeLayer('arc')
      }
      if (this.map.getLayer('arc-highlight')) {
          this.map.removeLayer('arc-highlight')
        }
      const arclayer = new MapboxLayer({
        id: 'arc',
        type: ArcLayer,
        data: this.arcs,
        opacity: 1,
        getColor: [0,0,0],
        getSourcePosition: d => d.source,
        getTargetPosition: d => d.target,
        getWidth: 3
      })

      this.map.addLayer(arclayer)
    },
    async calculatePreviewArcs() {
        const arcRes = await axios.post('http://localhost:3000/api/networkmap/arcs', { publicKey: this.previewNode })

        const theseNodes = this.nodes;
        
        const arcs = arcRes.data.mapChannels.reduce((acc, edge) => {
          if ((theseNodes[edge.node1_pub] && theseNodes[edge.node2_pub]) && (!edge.node2_longitude || !edge.node1_longitude)) {
            acc.push({
              source: theseNodes[edge.node1_pub].position,
              target: theseNodes[edge.node2_pub].position,
              value: parseInt(edge.capacity)
            });
          } else if (this.previewNode === edge.node1_pub || this.previewNode === edge.node2_pub) {
            acc.push({
              source: [parseFloat(edge.node1_longitude), parseFloat(edge.node1_latitude)],
              target: [parseFloat(edge.node2_longitude), parseFloat(edge.node2_latitude)],
              value: parseInt(edge.capacity)
            });
          }
          return acc;
        }, []);

        if (this.map.getLayer('arc-preview')) {
          this.map.removeLayer('arc-preview')
        }
        if (this.map.getLayer('arc-highlight')) {
          this.map.removeLayer('arc-highlight')
        }
        const arclayer = new MapboxLayer({
          id: 'arc-preview',
          type: ArcLayer,
          data: arcs,
          opacity: 0.1,
          getColor: [129, 207, 224],
          getSourcePosition: d => d.source,
          getTargetPosition: d => d.target,
          getWidth: 2
        })

        this.map.addLayer(arclayer)
    },
    async hightlightArc(channelId) {

        const arcs = this.activeChannels.reduce((acc, edge) => {
          if (edge.channel_id == channelId) {
            acc.push({
              source: this.nodes[edge.node1_pub].position,
              target: this.nodes[edge.node2_pub].position,
              value: parseInt(edge.capacity)
            });
          }
          return acc;
        }, []);

        if (this.map.getLayer('arc-highlight')) {
          this.map.removeLayer('arc-highlight')
        }
        const arclayer = new MapboxLayer({
          id: 'arc-highlight',
          type: ArcLayer,
          data: arcs,
          opacity: 1,
          getColor: [129, 207, 224],
          getSourcePosition: d => d.source,
          getTargetPosition: d => d.target,
          getWidth: 8
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
    .map-search-button {
      width: 180px;
      position: absolute;
      bottom: 50px;
      right: 25%;
    }
    .map-zoom-button {
      width: 180px;
      position: absolute;
      bottom: 50px;
      left: 10%;
    }
  }
  #map {
    width: 100%;
    height: 100vh;;
    margin-top: -10px;
  }
  canvas {
    left: 0;
  }
  .sidebar-pane {
    position: absolute;
    top: 49px;
    width: 15%;
    min-width: 200px;
    height: calc(100vh - 80px);
    right: 0;
    background: rgba(255, 255, 255);
    .tab-row {
      width: 100%;
      display: flex;

      .tab {
        color: black;
        font-weight: 900;
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 0;
        h5 {
          margin: 10px 0 5px 0;
          padding: 0;
        }
        a {
          color: gray;
          font-weight: 500;
        }
        a:hover {
          font-weight: 900;
          color: black;
        }
      }
    }
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