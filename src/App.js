import React, { Component } from 'react';
import { Provider } from 'mobx-react';
// react-router-dom 比 react-router多了一些 DOM 类组件，<Link> <BrowserRouter> 等，两个不可同时用
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import stores from './stores';
import routerConfig from "./router";

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