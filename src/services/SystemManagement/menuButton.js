import request from '@/utils/request';

const api = window.PUBLIC_ENV_CONFIG.API;

export function queryMenuButtonTree(params) {
  return request({
    url: `${api}/SysManagement/MenuButton/Tree`,
    params,
  });
}

export function insert(params) {
  return request({
    url: `${api}/SysManagement/MenuButton/Insert`,
    method: 'post',
    data: params,
  });
}

export function update(params) {
  return request({
    url: `${api}/SysManagement/MenuButton/Update`,
    method: 'post',
    data: params,
  });
}

export function remove(params) {
  return request({
    url: `${api}/SysManagement/MenuButton/Delete`,
    method: 'post',
    data: params,
  });
}

export function queryList(params) {
  return request({
    url: `${api}/SysManagement/MenuButton/List`,
    params,
  });
}

export function queryDetail(params) {
  return request({
    url: `${api}/SysManagement/MenuButton/Detail`,
    params,
  });
}
