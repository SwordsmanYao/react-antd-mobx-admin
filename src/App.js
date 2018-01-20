import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import mobx from 'mobx';
// react-router-dom 比 react-router多了一些 DOM 类组件，<Link> <BrowserRouter> 等，两个不可同时用
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import stores from './stores';
import routerConfig from "./router";

// mobx 启用严格模式，强制所有的状态修改都必须由 action 来完成
mobx.useStrict(true);

class App extends Component {
  render() {
    return (
      <Provider {...stores}>
        <Router>
          <Switch>
            {
              routerConfig.map(item => (
                <Route path={item.path} key={item.path} exact={item.exact} component={ item.component } />
              ))
            }
            <Redirect from="/" to="/basic" />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;