import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import BootingScreen from './screens/BootingScreen';
import Users from './screens/Users';
import UserShow from './screens/UserShow';
import SpotsShow from './screens/SpotsShow';
import SpotsIndex from './screens/SpotsIndex';
import RoutePhotos from './screens/RoutePhotos';
import { currentUser as currentUserObtainer } from './redux/user_session/utils';
import About from './components/About/About';
import Faq from './components/Faq/Faq';
import CtrlPressedCatcher from './components/common/CtrlPressedCatcher/CtrlPressedCatcher';
import BotLinkage from './components/BotLinkage/BotLinkage';

const V2 = ({ currentUser }) => (
  <CtrlPressedCatcher>
    {
      currentUser !== undefined ? (
        <Switch>
          <Route path="/users/:user_id" component={UserShow} />
          <Route path="/users" component={Users} />
          <Route exact path={['/', '/spots']} component={SpotsIndex} />
          <Route path="/spots/:id/sectors/:sector_id/photos" component={RoutePhotos} />
          <Route path="/spots/:id/sectors/:sector_id" component={SpotsShow} />
          <Route path="/spots/:id" component={SpotsShow} />
          <Route exact path="/about" component={About} />
          <Route exact path="/faq" component={Faq} />
          <Route exact path="/bot_likage" component={BotLinkage} />
        </Switch>
      ) : (
        <BootingScreen />
      )
    }
  </CtrlPressedCatcher>
);

const mapStateToProps = state => ({
  currentUser: currentUserObtainer(state),
});

export default connect(mapStateToProps)(V2);
