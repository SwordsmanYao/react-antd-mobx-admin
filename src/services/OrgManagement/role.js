import request from '@/utils/request';

const api = window.PUBLIC_ENV_CONFIG.API;


export function insert(params) {
  return request({
    url: `${api}/OrgManagement/Role/Insert`,
    method: 'post',
    data: params,
  });
}

export function update(params) {
  return request({
    url: `${api}/OrgManagement/Role/Update`,
    method: 'post',
    data: params,
  });
}

export function remove(params) {
  return request({
    url: `${api}/OrgManagement/Role/Delete`,
    method: 'post',
    data: params,
  });
}

export function queryList(params) {
  return request({
    url: `${api}/OrgManagement/Role/List`,
    params,
  });
}

export function queryDetail(params) {
  return request({
    url: `${api}/OrgManagement/Role/Detail`,
    params,
  });
}
