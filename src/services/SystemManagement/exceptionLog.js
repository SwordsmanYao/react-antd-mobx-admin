import request from '@/utils/request';

const api = window.PUBLIC_ENV_CONFIG.API;

export function remove(params) {
  return request({
    url: `${api}/SysManagement/ExceptionLog/Delete`,
    method: 'post',
    data: params,
  });
}

export function queryList(params) {
  return request({
    url: `${api}/SysManagement/ExceptionLog/List`,
    params,
  });
}
