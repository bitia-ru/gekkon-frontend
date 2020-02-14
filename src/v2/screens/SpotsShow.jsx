import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as R from 'ramda';
import { ToastContainer } from 'react-toastr';
import Content from '@/v1/components/Content/Content';
import Header from '../components/Header/Header';
import Footer from '@/v1/components/Footer/Footer';
import RoutesShowModal from '@/v2/components/RoutesShowModal/RoutesShowModal';
import RoutesEditModal from '@/v1/components/RoutesEditModal/RoutesEditModal';
import SignUpForm from '@/v1/components/SignUpForm/SignUpForm';
import LogInForm from '@/v1/components/LogInForm/LogInForm';
import Profile from '@/v1/components/Profile/Profile';
import BaseComponent from '@/v1/components/BaseComponent';
import StickyBar from '@/v1/components/StickyBar/StickyBar';
import { avail } from '@/v1/utils';
import SpotContext from '@/v1/contexts/SpotContext';
import SectorContext from '@/v1/contexts/SectorContext';
import reloadSector from '@/v1/utils/reloadSector';
import reloadSpot from '@/v1/utils/reloadSpot';
import getState from '@/v1/utils/getState';
import getCurrentSector from '@/v1/utils/getCurrentSector';
import getCurrentSpotOrSectorData from '@/v1/utils/getCurrentSpotOrSectorData';
import CtrlPressedCatcher from '@/v1/components/CtrlPressedCatcher/CtrlPressedCatcher';


class SpotsShow extends BaseComponent {
  componentDidMount() {
    const {
      history,
    } = this.props;
    history.listen((location, action) => {
      if (action === 'POP') {
        this.setState({ profileFormVisible: (location.hash === '#profile') });
      }
    });

    const sectorId = this.getSectorId();
    reloadSpot(this.getSpotId());
    if (sectorId !== 0) {
      reloadSector(sectorId);
    }
  }

    getSpotId = () => {
      const { match } = this.props;
      return parseInt(match.params.id, 10);
    };

    getSectorId = () => {
      const { match } = this.props;
      return match.params.sector_id ? parseInt(match.params.sector_id, 10) : 0;
    };

    closeRoutesModal = () => { this.props.history.push(R.replace('/routes', '', this.props.match.url)); };

    changeSectorFilter = (id) => {
      const { history, match } = this.props;
      if (id !== 0) {
        reloadSector(id);
        history.push(`${R.replace(/\/sectors\/[0-9]*/, '', match.url)}/sectors/${id}`);
      } else {
        reloadSpot(this.getSpotId());
        history.push(R.replace(/\/sectors\/[0-9]*/, '', match.url));
      }
    };

    openEdit = (routeId) => { this.props.history.push(`${this.props.match.url}/routes/${routeId}/edit`); };

    cancelEdit = () => { this.props.history.goBack(); };

    content = () => {
      const {
        user,
      } = this.props;
      const {
        signUpFormVisible,
        logInFormVisible,
        profileFormVisible,
        profileIsWaiting,
        profileFormErrors,
      } = this.state;
      const spotId = this.getSpotId();
      const sectorId = this.getSectorId();
      return (
        <>
          {
            signUpFormVisible
              ? (
                <SignUpForm
                  closeForm={this.closeSignUpForm}
                  enterWithVk={this.enterWithVk}
                />
              )
              : ''
          }
          {
            logInFormVisible
              ? (
                <LogInForm
                  closeForm={this.closeLogInForm}
                  enterWithVk={this.enterWithVk}
                  resetPassword={this.resetPassword}
                />
              )
              : ''
          }
          {
            (avail(user) && profileFormVisible) && (
              <Profile
                user={user}
                onFormSubmit={this.submitProfileForm}
                removeVk={this.removeVk}
                showToastr={this.showToastr}
                enterWithVk={this.enterWithVk}
                isWaiting={profileIsWaiting}
                closeForm={this.closeProfileForm}
                formErrors={profileFormErrors}
                resetErrors={this.profileResetErrors}
              />
            )
          }
          <ToastContainer
            ref={(ref) => {
              this.container = ref;
            }}
            onClick={() => this.container.clear()}
            className="toast-top-right"
          />
          <Header
            data={getCurrentSpotOrSectorData(spotId, sectorId)}
            changeSectorFilter={this.changeSectorFilter}
            user={user}
            openProfile={this.openProfileForm}
            signUp={this.signUp}
            logIn={this.logIn}
            logOut={this.logOut}
          />
          <Content />
        </>
      );
    };

    render() {
      const {
        match,
        user,
        spots,
        loading,
      } = this.props;
      const {
        signUpFormVisible,
        logInFormVisible,
        profileFormVisible,
      } = this.state;
      const showModal = signUpFormVisible || logInFormVisible || profileFormVisible;
      const spotId = this.getSpotId();
      const spot = spots[spotId];
      const sectorId = this.getSectorId();
      const sector = getCurrentSector(sectorId);
      return (
        <CtrlPressedCatcher>
          <SpotContext.Provider value={{ spot }}>
            <SectorContext.Provider value={{ sector }}>
              <div className={showModal ? null : 'page__scroll'}>
                <Switch>
                  <Route
                    path={[`${match.path}/routes/:route_id/edit`, `${match.path}/routes/new`]}
                    render={() => (
                      <RoutesEditModal
                        onClose={this.closeRoutesModal}
                        cancel={this.cancelEdit}
                      />
                    )}
                  />
                  <Route
                    path={`${match.path}/routes/:route_id`}
                    render={() => (
                      <RoutesShowModal
                        onClose={this.closeRoutesModal}
                        openEdit={this.openEdit}
                        goToProfile={this.openProfileForm}
                      />
                    )}
                  />
                </Switch>
                <StickyBar loading={loading}>
                  {this.content()}
                </StickyBar>
                <Footer
                  user={user}
                  logIn={this.logIn}
                  signUp={this.signUp}
                  logOut={this.logOut}
                />
              </div>
            </SectorContext.Provider>
          </SpotContext.Provider>
        </CtrlPressedCatcher>
      );
    }
}

const mapStateToProps = state => ({
  routes: state.routesStore.routes,
  spots: state.spotsStore.spots,
  sectors: state.sectorsStore.sectors,
  user: state.usersStore.users[state.usersStore.currentUserId],
  loading: getState(state),
});

export default withRouter(connect(mapStateToProps, null)(SpotsShow));
