import request from '@/utils/request';

const api = window.PUBLIC_ENV_CONFIG.API;

export function insert(params) {
  return request({
    url: `${api}/SysManagement/MenuList/Insert`,
    method: 'post',
    data: params,
  });
}

export function update(params) {
  return request({
    url: `${api}/SysManagement/MenuList/Update`,
    method: 'post',
    data: params,
  });
}

export function remove(params) {
  return request({
    url: `${api}/SysManagement/MenuList/Delete`,
    method: 'post',
    data: params,
  });
}

export function queryList(params) {
  return request({
    url: `${api}/SysManagement/MenuList/List`,
    params,
  });
}

export function queryDetail(params) {
  return request({
    url: `${api}/SysManagement/MenuList/Detail`,
    params,
  });
}
