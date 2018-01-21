import request from '../utils/request';

const api = window.PUBLIC_ENV_CONFIG.API;

// 菜单树
export function queryMenu() {
  return request({
    url: `${api}/SysManagement/Menu/tree`,
    method: 'get',
  });
}

export function insertMenu(params) {
  return request({
    url: `${api}/SysManagement/Menu/Insert`,
    method: 'post',
    data: params,
  });
}

export function updateMenu(params) {
  return request({
    url: `${api}/SysManagement/Menu/Update`,
    method: 'post',
    data: params,
  });
}

export function deleteMenu(params) {
  return request({
    url: `${api}/SysManagement/Menu/Delete`,
    method: 'post',
    data: params,
  });
}

// 列表数据
export function queryMenuList(params) {
  return request({
    url: `${api}/SysManagement/Menu/List`,
    params,
  });
}

export function queryMenuDetail(params) {
  return request({
    url: `${api}/SysManagement/Menu/Detail`,
    params,
  });
}
