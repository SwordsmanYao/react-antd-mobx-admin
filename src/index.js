import React from 'react';
import ReactDOM from 'react-dom';
import createHashHistory from 'history/createHashHistory';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router } from 'react-router';

import './index.less';
import registerServiceWorker from './registerServiceWorker';
import allStores from './stores';
import Routes from "./Routes";



const hashHistory = createHashHistory();
const routingStore = new RouterStore();


const stores = {
  routing: routingStore,
  ...allStores,
};

const history = syncHistoryWithStore(hashHistory, routingStore);

ReactDOM.render(
  <Provider {...stores}>
    <Router history={history}>
      <Routes />
    </Router>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
