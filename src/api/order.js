// 支付相关逻辑接口

import request from '@/utils/request';

export function postRenewal(data) {
  return request.post('/order/', data);
}

export function getOrders(params) {
  return request.get('/order/', params);
}
