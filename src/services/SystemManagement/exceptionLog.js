import request from '@/utils/request';

const api = window.PUBLIC_ENV_CONFIG.API;

export function queryList(params) {
  return request({
    url: `${api}/SysManagement/ExceptionLog/List`,
    params,
  });
}