import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './api'
import { IMGURL, DOMAINADDRESS, AGENTID, ISMOBILE, BASEURL, BASEAPI } from './config'
import 'lib-flexible/flexible'
import { Dialog, Image as VanImage, Tab, Tabs, Swipe, SwipeItem, Button, Uploader } from 'vant'
import infiniteScroll from 'vue-infinite-scroll'
import './utils/emotionmethod'
import './assets/css/emotion.css'
import VueClipboard from 'vue-clipboard2'
// import VCharts from 'v-charts'
import VConsole from 'vconsole'

Vue.config.productionTip = false
Vue.use(Dialog)
Vue.use(VueClipboard)
// Vue.use(VCharts)
Vue.use(VanImage);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Button);
Vue.use(Uploader);
Vue.use(infiniteScroll)
// if (BASEURL == 'wghjy') {
//   var vConsole = new VConsole()
// }
if (BASEURL == 'wghjy' || BASEURL == 'https://x.wego168.com/wghjy') {
  var vConsole = new VConsole()
}

Vue.prototype.$http = api
Vue.prototype.imgUrl = IMGURL
Vue.prototype.domainAddress = DOMAINADDRESS
Vue.prototype.agentId = AGENTID
Vue.prototype.isMobile = ISMOBILE
Vue.prototype.baseApi = BASEAPI

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
