import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as R from 'ramda';
import Content from '../Content/Content';
import Header from '../Header/Header';
import RoutesShowModal from '../RoutesShowModal/RoutesShowModal';
import RoutesEditModal from '../RoutesEditModal/RoutesEditModal';
import SpotContext from '../../contexts/SpotContext';
import SectorContext from '../../contexts/SectorContext';
import reloadSector from '../../utils/reloadSector';
import reloadSpot from '../../utils/reloadSpot';
import getState from '../../utils/getState';
import getCurrentSector from '../../utils/getCurrentSector';
import getCurrentSpotOrSectorData from '../../utils/getCurrentSpotOrSectorData';
import CtrlPressedCatcher from '../CtrlPressedCatcher/CtrlPressedCatcher';
import withModals from '@/v1/modules/modalable';
import MainScreen from '../../screens/Main/Main';


class SpotsShow extends React.PureComponent {
  componentDidMount() {
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

  openEdit = (routeId) => { this.props.history.push(`${this.props.match.url}/${routeId}/edit`); };

  cancelEdit = () => { this.props.history.goBack(); };

  render() {
    const {
      match,
      user,
      spots,
    } = this.props;

    const spotId = this.getSpotId();
    const spot = spots[spotId];
    const sectorId = this.getSectorId();
    const sector = getCurrentSector(sectorId);

    return (
      <CtrlPressedCatcher>
        <SpotContext.Provider value={{ spot }}>
          <SectorContext.Provider value={{ sector }}>
            <MainScreen
              header={
                <Header
                  data={getCurrentSpotOrSectorData(spotId, sectorId)}
                  changeSectorFilter={this.changeSectorFilter}
                  user={user}
                  openProfile={this.openProfileForm}
                  logOut={this.logOut}
                />
              }
            >
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
              <Content />
            </MainScreen>
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
