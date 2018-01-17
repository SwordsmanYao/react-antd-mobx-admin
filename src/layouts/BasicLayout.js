import React from 'react';
import { Switch, Route } from "react-router-dom";
import { basic as basicRouter } from '../router';

export default ({ match }) => (
  <div>
    basic
    <Switch>
      {
        basicRouter.map(item => (
          <Route path={`${match.url}/${item.path}`} key={item.path} exact={item.exact} component={ item.component } />
        ))
      }
    </Switch>
  </div>
);