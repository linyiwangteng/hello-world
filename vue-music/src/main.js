import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueLazyLoad from 'vue-lazyload'
import fastclick from 'fastclick'

import 'common/stylus/index.styl'

Vue.config.productionTip = false

fastclick.attach(document.body)
Vue.use(VueLazyLoad, {
  loading: require('common/images/default.png')
})
/* eslint-disable no-new */
Vue.prototype.$http = axios
new Vue({
  el: '#app',
  router,
  axios,
  render: h => h(App)
})