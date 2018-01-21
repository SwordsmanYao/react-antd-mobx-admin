import request from '../utils/request';

const api = window.PUBLIC_ENV_CONFIG.API;

// 登录
export function login(params) {
  return request({
    url: `${api}/Login/SignIn`,
    method: 'post',
    data: params,
  });
}

