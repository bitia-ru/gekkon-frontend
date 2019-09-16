import React from 'react';
import PropTypes from 'prop-types';
import RouteCardTable from '../RouteCardTable/RouteCardTable';
import RouteCardList from '../RouteCardList/RouteCardList';
import RouteCardScheme from '../RouteCardScheme/RouteCardScheme';

const RouteCardView = ({
  viewMode,
  routes,
  ascents,
  addRoute,
  sectorId,
  onRouteClick,
  ctrlPressed,
  user,
  diagram,
}) => (
  <React.Fragment>
    {
      viewMode === 'table' && (
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
    }
    {
      viewMode === 'list' && (
        <RouteCardList
          routes={routes}
          addRoute={addRoute}
          sectorId={sectorId}
          onRouteClick={onRouteClick}
          user={user}
        />
      )
    }
    {
      viewMode === 'scheme' && (
        <RouteCardScheme
          ascents={ascents}
          routes={routes}
          onRouteClick={onRouteClick}
          diagram={diagram}
        />
      )
    }
  </React.Fragment>
);

RouteCardView.propTypes = {
  user: PropTypes.object,
  diagram: PropTypes.string,
  viewMode: PropTypes.string.isRequired,
  routes: PropTypes.array.isRequired,
  ascents: PropTypes.array.isRequired,
  ctrlPressed: PropTypes.bool.isRequired,
  addRoute: PropTypes.func.isRequired,
  sectorId: PropTypes.number.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};

export default RouteCardView;
