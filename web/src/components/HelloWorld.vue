<template>
    <div style="height: 100%">
          <h1>Test</h1>
          <canvas id="my-canvas"></canvas>
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
            pong: null
        }
    },
    mounted(){
        const GEOJSON =
          'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces_shp.geojson'; //eslint-disable-line

        const INITIAL_VIEW_STATE = {
          latitude: 40,
          longitude: -100,
          zoom: 3,
          bearing: 30,
          pitch: 30
        };
        
        axios
          .get('http://localhost:3000/api/graph/describe')
          .then(response => {
            
            this.graph = response.data
            console.log("What are describe nodes looking like?", this.graph.nodes)
            console.log("What are describe edges looking like?", this.graph.edges)
          })


        this.deck = new Deck({
          canvas: "my-canvas",
          width: '100%',
          height: '100%',
          initialViewState: INITIAL_VIEW_STATE,
          controller: MapController,
          layers: [
            new GeoJsonLayer({
              data: GEOJSON,
              stroked: true,
              filled: true,
              lineWidthMinPixels: 2,
              opacity: 0.4,
              getLineColor: () => [255, 100, 100],
              getFillColor: () => [200, 160, 0, 180]
            })
          ]
        })
  }
}
</script>