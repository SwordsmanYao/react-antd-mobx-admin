import React from 'react';
import { BasicRoutes } from '../Routes';

export default ({ match }) => (
  <div>
    basic
    <BasicRoutes match={ match } />
  </div>
);