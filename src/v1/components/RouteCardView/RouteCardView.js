import React from 'react';
import PropTypes from 'prop-types';
import RouteCardTable from '../RouteCardTable/RouteCardTable';
import RouteCardList from '../RouteCardList/RouteCardList';
import RouteCardScheme from '@/v2/components/RouteCardScheme/RouteCardScheme';

const RouteCardView = ({
  viewMode,
  addRoute,
  onRouteClick,
  diagram,
}) => (
  <React.Fragment>
    {
      viewMode === 'table' && (
        <RouteCardTable
          addRoute={addRoute}
          onRouteClick={onRouteClick}
        />
      )
    }
    {
      viewMode === 'list' && (
        <RouteCardList
          addRoute={addRoute}
          onRouteClick={onRouteClick}
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
  diagram: PropTypes.string,
  viewMode: PropTypes.string.isRequired,
  addRoute: PropTypes.func.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};

export default RouteCardView;
