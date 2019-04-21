<template>
  <div class="network-container">
    <div class="canvas-container">
      <div id="map"></div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import {Deck, MapController} from '@deck.gl/core';
import {MapboxLayer} from '@deck.gl/mapbox';
import {GeoJsonLayer, ArcLayer, ScatterplotLayer} from '@deck.gl/layers';
import {scaleQuantile} from 'd3-scale';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';

export default Vue.extend({
  data(){
      console.log("Sanity check")
      return {
          deck: null,
          graph: null,
          pong: null,
          arcs: null,
          nodes: null,
          map: null,
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
      console.log("What is the response for network map: ", response);
      this._recalculateArcs(response.data.edges);
      this.nodes = response.data.edges.reduce((acc, edge) => {
        if (!acc[edge.node1_pub]) {
          acc[edge.node1_pub] = {
            position: [parseFloat(edge.node1_longitude), parseFloat(edge.node1_latitude)],
            color: [0, 0, 0],
            radius: 1000
          }
        }
        if (!acc[edge.node2_pub]) {
          acc[edge.node2_pub] = {
            position: [parseFloat(edge.node2_longitude), parseFloat(edge.node2_latitude)],
            color: [0, 0, 0],
            radius: 1000
          }
        }
        return acc;
      }, {})
      this.scatterData = Object.values(this.nodes);
      console.log("howd nodes end up ", this.scatterData)


      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [-118.35, 33.83],
        pitch: 30,
        zoom: 5
      });
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
        getWidth: 2
      })
      const scatterplotlayer = new MapboxLayer({
          id: 'scatter',
          type: ScatterplotLayer,
          getRadius: d => d.radius,
          getColor: d => d.color,
          radiusMinPixels: 3,
          data: this.scatterData
      })

      map.addLayer(scatterplotlayer)
      map.addLayer(arclayer)
    },
    _recalculateArcs(edges) {
      if (!edges) {
        return;
      }

      const arcs = edges.map(edge => {
        return {
          source: [parseFloat(edge.node1_longitude), parseFloat(edge.node1_latitude)],
          target: [parseFloat(edge.node2_longitude), parseFloat(edge.node2_latitude)],
          value: parseInt(edge.capacity)
        };
      });
      

      const scale = scaleQuantile()
        .domain(arcs.map(a => Math.abs(a.value)))

      arcs.forEach(a => {
        a.gain = Math.sign(a.value);
        a.quantile = scale(Math.abs(a.value));
      });
      console.log("Calculated arcs: ", arcs);
      this.arcs = arcs;
    },
  }
})
</script>

<style lang="scss">
  .canvas-container {
    position: float;
    width: 100vw;
    height: 100vh;
    left: 0;
    margin: 0px;
    padding: 0px;
    border: solid 1px black;
  }
  #map {
    width: 100%;
    height: 800px;
  }
  canvas {
    left: 0;
  }
</style>