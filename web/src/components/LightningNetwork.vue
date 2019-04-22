<template>

    <div class="canvas-container">
      <div id="map"></div>
      <ChannelList
        v-bind:channels="activeChannels"
        v-on:select-channelid="selectChannel($event)"
      />
      <NodeList 
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
      this.edges = response.data.edges;
      this.popups = [];
      this.recalculateArcs();
      this.nodes = response.data.edges.reduce((acc, edge) => {
        if (!acc[edge.node1_pub] && parseFloat(edge.node1_longitude) && parseFloat(edge.node1_latitude)) {
          acc[edge.node1_pub] = {
            public_key: edge.node1_pub,
            position: [parseFloat(edge.node1_longitude), parseFloat(edge.node1_latitude)],
            color: [0, 0, 0],
            radius: 1000,
            edgeCount: 1,
            alias: edge.node1_alias,
            ip: edge.node1_ip_address,
            city: edge.node1_city,
            country: edge.node1_country_name,
            region: edge.node1_region_name
          }
        }
        if (!acc[edge.node2_pub] && parseFloat(edge.node2_longitude) && parseFloat(edge.node2_latitude)) {
          acc[edge.node2_pub] = {
            public_key: edge.node2_pub,
            position: [parseFloat(edge.node2_longitude), parseFloat(edge.node2_latitude)],
            color: [0, 0, 0],
            radius: 1000,
            edgeCount: 1,
            alias: edge.node2_alias,
            ip: edge.node2_ip_address,
            city: edge.node2_city,
            country: edge.node2_country_name,
            region: edge.node2_region_name
          }
        }
        if (acc[edge.node2_pub]) {
          acc[edge.node2_pub].edgeCount++;
        }
        if (acc[edge.node2_pub]) {
          acc[edge.node2_pub].edgeCount++;
        }
        return acc;
      }, {})
      this.scatterData = Object.values(this.nodes).sort((a, b) => (a.edgeCount < b.edgeCount) ? 1 : -1);

      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [5,0],
        pitch: 22 ,
        bearing: 0,
        zoom: 1
      });
      this.map = map;
      map.on('load', () => {
        this._mapLoaded(map)
      });
  },
  methods: {
    _mapLoaded(map) {
  
      const arclayer = new MapboxLayer({
        id: 'arc',
        type: ArcLayer,
        data: this.arcs,
        getSourcePosition: d => d.source,
        getTargetPosition: d => d.target,
        getWidth: 5
      })

      map.addLayer(arclayer)

      const scatterplotlayer = new MapboxLayer({
          id: 'scatter',
          type: ScatterplotLayer,
          getRadius: d => d.radius,
          getColor: d => d.color,
          radiusMinPixels: 3,
          data: this.scatterData,
      })

      
      map.addLayer(scatterplotlayer)

      const popups = this.popups;
      const scatterData = this.scatterData;
      const boundSetNodes = this.setNodesInView.bind(this);
       map.on('click', function (e) {
        console.log('reg click')
        const currZoom = map.getZoom();
        if (currZoom === 8) {
          this.nodesInView = []
          map.setZoom(1);
          map.setCenter([10,0]);
          if (this.popups) {
            this.popups.forEach(popup => popup.remove());
          }
        } else {
          map.setZoom(8);
          map.setCenter(e.lngLat);
          const bounds = map.getBounds();
          boundSetNodes(bounds);
          this.popups = popups;
        }
        var features = map.queryRenderedFeatures(e.point, { layers: ['scatter', 'arc'] });

        if (!features.length) {
            return;
        }

        var feature = features[0];
        //Use Feature and put your code
        // Populate the popup and set its coordinates
        // based on the feature found.
        var popup = new mapboxgl.Popup()
            .setLngLat(feature.geometry.coordinates)
            .setHTML(feature.properties.description)
            .addTo(map);
      });
    },
    drawArcs() {
      const arclayer = new MapboxLayer({
        id: 'arc',
        type: ArcLayer,
        data: this.arcs,
        getSourcePosition: d => d.source,
        getTargetPosition: d => d.target,
        getWidth: 5
      })

      this.map.addLayer(arclayer)
    },
    setNodesInView(bounds) {
      this.nodesInView = this.scatterData.filter(node => {
        if (bounds._sw.lng < node.position[0] && node.position[0] < bounds._ne.lng && bounds._sw.lat < node.position[1] && node.position[1] < bounds._ne.lat) {
          const currentNode = node;
            if (currentNode && currentNode.position) {
              var popup = new mapboxgl.Popup({closeOnClick: false})
              .setLngLat(currentNode.position)
              .setHTML(`
                <p>Public Key: ${currentNode.public_key}</p>
                <p>Alias: ${currentNode.alias || ''}</p>
                <p>Color: ${currentNode.color}</p>
                <p>Channel Count: ${currentNode.edgeCount}</p>
                <p>IP: ${currentNode.ip || ''}</p>
                <p>City: ${currentNode.city}</p>
                <p>Region: ${currentNode.region}</p>
                <p>IP: ${currentNode.country}</p>
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
    selectNode(pub_key) {
      this.map.removeLayer('arc')
      console.log("Pusgb: ", pub_key)
      const selNode = this.nodes[pub_key]
      this.selectedNode = pub_key;
      this.recalculateArcs()
      this.drawArcs()
      this.map.setZoom(1);
      this.map.setCenter([0,0]);
    },
    recalculateArcs() {
      const edges = this.edges
      this.activeChannels = [];
      const arcs = edges.reduce((acc, edge) => {
        if (this.selectedNode === edge.node1_pub || this.selectedNode === edge.node2_pub) {

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