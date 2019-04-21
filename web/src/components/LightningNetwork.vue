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
class ArcBrushingLayer extends ArcLayer {
      getShaders() {
        // use customized shaders
        return Object.assign({}, super.getShaders(), {
          inject: {
            'vs:#decl': `
uniform vec2 mousePosition;
uniform float brushRadius;
            `,
            'vs:#main-end': `
float brushRadiusPixels = project_scale(brushRadius);

vec2 sourcePosition = project_position(instancePositions.xy);
bool isSourceInBrush = distance(sourcePosition, mousePosition) <= brushRadiusPixels;

vec2 targetPosition = project_position(instancePositions.zw);
bool isTargetInBrush = distance(targetPosition, mousePosition) <= brushRadiusPixels;

if (!isSourceInBrush && !isTargetInBrush) {
  vColor.a = 0.0;
}
            `,
            'fs:#main-start': `
if (vColor.a == 0.0) discard;
            `
          }
        });
      }

      draw(opts) {
        const {brushRadius = 50, mousePosition} = this.props;
        // add uniforms
        const uniforms = Object.assign({}, opts.uniforms, {
          brushRadius: brushRadius,
          mousePosition: mousePosition ?
            this.projectPosition(this.unproject(mousePosition)).slice(0, 2) : [0, 0]
        });
        super.draw(Object.assign({}, opts, {uniforms}));
      }
  }

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
        pitch: 45,
        bearing: 0,
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
          onHover: d => {
            console.log("Maybe")
          },
          radiusMinPixels: 3,
          data: this.scatterData,
      })

      map.addLayer(arclayer)
      map.addLayer(scatterplotlayer)

      var popup = new mapboxgl.Popup({closeOnClick: false})
        .setLngLat([-96, 37.8])
        .setHTML('<h1>Hello World!</h1>')
        .addTo(map);
      map.on('mousemove', ({point, x, y}) => {
        console.log("Movinnn", point, x, y)
        if (arclayer) {
          arclayer.setProps({mousePosition: [point.x, point.y]});
        }
      });
      var popup = new mapboxgl.Popup({ offset: 25 })
      .setText('Construction on the Washington Monument began in 1848.');
      
      // create DOM element for the marker
      var el = document.createElement('div');
      el.id = 'marker';
      
      // create the marker
      new mapboxgl.Marker(el)
      .setLngLat([-118.35, 33.83])
      .setPopup(popup) // sets a popup on this marker
      .addTo(map);
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
  #marker {
  background-image: url('https://docs.mapbox.com/mapbox-gl-js/assets/washington-monument.jpg');
  background-size: cover;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  }
</style>