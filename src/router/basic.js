import asyncComponent from '../components/AsyncComponent';


/* 本项目路由不使用嵌套结构 */
/* 如果菜单数据不由接口提供的话可以和路由信息写在一起，比如 name 等属性 */
 const config = [
  {
    path: 'system-management/menu',
    /* webpackChunkName 指定打包后模块文件名称，如果省略，webpack 将使用数字作为默认名称 */
    component: asyncComponent(() => import(/* webpackChunkName: "SystemManagementMenu" */ '../views/SystemManagement/Menu')),
    /* 严格匹配 */
    exact: true,
  },
  {
    path: 'demo',
    component: asyncComponent(() => import(/* webpackChunkName: "Demo" */ '../views/Demo')),
    exact: true,
  },
];

export default config;