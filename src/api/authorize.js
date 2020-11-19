import { get, post, json } from '../utils/http'

export default {
  // 授权链接获取code, 参数：requestUrl（需要授权页面路径）
  authorizeAuth: (params) => {
    return get('api/v1/crop/authorize/auth', params)
  },
  // 授权登录，参数：code  获取userid
  authorizeLogin: (params) => {
    return post('api/v1/crop/authorize/H5login', params)
  },
  // 判断当前登录状态(返回值userId本地id（Wu），wxUserId微信id（f8a8112b926446f398f58edbd421c003）)
  getLoginStatus: (params) => {
    return get('api/v1/crop/authorize/getLoginStatus', params)
  },
  // 获取成员信息
  getUserInfo: () => {
    return get('api/v1/crop/authorize/getUserInfo')
  },
  // 非企业成员账号密码登陆
  UnMemberCompLogin: (params) => {
    return post('api/v1/scrm/account/login', params)
  },

}