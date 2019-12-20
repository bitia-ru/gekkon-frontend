import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as R from 'ramda';
import { ToastContainer } from 'react-toastr';
import Content from '../Content/Content';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import RoutesShowModal from '../RoutesShowModal/RoutesShowModal';
import RoutesEditModal from '../RoutesEditModal/RoutesEditModal';
import SignUpForm from '../SignUpForm/SignUpForm';
import LogInForm from '../LogInForm/LogInForm';
import Profile from '../Profile/Profile';
import BaseComponent from '../BaseComponent';
import StickyBar from '../StickyBar/StickyBar';
import { RESULT_FILTERS } from '../../Constants/ResultFilters';
import { avail } from '../../utils';
import SpotContext from '../../contexts/SpotContext';
import SectorContext from '../../contexts/SectorContext';
import reloadSector from '../../utils/reloadSector';
import reloadSpot from '../../utils/reloadSpot';
import getState from '../../utils/getState';
import getFilters from '../../utils/getFilters';
import getCurrentSector from '../../utils/getCurrentSector';
import getCurrentSpotOrSectorData from '../../utils/getCurrentSpotOrSectorData';
import getCategoryId from '../../utils/getCategoryId';
import CtrlPressedCatcher from '../CtrlPressedCatcher/CtrlPressedCatcher';
import reloadRoutes from '../../utils/reloadRoutes';

class SectorsShow extends BaseComponent {
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
      reloadRoutes(this.getSpotId(), id);
    };

    openEdit = (routeId) => { this.props.history.push(`${this.props.match.url}/${routeId}/edit`); };

    cancelEdit = () => { this.props.history.goBack(); };

    goToNew = () => { this.props.history.push(`${this.props.match.url}/routes/new`); };

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
      const {
        categoryFrom,
        categoryTo,
        period,
        date,
        filters,
      } = getFilters(spotId, sectorId);
      const defaultFilters = R.filter(
        e => !R.contains(e.id, R.map(f => f.id, RESULT_FILTERS)),
        filters,
      );
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
          <Content
            user={user}
            addRoute={this.goToNew}
            period={period}
            date={date}
            filters={avail(user) ? filters : defaultFilters}
            categoryId={getCategoryId(categoryFrom, categoryTo)}
          />
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
                    path={[`${match.path}/:route_id/edit`, `${match.path}/new`]}
                    render={() => (
                      <RoutesEditModal
                        onClose={this.closeRoutesModal}
                        cancel={this.cancelEdit}
                      />
                    )}
                  />
                  <Route
                    path={`${match.path}/:route_id`}
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

export default withRouter(connect(mapStateToProps, null)(SectorsShow));
