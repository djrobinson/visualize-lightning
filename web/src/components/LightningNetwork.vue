<template>
  <div class="network-container">
    <div class="canvas-container">
      <div id="map"></div>
    </div>
  </div>
</template>
<script>
import {Deck, MapController} from '@deck.gl/core';
import {MapboxLayer} from '@deck.gl/mapbox';
import {GeoJsonLayer, ArcLayer, ScatterplotLayer} from '@deck.gl/layers';
import {scaleQuantile} from 'd3-scale';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';

export default {
    data(){
        console.log("Sanity check")
        return {
            deck: null,
            graph: null,
            pong: null,
            arcs: null,
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
    mounted(){
        // axios
        //   .get('http://localhost:3000/api/graph/describe')
        //   .then(response => {
        //     this.graph = response.data
        //     console.log("What are describe nodes looking like?", this.graph.nodes)
        //     console.log("What are describe edges looking like?", this.graph.edges)
        //   })
        mapboxgl.accessToken = 'pk.eyJ1IjoiZGFubnkxcm9iaW5zb24iLCJhIjoiY2p1bTExc21tMHliNzN5bXFoNGZua3MzZyJ9.4RybkDpAAixpKuuCmTeEyA'
        axios
          .get('https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/arc/counties.json')
          .then(response => {
            this.data = response.data.features
            console.log("What are describe nodes looking like?", this.data)
            this._recalculateArcs(this.data)
            console.log("Did arcs work? ", this.data)

          })

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
        
        const geojsonlayer = new MapboxLayer({
          id: 'geojson',
          type: GeoJsonLayer,
          data: this.data,
          stroked: false,
          filled: true,
          getFillColor: [0, 0, 0, 0],
          pickable: true
        })
        const arclayer = new MapboxLayer({
          id: 'arc',
          type: ArcLayer,
          data: this.arcs,
          getSourcePosition: d => d.source,
          getTargetPosition: d => d.target,
          getWidth: 2
        })

        map.addLayer(arclayer)
        map.addLayer(geojsonlayer)

        
      },
      _recalculateArcs(data, selectedCounty = null) {
        if (!data) {
          return;
        }
        if (!selectedCounty) {
          selectedCounty = data.find(f => f.properties.name === 'Los Angeles, CA');
        }
        const {flows, centroid} = selectedCounty.properties;

        const arcs = Object.keys(flows).map(toId => {
          const f = data[toId];
          return {
            source: centroid,
            target: f.properties.centroid,
            value: flows[toId]
          };
        });

        const scale = scaleQuantile()
          .domain(arcs.map(a => Math.abs(a.value)))

        arcs.forEach(a => {
          a.gain = Math.sign(a.value);
          a.quantile = scale(Math.abs(a.value));
        });
        this.arcs = arcs;
      },
      _renderLayers() {
        const data = this.data 
        const strokeWidth = 2
        const deck = new Deck({
          canvas: 'network-canvas',
          initialViewState: this.INITIAL_VIEW_STATE,
          controller: true,
          layers: [
              new GeoJsonLayer({
                id: 'geojson',
                data,
                stroked: false,
                filled: true,
                getFillColor: [0, 0, 0, 0],
                pickable: true
              }),
              new ArcLayer({
                id: 'arc',
                data: this.arcs,
                getSourcePosition: d => d.source,
                getTargetPosition: d => d.target,
                getWidth: strokeWidth
              })
            ]
        })
        return deck;
      }
    }
    
}
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
    height: 500px;
  }
  canvas {
    left: 0;
  }
</style>