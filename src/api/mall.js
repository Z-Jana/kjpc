import request from '@/utils/requests'
// const mpapi = '192.168.1.137:8050'
/**
  * @description   商城-幻灯片1，导航图标2，广告位3
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
  * @description   新增或修改-广告等
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
  * @description   删除-广告等
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

/**
  * @description   商城-商品推荐栏目
  * @Data 8/5
  */
export const parametersPageApi = {
  /**
  * @description   商品推荐栏目-分页
  * @Data 2019/8/5
  */
  getParametersPage: (params) => {
    return request({
      url: `/api/admin/GoodsColumn/index`,
      method: 'post',
      params
    })
  },
  /**
  * @description   新增或修改-商品推荐栏目
  * @Data 2019/8/5
  */
  addUpdateParameters: (params) => {
    return request({
      url: `/api/admin/GoodsColumn/save`,
      method: 'post',
      params
    })
  },
  /**
  * @description   删除-商品推荐栏目
  * @Data 2019/8/5
  */
  deleteParameters: (params) => {
    return request({
      url: `/api/admin/GoodsColumn/deleted`,
      method: 'post',
      params
    })
  }
}

