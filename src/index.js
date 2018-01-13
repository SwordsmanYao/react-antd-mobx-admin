import React from 'react';
import ReactDOM from 'react-dom';
import createHashHistory from 'history/createHashHistory';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router } from 'react-router';

import './index.less';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import allStores from './stores';


const hashHistory = createHashHistory();
const routingStore = new RouterStore();

const stores = {
  // Key can be whatever you want 
  routing: routingStore,
  // ...other stores
  ...allStores,
};

const history = syncHistoryWithStore(hashHistory, routingStore);

ReactDOM.render(
  <Provider {...stores}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
