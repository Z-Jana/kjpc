import request from '@/utils/requests'
/**
  * @description   商品管理-商品分类
  * @Data 8/9
  */
export const goodsCategoryPageApi = {
  /**
  * @description   商品分类-分页
  * @Data 2019/8/5
  */
  getGoodsCategoryPage: (params) => {
    return request({
      url: `/api/admin/GoodsCategory/index`,
      method: 'post',
      params
    })
  },
  /**
  * @description   新增或修改-商品分类
  * @Data 2019/8/5
  */
  addUpdateGoodsCategory: (params) => {
    return request({
      url: `/api/admin/GoodsCategory/save`,
      method: 'post',
      params
    })
  },
  /**
  * @description   删除-商品分类
  * @Data 2019/8/5
  */
  deleteGoodsCategory: (params) => {
    return request({
      url: `/api/admin/GoodsCategory/deleted`,
      method: 'post',
      params
    })
  }
}
