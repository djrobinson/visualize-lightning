<template>
  <div class="about">
    <LoadNetwork />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LoadNetwork from '@/components/LoadNetwork.vue'; // @ is an alias to /src

@Component({
  components: {
    LoadNetwork,
  },
})
export default class About extends Vue {}
</script>
<style lang="scss">
  .home {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;

  }
</style>
