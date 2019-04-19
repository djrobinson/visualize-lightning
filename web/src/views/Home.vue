<template>
  <div class="home">
    <LightningNetwork />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LightningNetwork from '@/components/LightningNetwork.vue'; // @ is an alias to /src

@Component({
  components: {
    LightningNetwork,
  },
})
export default class Home extends Vue {}
</script>
<style lang="scss">
  .home {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;

  }
</style>
