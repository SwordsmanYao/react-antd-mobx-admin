import request from '@/utils/request';

const api = window.PUBLIC_ENV_CONFIG.API;

export function queryOrgTree() {
  return request({
    url: `${api}/OrgManagement/Org/tree`,
  });
}

// 获取已选的角色成员ids
export function getRoleMember(params) {
  return request({
    url: `${api}/OrgManagement/Role/RoleMember`,
    params,
  });
}
// 角色成员列表数据
export function getRoleMemberDetail(params) {
  return request({
    url: `${api}/OrgManagement/Role/RoleMemberDetail`,
    params,
  });
}

export function setRoleMember(params) {
  return request({
    url: `${api}/OrgManagement/Role/SetRoleMember`,
    method: 'post',
    data: params,
  });
}

// 获取角色菜单
export function getRoleMenu(params) {
  return request({
    url: `${api}/OrgManagement/Role/RoleMenu`,
    params,
  });
}

export function setRoleMenu(params) {
  return request({
    url: `${api}/OrgManagement/Role/SetRoleMenu`,
    method: 'post',
    data: params,
  });
}

// 获取角色按钮
export function getRoleMenuButton(params) {
  return request({
    url: `${api}/OrgManagement/Role/RoleMenuButton`,
    params,
  });
}

export function setRoleMenuButton(params) {
  return request({
    url: `${api}/OrgManagement/Role/SetRoleMenuButton`,
    method: 'post',
    data: params,
  });
}

// 获取角色列表字段
export function getRoleMenuField(params) {
  return request({
    url: `${api}/OrgManagement/Role/RoleMenuField`,
    params,
  });
}

export function setRoleMenuField(params) {
  return request({
    url: `${api}/OrgManagement/Role/SetRoleMenuField`,
    method: 'post',
    data: params,
  });
}

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
