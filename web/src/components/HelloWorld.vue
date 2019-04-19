<template>
  <div class="canvas-container">
    <DeckGL
        layers={this._renderLayers()}
        initialViewState={INITIAL_VIEW_STATE}
        viewState={viewState}
        controller={controller}
    >
    </DeckGL>
  </div>
</template>
<script>
import {Deck, MapController} from '@deck.gl/core';
import {GeoJsonLayer} from '@deck.gl/layers';
import axios from 'axios';

export default {
    data(){
        console.log("Sanity check")
        return {
            deck: null,
            graph: null,
            pong: null,
            arcs: null
        }
    },
    mounted(){
        axios
          .get('http://localhost:3000/api/graph/describe')
          .then(response => {
            this.graph = response.data
            console.log("What are describe nodes looking like?", this.graph.nodes)
            console.log("What are describe edges looking like?", this.graph.edges)
          })

        axios
          .get('https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/arc/counties.json')
          .then(response => {
            this.data = response
            console.log("What are describe nodes looking like?", this.graph.nodes)
            console.log("What are describe edges looking like?", this.graph.edges)
          })
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
      .range(inFlowColors.map((c, i) => i));

    arcs.forEach(a => {
      a.gain = Math.sign(a.value);
      a.quantile = scale(Math.abs(a.value));
    });
  },
  _renderLayers() {
    const data = this.data 
    const strokeWidth = 2

    return [
      new GeoJsonLayer({
        id: 'geojson',
        data,
        stroked: false,
        filled: true,
        getFillColor: [0, 0, 0, 0],
        onHover: this._onHoverCounty,
        onClick: this._onSelectCounty,
        pickable: true
      }),
      new ArcLayer({
        id: 'arc',
        data: this.arcs,
        getSourcePosition: d => d.source,
        getTargetPosition: d => d.target,
        getSourceColor: d => (d.gain > 0 ? inFlowColors : outFlowColors)[d.quantile],
        getTargetColor: d => (d.gain > 0 ? outFlowColors : inFlowColors)[d.quantile],
        getWidth: strokeWidth
      })
    ];
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