import request from '@/utils/requests'
// const mpapi = '192.168.1.137:8050'
/**
  * @description   商城幻灯片
  * @Data 8/5
  */

export const powerpointPageApi = {
  /**
  * @description   广告等-分页
  * @Data 2019/8/5
  */
  getPowerpointPage: (params) => {
    return request({
      url: `/api/admin/Advertise/index`,
      method: 'post',
      params
    })
  },
  /**
  * @description   新增或修改广告等
  * @Data 2019/8/5
  */
  addUpdatePowerpoint: (params) => {
    return request({
      url: `/api/admin/Advertise/save`,
      method: 'post',
      params
    })
  },
  /**
  * @description   新增或修改广告等
  * @Data 2019/8/5
  */
  delPowerpoint: (params) => {
    return request({
      url: `/api/admin/Advertise/deleted`,
      method: 'post',
      params
    })
  }

}
