import request from '@/utils/request';

const api = window.PUBLIC_ENV_CONFIG.API;

export function queryCategoryTextValue() {
  return request({
    url: `${api}/OrgManagement/OrgCategory/TextValue`,
  });
}

export function queryTree() {
  return request({
    url: `${api}/OrgManagement/Org/tree`,
  });
}

export function insert(params) {
  return request({
    url: `${api}/OrgManagement/Org/Insert`,
    method: 'post',
    data: params,
  });
}

export function update(params) {
  return request({
    url: `${api}/OrgManagement/Org/Update`,
    method: 'post',
    data: params,
  });
}

export function remove(params) {
  return request({
    url: `${api}/OrgManagement/Org/Delete`,
    method: 'post',
    data: params,
  });
}

export function queryList(params) {
  return request({
    url: `${api}/OrgManagement/Org/List`,
    params,
  });
}

export function queryDetail(params) {
  return request({
    url: `${api}/OrgManagement/Org/Detail`,
    params,
  });
}
