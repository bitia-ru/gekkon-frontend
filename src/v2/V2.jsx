import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import BootingScreen from './screens/BootingScreen';
import Users from './screens/Users';
import UserShow from './screens/UserShow';
import { currentUser as currentUserObtainer } from './redux/user_session/utils';
import SpotsShow from '@/v2/screens/SpotsShow';
import RoutePhotos from '@/v2/screens/RoutePhotos';


const V2 = ({ currentUser }) => (
  <>
    {
      currentUser !== undefined ? (
        <Switch>
          <Route path="/users/:user_id" component={UserShow} />
          <Route path="/users" component={Users} />
          <Route path="/spots/:id/sectors/:sector_id/photos" component={RoutePhotos} />
          <Route path="/spots/:id/sectors/:sector_id" component={SpotsShow} />
          <Route path="/spots/:id" component={SpotsShow} />
        </Switch>
      ) : (
        <BootingScreen />
      )
    }
  </>
);

const mapStateToProps = state => ({
  currentUser: currentUserObtainer(state),
});

export default connect(mapStateToProps)(V2);
