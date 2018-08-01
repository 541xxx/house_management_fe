

import axios from 'axios';
import { message } from 'antd';
import Cookies from 'js-cookie';
import history from '@/history';
const baseUrl = process.env.REACT_APP_BSSE_URL;
let ret = ({ method = 'GET', url = '', params = {}, data } = {}) => {
  const hasParam = url.match(/\?/);
  const urlParams = Object.keys(params).reduce((previousValue, key, i) =>
    previousValue + `${(i || hasParam) ? '&' : '?'}${key}=${encodeURIComponent(params[key])}`, '')
  return axios(`${baseUrl + url + urlParams}`, {
    headers: {
      'Authorization': `${Cookies.get('user_token')}` ? `FANG ${Cookies.get('user_token')}` : ''
    },
    method,
    data
  });
}

axios.interceptors.response.use(res => {
  const { status, data } = res;
  return Promise.resolve({
    status,
    data
  })
}, (err) => {
  if ([401].includes(err.response.status)) {
    history.push('/user/login');
    err.response.data.message = '';
  }
  err.response.data.message && message.error(err.response.data.message);
  return Promise.reject({
    data: err.response.data,
    status: err.response.status 
  });
});

ret.get = (url, params) => ret({ url, params });
ret.post = (url, data) => ret({ method: 'POST', url, data });
ret.put = (url, data) => ret({ method: 'PUT', url, data });
ret.patch = (url, data) => ret({ method: 'PATCH', url, data });
ret.delete = (url, data) => ret({ method: 'delete', url, data });

export default ret;