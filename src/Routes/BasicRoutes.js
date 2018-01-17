import React from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncComponent from '../components/AsyncComponent';


/* webpackChunkName 指定打包后模块文件名称，如果省略，webpack 将使用数字作为默认名称 */
const SystemManagementMenu = asyncComponent(() => import(/* webpackChunkName: "SystemManagementMenu" */ '../views/SystemManagement/Menu'));


export default ({ match }) => (
    <Switch>
      <Route path={`${match.url}/system-management/menu`} exact render={ props => <SystemManagementMenu {...props} /> } />
    </Switch>
  );