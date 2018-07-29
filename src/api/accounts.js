
import request from '@/utils/request';


export function getAccounts() {
  return request.get('/accounts/');
}
export function addAccount(data) {
  return request.post('/accounts/', data);
}

export function deleteAccounts(id) {
  return request.delete(`/accounts/${id}`);
}

export function updataAccount(id, data) {
  return request.patch(`/accounts/${id}/`, data);
}

export function getPlatforms() {
  return request.get('/platforms/');
} 