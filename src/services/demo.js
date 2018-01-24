import request from '../utils/request';

const api = window.PUBLIC_ENV_CONFIG.API;

export function query(params) {
  return request({
    url: `${api}/demo/query`,
    params: params,
  });
}

export function add(params) {
  return request({
    url: `${api}/demo/add`,
    method: 'post',
    data: params,
  });
}