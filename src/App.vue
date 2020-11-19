<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
// @import url('../node_modules/reset-css/less/reset.less');
// @import url('./assets/css/reset.css');
@import url("//at.alicdn.com/t/font_2082024_ciq0mw5dqr8.css");
body {
  width: 100%;
  height: 100%;
  background-color: #fff;
  font-size: 14px !important;
}
#app {
  font-family: "Microsoft YaHei", Helvetica, "SimSun", Verdana, Arial,
    sans-serif;
  // font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  // font-family: -apple-system-font, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
