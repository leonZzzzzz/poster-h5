const IS_DEV = process.env.NODE_ENV == 'development'

// 接口地址
export const BASEURL = IS_DEV ? 'wghjy' : location.origin + location.pathname.match(/\/\w+/g)[0]

// 图片前缀
export const IMGURL = 'http://athena-1255600302.cosgz.myqcloud.com'

// 可信域名地址
// export const DOMAINADDRESS = 'http://221354i74m.iask.in/'
// export const DOMAINADDRESS = 'http://x.wego168.com/hyzs/scrm/'
export const DOMAINADDRESS = IS_DEV ? location.origin + '/wghjy' + '/H5/' : location.origin + location.pathname.match(/\/\w+/g)[0] + '/H5/'
export const BASEAPI = IS_DEV ? location.origin + '/wghjy' : location.origin + location.pathname.match(/\/\w+/g)[0]

// 应用id
export const AGENTID = '1000005'

// 判断当前设备是移动端或是pc端
export const ISMOBILE = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i) || false