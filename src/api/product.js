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
      data: params
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
      data: params
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
      data: params
    })
  }
}
/**
  * @description   商品
  * @Data 2019/8/5
  * @author
  */
export const goodsPageApi = {
  /**
  * @description   商品-分页
  * @Data 2019/8/5
  */
  getGoodsPage: (params) => {
    return request({
      url: `/api/admin/Goods/index`,
      method: 'post',
      data: params
    })
  },
  /**
  * @description   新增或修改-商品
  * @Data 2019/8/5
  */
  addUpdateGoods: (params) => {
    return request({
      url: `/api/admin/Goods/save`,
      method: 'post',
      data: params
    })
  },
  /**
  * @description   删除-商品
  * @Data 2019/8/5
  */
  deleteGoods: (params) => {
    return request({
      url: `/api/admin/Goods/deleted`,
      method: 'post',
      data: params
    })
  }
}
