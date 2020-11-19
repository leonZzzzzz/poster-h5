import axios from 'axios'
import qs from 'qs'
import { BASEURL, DOMAINADDRESS, ISMOBILE, BASEAPI } from '../config'
import { Toast } from 'vant'
import router from '../router'
import api from '../api'

axios.defaults.timeout = 60000 // 响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8' // 配置请求头
axios.defaults.baseURL = BASEURL

axios.interceptors.response.use(
  res => {
    console.log('返回数据', res.data)
    if (res.data.code === 20000 || res.data.code === 40001 || res.data.code === 12003) {
      return res
    } else if (res.data.code === 63101 || res.data.code === 50103) {
      // location.href = DOMAINADDRESS + '#/authorize'
      let url = ''
      let l = location
      let str = l.hash.substr(1, l.hash.length - 1)
      if (str.indexOf('?') != -1) {
        url = l.origin + l.pathname + 'POUND' + str.split('?')[0]
      } else {
        url = l.origin + l.pathname + 'POUND' + str
      }
      // let url = l.origin + l.pathname + 'POUND' + l.hash.substr(1, l.hash.length - 1)
      if (ISMOBILE) {
        console.log('手机', url)
        location.href = `${BASEAPI}/api/v1/crop/authorize/auth?requestUrl=${url}`
      } else {
        let requestUrl = url
        api.authorizeAuth({ requestUrl }).then((res) => {

        })
      }
      return Promise.reject(res)
    }
    // else if (res.data.code === 50103) {
    //   router.push(`/sidebar/login`)
    // }
    else {
      if (res.data.message) { Toast(res.data.message) }

      return Promise.reject(res)
    }
  },
  function axiosRetryInterceptor(err) {
    return Promise.reject(err)
  }
)
export const get = (url, params) => {
  return axios.get(url, { params })
}

export const post = (url, params) => {
  return axios.post(url, qs.stringify(params))
}
export const json = (url, params) => {
  return axios.post(url, params, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const upload = (url, params) => {
  return axios.post(url, params, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}