import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import asyncComponent from '../components/AsyncComponent';
import BasicRoutes from "./BasicRoutes";


/* webpackChunkName 指定打包后模块文件名称，如果省略，webpack 将使用数字作为默认名称 */
const BasicLayout = asyncComponent(() => import(/* webpackChunkName: "BasicLayout" */ '../layouts/BasicLayout'));
const Login = asyncComponent(() => import(/* webpackChunkName: "Login" */ '../views/Login'));


/**
 * 最外层路由
 */
export default (passProps) => (
    <Switch>
      <Route path="/basic" render={ props => <BasicLayout {...props} {...passProps} /> } />
      <Route path="/login" exact render={ props => <Login {...props} {...passProps} /> } />
      <Redirect from="/" to="/basic" />
    </Switch>
  );

  export {
    BasicRoutes,
  }