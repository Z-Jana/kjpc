import request from '@/utils/requests'

export function Userlongin(query) {
  return request({
    url: '/api/admin/Admin/actionLogin',
    method: 'post',
    data: query
  })
}
