import request from '@/utils/request';

const api = window.PUBLIC_ENV_CONFIG.API;

// 获取成员角色
export function getMemberRole(params) {
  return request({
    url: `${api}/OrgManagement/User/MemberRole`,
    params, 
  });
}

// 设置成员角色
export function setMemberRole(params) {
  return request({
    url: `${api}/OrgManagement/User/SetMemberRole`,
    method: 'post',
    data: params,
  });
}

// 启用/禁用
export function setStatus(params) {
  return request({
    url: `${api}/OrgManagement/User/SetStatus`,
    method: 'post',
    data: params,
  });
}

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

export function queryDetail(params) {
  return request({
    url: `${api}/OrgManagement/User/Detail`,
    params,
  });
}
