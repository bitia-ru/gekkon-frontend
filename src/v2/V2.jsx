import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Users from './Users';

const V2 = () => (
  <Switch>
    <Route path="/v2/users/:user_id" component={Users} />
  </Switch>
);

export default V2;
