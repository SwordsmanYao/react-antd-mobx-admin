import React from 'react';
import ReactDOM from 'react-dom';

import './index.less';
import registerServiceWorker from './registerServiceWorker';
import App from './App';


ReactDOM.render(
  <App />,
  document.getElementById('root')
);

registerServiceWorker();
