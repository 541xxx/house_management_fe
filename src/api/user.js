import request from '@/utils/request';

export function postSignIn(data) {
  return request.post('/signin/', data);

}

export function getSignUpCode(params) {
  return request.get('/sms/signup/', params);
}


export function postSignUp(data) {
  return request.post('/signup/', data);
}

export function getUserInfo() {
  return request.get('/user/');
}


export function updatePassword(data) {
  return request.patch('/user/password/', data);
}




