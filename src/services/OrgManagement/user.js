import request from '@/utils/request';

const api = window.PUBLIC_ENV_CONFIG.API;

export function resetPwd(params) {
  return request({
    url: `${api}/OrgManagement/User/ResetPwd`,
    method: 'post',
    data: params,
  });
}

export function queryTree() {
  return request({
    url: `${api}/OrgManagement/Org/tree`,
  });
}

export function insert(params) {
  return request({
    url: `${api}/OrgManagement/User/Insert`,
    method: 'post',
    data: params,
  });
}

export function update(params) {
  return request({
    url: `${api}/OrgManagement/User/Update`,
    method: 'post',
    data: params,
  });
}

export function remove(params) {
  return request({
    url: `${api}/OrgManagement/User/Delete`,
    method: 'post',
    data: params,
  });
}

export function queryList(params) {
  return request({
    url: `${api}/OrgManagement/User/List`,
    params,
  });
}
