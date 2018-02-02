import asyncComponent from '../components/AsyncComponent';


/* 本项目路由不使用嵌套结构 */
/* 如果菜单数据不由接口提供的话可以和路由信息写在一起，比如 name 等属性 */
 const config = [
  {
    path: 'system-management/menu',
    /* webpackChunkName 指定打包后模块文件名称，如果省略，webpack 将使用数字作为默认名称 */
    component: asyncComponent(() => import(/* webpackChunkName: "menu" */ '../views/SystemManagement/Menu')),
    /* 是否严格匹配 */
    exact: true,
  },
  {
    path: 'system-management/log/operation-log',
    component: asyncComponent(() => import(/* webpackChunkName: "operationLog" */ '../views/SystemManagement/OperationLog')),
    exact: true,
  },
  {
    path: 'system-management/log/exception-log',
    component: asyncComponent(() => import(/* webpackChunkName: "exceptionLog" */ '../views/SystemManagement/ExceptionLog')),
    exact: true,
  },
  {
    path: 'org-management/org-category',
    component: asyncComponent(() => import(/* webpackChunkName: "orgCategory" */ '../views/OrgManagement/OrgCategory')),
    exact: true,
  },
  {
    path: 'org-management/org',
    component: asyncComponent(() => import(/* webpackChunkName: "org" */ '../views/OrgManagement/Org')),
    exact: true,
  },
  {
    path: 'org-management/role',
    component: asyncComponent(() => import(/* webpackChunkName: "role" */ '../views/OrgManagement/Role')),
    exact: true,
  },
  {
    path: 'org-management/user',
    component: asyncComponent(() => import(/* webpackChunkName: "user" */ '../views/OrgManagement/User')),
    exact: true,
  },
];

export default config;