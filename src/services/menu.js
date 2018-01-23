import request from '../utils/request';

const api = window.PUBLIC_ENV_CONFIG.API;

// 菜单树
export function queryMenuTree() {
  return request({
    url: `${api}/SysManagement/Menu/tree`,
    method: 'get',
  });
}

export function insert(params) {
  return request({
    url: `${api}/SysManagement/Menu/Insert`,
    method: 'post',
    data: params,
  });
}

export function update(params) {
  return request({
    url: `${api}/SysManagement/Menu/Update`,
    method: 'post',
    data: params,
  });
}

export function remove(params) {
  return request({
    url: `${api}/SysManagement/Menu/Delete`,
    method: 'post',
    data: params,
  });
}

// 列表数据
export function queryList(params) {
  return request({
    url: `${api}/SysManagement/Menu/List`,
    params,
  });
}

export function queryDetail(params) {
  return request({
    url: `${api}/SysManagement/Menu/Detail`,
    params,
  });
}
