import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Switch, Route } from 'react-router-dom';
import * as R from 'ramda';
import { StyleSheet, css } from '../aphrodite';
import MainScreen from '../layouts/MainScreen/MainScreen';
import Header from '@/v2/components/Header/Header';
import RoutesShowModal from '@/v2/components/RoutesShowModal/RoutesShowModal';
import RoutesEditModal from '@/v2/components/RoutesEditModal/RoutesEditModal';
import { default as reloadSectorAction } from '@/v1/utils/reloadSector';
import { reloadSpot as reloadSpotAction } from '@/v1/utils/reloadSpot';
import getCurrentSector from '@/v1/utils/getCurrentSector';
import getCurrentSpotOrSectorData from '@/v1/utils/getCurrentSpotOrSectorData';
import Content from '@/v2/components/Content/Content';
import SpotContext from '@/v1/contexts/SpotContext';
import SectorContext from '@/v1/contexts/SectorContext';

class SpotsShow extends React.PureComponent {
  componentDidMount() {
    const sectorId = this.getSectorId();
    this.props.reloadSpot(this.getSpotId());
    if (sectorId !== 0) {
      this.props.reloadSector(sectorId);
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
      this.props.reloadSector(id);
      history.push(`${R.replace(/\/sectors\/[0-9]*/, '', match.url)}/sectors/${id}`);
    } else {
      this.props.reloadSpot(this.getSpotId());
      history.push(R.replace(/\/sectors\/[0-9]*/, '', match.url));
    }
  };

  openEdit = (routeId) => { this.props.history.push(`${this.props.match.url}/routes/${routeId}/edit`); };

  cancelEdit = () => { this.props.history.goBack(); };

  render() {
    const {
      match,
      spots,
      sectors,
    } = this.props;
    const spotId = this.getSpotId();
    const spot = spots[spotId];
    const sectorId = this.getSectorId();
    const sector = getCurrentSector(sectors, sectorId);
    return (
      <SpotContext.Provider value={{ spot }}>
        <SectorContext.Provider value={{ sector }}>
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
          <MainScreen
            header={
              <Header
                data={getCurrentSpotOrSectorData(spots, sectors, spotId, sectorId)}
                changeSectorFilter={this.changeSectorFilter}
              />
            }
          >
            <Content />
          </MainScreen>
        </SectorContext.Provider>
      </SpotContext.Provider>
    );
  }
}

const style = StyleSheet.create({
});

const mapStateToProps = state => ({
  routes: state.routesStoreV2.routes,
  spots: state.spotsStore.spots,
  sectors: state.sectorsStore.sectors,
});

const mapDispatchToProps = dispatch => ({
  reloadSpot: spotId => dispatch(reloadSpotAction(spotId)),
  reloadSector: sectorId => dispatch(reloadSectorAction(sectorId)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsShow));
