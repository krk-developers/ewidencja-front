import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource';
import {store} from './store/store.js';

Vue.config.productionTip = false

Vue.use(VueResource);

export const eventBus = new Vue();

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
