import React from 'react';
import ReactDOM from 'react-dom';
import DevTools from 'mobx-react-devtools';

import './index.less';
import registerServiceWorker from './registerServiceWorker';
import App from './App';


ReactDOM.render(
  <div>
    <App />
    <DevTools />
  </div>
  ,
  document.getElementById('root')
);

registerServiceWorker();
