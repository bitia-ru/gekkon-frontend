import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Scheme from '../Scheme/Scheme';
import getArrayByIds from '@/v1/utils/getArrayByIds';
import { StyleSheet, css } from '../../aphrodite';
import SectorContext from '@/v1/contexts/SectorContext';

const RouteCardScheme = ({
  onRouteClick,
  diagram,
  routeIds,
  routes,
}) => (
  <SectorContext.Consumer>
    {
      ({ sector }) => (
        <>
          <div className={css(styles.hallScheme)}>
            <Scheme
              diagram={diagram}
              onRouteClick={onRouteClick}
              currentRoutes={routeIds}
              routes={getArrayByIds(routeIds, routes)}
              currentSector={sector}
            />
          </div>
        </>
      )
    }
  </SectorContext.Consumer>
);

const styles = StyleSheet.create({
  hallScheme: {
    maxWidth: '86%',
    width: '100%',
    height: 'auto',
    position: 'relative',
    marginLeft: 'auto',
    marginRight: 'auto',
    '> img': {
      width: '100%',
      height: 'auto',
    },
  },
});

RouteCardScheme.propTypes = {
  diagram: PropTypes.string,
  onRouteClick: PropTypes.func.isRequired,
  routeIds: PropTypes.array.isRequired,
  routes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  routeIds: (
    state.routesStoreV2.filtrationResults[0]
      ? state.routesStoreV2.filtrationResults[0].routeIds
      : []
  ),
  routes: state.routesStoreV2.routes,
});

export default withRouter(connect(mapStateToProps)(RouteCardScheme));
