// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import routes from './router'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import stores from './store'
import apiRequestHandler from './util/apiRequestHandler'
import VueLazyload from 'vue-lazyload'
import Filters from './filters'

import '../static/css/base.css'
import '../static/css/checkout.css'
import '../static/css/login.css'
import '../static/css/product.css'


Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueLazyload, {
  loading: './static/loading-svg/loading-bars.svg'
})

Vue.filter('currency',Filters.currency)
const router = new VueRouter({
  routes
})
Vue.prototype.$http = apiRequestHandler
Vue.config.productionTip = false

const store = new Vuex.Store(stores)

/* eslint-disable no-new */
new Vue({
  el:'#app',
  router,
  store,
  components: {
    App
  },
  render: h => h(App)
})
