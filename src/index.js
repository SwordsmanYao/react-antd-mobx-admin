import React from 'react';
import ReactDOM from 'react-dom';
import createHashHistory from 'history/createHashHistory';
import { Provider } from 'mobx-react';
// react-router-dom 比 react-router多了一些 DOM 类组件，<Link> <BrowserRouter> 等，两个不可同时用
import { Router } from 'react-router-dom';

import './index.less';
import registerServiceWorker from './registerServiceWorker';
import stores from './stores';
import Routes from "./Routes";



const hashHistory = createHashHistory();


ReactDOM.render(
  <Provider {...stores}>
    <Router history={hashHistory}>
      <Routes />
    </Router>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
