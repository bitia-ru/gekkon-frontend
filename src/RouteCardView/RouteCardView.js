import React from 'react';
import PropTypes from 'prop-types';
import RouteCardTable from '../RouteCardTable/RouteCardTable';
import RouteCardList from '../RouteCardList/RouteCardList';

const RouteCardView = ({
  viewMode,
  routes,
  ascents,
  addRoute,
  sectorId,
  onRouteClick,
  ctrlPressed,
  user,
}) => (
  <React.Fragment>
    {viewMode === 'table'
      ? (
        <RouteCardTable
          routes={routes}
          ascents={ascents}
          addRoute={addRoute}
          sectorId={sectorId}
          onRouteClick={onRouteClick}
          ctrlPressed={ctrlPressed}
          user={user}
        />
      )
      : (
        <RouteCardList
          routes={routes}
          addRoute={addRoute}
          sectorId={sectorId}
          onRouteClick={onRouteClick}
          user={user}
        />
      )
    }
  </React.Fragment>
);

RouteCardView.propTypes = {
  user: PropTypes.object,
  viewMode: PropTypes.string.isRequired,
  routes: PropTypes.array.isRequired,
  ascents: PropTypes.array.isRequired,
  ctrlPressed: PropTypes.bool.isRequired,
  addRoute: PropTypes.func.isRequired,
  sectorId: PropTypes.number.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};

export default RouteCardView;
