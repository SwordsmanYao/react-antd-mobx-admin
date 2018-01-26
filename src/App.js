import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import * as mobx from 'mobx';
// react-router-dom 比 react-router多了一些 DOM 类组件，<Link> <BrowserRouter> 等，两个不可同时用
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import stores from './stores';
import routerConfig from "./router";
import history from './history';

// mobx 启用严格模式，强制所有的状态修改都必须由 action 来完成
mobx.useStrict(true);

class App extends Component {

  componentWillMount() {
    // 在页面刷新后从 session 中取出当前用户信息
    stores.user.loadCurrentUserFromSession();
  }

  render() {
    return (
      <Provider {...stores}>
        <LocaleProvider locale={zhCN}>
          <Router history={history}>
            <Switch>
              {
                routerConfig.map(item => (
                  <Route path={item.path} key={item.path} exact={item.exact} component={ item.component } />
                ))
              }
              <Redirect from="/" to={stores.user.currentUser ? '/basic' : '/login'} />
            </Switch>
          </Router>
        </LocaleProvider>
      </Provider>
    );
  }
}

export default App;