import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import BootingScreen from './screens/BootingScreen';
import Users from './screens/Users';
import UserShow from './screens/UserShow';

const V2 = ({ userSession }) => (
  <>
    {
      userSession.user_id !== undefined ? (
        <Switch>
          <Route path="/v2/users/:user_id" component={UserShow} />
          <Route path="/v2/users" component={Users} />
        </Switch>
      ) : (
        <BootingScreen />
      )
    }
  </>
);

const mapStateToProps = state => ({
  userSession: state.userSessionV2,
});

export default connect(mapStateToProps)(V2);
