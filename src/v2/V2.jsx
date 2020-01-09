import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Users from './screens/Users';
import UserShow from './screens/UserShow';

const V2 = () => (
  <Switch>
    <Route path="/v2/users/:user_id" component={UserShow} />
    <Route path="/v2/users" component={Users} />
  </Switch>
);

export default V2;
