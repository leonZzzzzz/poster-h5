import { get, post } from '../utils/http'

export default {
  // 海报素材分组
  posterClassify: (params) => {
    return get('api/admin/v1/materialGroup/getSysList', params)
  },
  // 海报素材列表
  posterMatterList: (params) => {
    return get('api/admin/v1/material/sysPage', params)
  },
  // 海报素材详情
  posterMatterDetail: (params) => {
    return get('api/admin/v1/materialPoster/getDetail', params)
  },
  // 渠道活码
  qudaoHcode: (params) => {
    return get('api/admin/v1/dynamicQrcode/page', params)
  },
  // 图片转base64
  imgToBase64: (params) => {
    return get('api/admin/v1/dynamicQrcode/imgToBase64', params)
  },
}