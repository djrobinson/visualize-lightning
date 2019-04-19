<template>
  <div class="network-container">
    <img width="100%" height="100%" src="https://api.mapbox.com/styles/v1/mapbox/light-v9/static/auto/1280x700@2x?access_token=pk.eyJ1IjoiZGFubnkxcm9iaW5zb24iLCJhIjoiY2p1bTExc21tMHliNzN5bXFoNGZua3MzZyJ9.4RybkDpAAixpKuuCmTeEyA" alt="Mapbox Map of -73.7638,42.6564">
    <div class="canvas-container">
      <canvas id="network-canvas"></canvas>
    </div>
  </div>
</template>
<script>
import {Deck, MapController} from '@deck.gl/core';
import {GeoJsonLayer, ArcLayer} from '@deck.gl/layers';
import {scaleQuantile} from 'd3-scale';
import axios from 'axios';

export default {
    data(){
        console.log("Sanity check")
        return {
            deck: null,
            graph: null,
            pong: null,
            arcs: null,
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

        axios
          .get('https://api.mapbox.com/styles/v1/mapbox/light-v9/static/-100.6852,35.3241,5,0,0/300x200?access_token=pk.eyJ1IjoiZGFubnkxcm9iaW5zb24iLCJhIjoiY2p1bTExc21tMHliNzN5bXFoNGZua3MzZyJ9.4RybkDpAAixpKuuCmTeEyA')
        axios
          .get('https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/arc/counties.json')
          .then(response => {
            this.data = response.data
            console.log("What are describe nodes looking like?", this.data)
            this.deck = this._renderLayers()
          })
    },
    methods: {
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
          .range(inFlowColors.map((c, i) => i));

        arcs.forEach(a => {
          a.gain = Math.sign(a.value);
          a.quantile = scale(Math.abs(a.value));
        });
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
  #my-canvas {
    position: relative;
  }
</style>