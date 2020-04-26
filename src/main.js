import Vue from 'vue'
import App from './App.vue'
import VueAnalytics from 'vue-analytics';
import './registerServiceWorker'

Vue.config.productionTip = false;

// Configuration VueAnalytics
Vue.use(VueAnalytics, {
  id: 'UA-155364703-1'
});

new Vue({
  render: h => h(App)
}).$mount('#app')
