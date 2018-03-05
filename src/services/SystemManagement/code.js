import request from '@/utils/request';

const api = window.PUBLIC_ENV_CONFIG.API;

// 菜单树
export function queryTree() {
  return request({
    url: `${api}/SysManagement/Code/ClassificationTree`,
  });
}

export function insert(params) {
  return request({
    url: `${api}/SysManagement/Code/Insert`,
    method: 'post',
    data: params,
  });
}

export function update(params) {
  return request({
    url: `${api}/SysManagement/Code/Update`,
    method: 'post',
    data: params,
  });
}

export function remove(params) {
  return request({
    url: `${api}/SysManagement/Code/Delete`,
    method: 'post',
    data: params,
  });
}

export function queryList(params) {
  return request({
    url: `${api}/SysManagement/Code/List`,
    params,
  });
}

export function queryDetail(params) {
  return request({
    url: `${api}/SysManagement/Code/Detail`,
    params,
  });
}

