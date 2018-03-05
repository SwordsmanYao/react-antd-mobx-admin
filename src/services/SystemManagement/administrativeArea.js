import request from '@/utils/request';

const api = window.PUBLIC_ENV_CONFIG.API;

// 菜单树
export function queryTree(params) {
  return request({
    url: `${api}/SysManagement/AdministrativeArea/Tree`,
    params,
  });
}

export function insert(params) {
  return request({
    url: `${api}/SysManagement/AdministrativeArea/Insert`,
    method: 'post',
    data: params,
  });
}

export function update(params) {
  return request({
    url: `${api}/SysManagement/AdministrativeArea/Update`,
    method: 'post',
    data: params,
  });
}

export function remove(params) {
  return request({
    url: `${api}/SysManagement/AdministrativeArea/Delete`,
    method: 'post',
    data: params,
  });
}

export function queryList(params) {
  return request({
    url: `${api}/SysManagement/AdministrativeArea/List`,
    params,
  });
}

export function queryDetail(params) {
  return request({
    url: `${api}/SysManagement/AdministrativeArea/Detail`,
    params,
  });
}

