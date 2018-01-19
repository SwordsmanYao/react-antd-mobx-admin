import request from '../utils/request';

const api = window.PUBLIC_ENV_CONFIG.API;

export async function query(params) {
  return request({
    url: `${api}/demo/query`,
    data: params,
  });
}