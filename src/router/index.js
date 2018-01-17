import asyncComponent from '../components/AsyncComponent';
import basic from "./basic";


/* 本项目路由不使用嵌套结构 */
/* 最外层路由 */
const config = [
  {
    path: '/basic',
    /* webpackChunkName 指定打包后模块文件名称，如果省略，webpack 将使用数字作为默认名称 */
    component: asyncComponent(() => import(/* webpackChunkName: "BasicLayout" */ '../layouts/BasicLayout')),
    /* 严格匹配 */
    exact: false,
  },
  {
    path: '/login',
    component: asyncComponent(() => import(/* webpackChunkName: "Login" */ '../views/Login')),
    exact: true,
  },
];


export default config;
export {
  basic,
};