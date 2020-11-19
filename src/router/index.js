import Vue from 'vue'
import VueRouter from 'vue-router'
import sidebarDev from './sidebar-dev'
// import mateCenter from './mate-center'

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    ...sidebarDev
    // ...mateCenter,
  ]
});
