import request from '@/utils/request';

export function getHouses(params) {
  return request.get('/houses/', params);
}

export function releaseHouses (data) {
  return request.patch('/houses/release/', data);
}

export function postRepetition (data) {
  return request.post(`/houses/repetition/`, data);
}

export function deleteHouses (data) {
  return request.delete('/houses/trash/', data);
}
