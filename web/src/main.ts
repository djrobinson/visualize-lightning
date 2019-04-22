import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import './registerServiceWorker';
import LightningNetwork from '@/components/LightningNetwork'; // @ is an alias to /src
import NodeList from '@/components/NodeList'; 
import ChannelList from '@/components/ChannelList';
import ChannelExplorer from '@/components/ChannelExplorer';

Vue.config.productionTip = false;

Vue.component('NodeList', NodeList);
Vue.component('LightningNetwork', LightningNetwork)
Vue.component('ChannelList', ChannelList)
Vue.component('ChannelExplorer', ChannelExplorer)
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

