module.exports = {
  publicPath: './',
  productionSourceMap: false,
  lintOnSave: false, // 不校验代码格式

  devServer: {
    host: '0.0.0.0',
    port: '',
    disableHostCheck: true,
    proxy: {
      '/athena': {
        target: 'http://x.wego168.com/',
        changeOrigin: true,
        pathRewrite: {
          '/athena': 'athena'
        }
      },
      '/hyzs': {
        target: 'http://x.wego168.com/',
        changeOrigin: true,
        pathRewrite: {
          '/hyzs': 'hyzs'
        }
      },
      '/lbxyh': {
        target: 'http://x.wego168.com/',
        changeOrigin: true,
        pathRewrite: {
          '/lbxyh': 'lbxyh'
        }
      },
      '/wghjy': {
        target: 'http://x.wego168.com/',
        changeOrigin: true,
        pathRewrite: {
          '/wghjy': 'wghjy'
        }
      },
      '/accelerator_test': {
        target: 'http://abs.wego168.com/',
        pathRewrite: {
          '/accelerator_test': 'accelerator_test'
        }
      }
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-pxtorem')({
            rootValue: 37.5, // 换算的基数
            selectorBlackList: ['weui', 'mu'], // 忽略转换正则匹配项
            propList: ['*'],
          }),
        ]
      }
    }
  }
}