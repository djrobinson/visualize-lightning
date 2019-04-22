import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import LightningNetwork from './components/LightningNetwork.vue';
import ChannelList from './components/ChannelList.vue';
import NodeList from './components/NodeList.vue';
import ChannelExplorer from './components/ChannelExplorer.vue';

Vue.config.productionTip = false;

Vue.component('NodeList', NodeList);
Vue.component('LightningNetwork', LightningNetwork);
Vue.component('ChannelList', ChannelList);
Vue.component('ChannelExplorer', ChannelExplorer);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

