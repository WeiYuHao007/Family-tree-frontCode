// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router/router'
import axios from 'axios'
import echarts from 'echarts'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'

Vue.use(ElementUI)

// 引用axios，并设置基础URL为后端服务器api地址
axios.defaults.baseURL = process.env.API_ROOT
// 将API方法绑定到全局
Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts
axios.defaults.withCredentials = true
Vue.config.productionTip = false

// Bus
Vue.prototype.bus = new Vue()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  components: { App },
  template: '<App/>'
})
