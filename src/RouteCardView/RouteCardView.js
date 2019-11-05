import React from 'react';
import PropTypes from 'prop-types';
import RouteCardTable from '../RouteCardTable/RouteCardTable';
import RouteCardList from '../RouteCardList/RouteCardList';
import RouteCardScheme from '../RouteCardScheme/RouteCardScheme';

const RouteCardView = ({
  viewMode,
  addRoute,
  onRouteClick,
  ctrlPressed,
  user,
  diagram,
}) => (
  <React.Fragment>
    {
      viewMode === 'table' && (
        <RouteCardTable
          addRoute={addRoute}
          onRouteClick={onRouteClick}
          ctrlPressed={ctrlPressed}
          user={user}
        />
      )
    }
    {
      viewMode === 'list' && (
        <RouteCardList
          addRoute={addRoute}
          onRouteClick={onRouteClick}
          user={user}
        />
      )
    }
    {
      viewMode === 'scheme' && (
        <RouteCardScheme
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
  ctrlPressed: PropTypes.bool.isRequired,
  addRoute: PropTypes.func.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};

export default RouteCardView;
