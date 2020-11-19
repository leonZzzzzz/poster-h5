<template>
  <div v-if="loading" class="loading-overlay">
    <img class="loading-img" src="../../assets/loading.gif" />
  </div>
</template>

<script>
export default {
  props: {
    loading: {
        type: Boolean,
        default: false
    },
  },
  methods: {
   
  }
}
</script>

<style lang="less" scoped>
.loading-overlay {
  z-index: 9999;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0px;
  text-align: center;
  img {
    margin-top: 200px;
    width: 62px;
  }
}
</style>