import request from '@/utils/request';

const api = window.PUBLIC_ENV_CONFIG.API;

// 菜单树
export function queryMenuTree() {
  return request({
    url: `${api}/SysManagement/Authentication/MenuTree`,
  });
}