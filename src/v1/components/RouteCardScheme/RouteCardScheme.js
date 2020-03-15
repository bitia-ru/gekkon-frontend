import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Scheme from '../Scheme/Scheme';
import getArrayByIds from '../../utils/getArrayByIds';
import './RouteCardScheme.css';
import SchemePlaceholder from '@/v2/components/common/SchemePlaceholder/SchemePlaceholder';

const RouteCardScheme = ({
  onRouteClick,
  diagram,
  routeIds,
  routes,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const loadingTimeout = () => new Promise(resolve => setTimeout(resolve, 3000));
  useEffect(() => {
    loadingTimeout().then(() => {
      setIsLoading(false);
    });
  }, [isLoading]);

  return (
    <div className="hall-scheme">
      { isLoading
        ? <SchemePlaceholder />
        : <Scheme
          diagram={diagram}
          onRouteClick={onRouteClick}
          currentRoutes={routeIds}
          routes={getArrayByIds(routeIds, routes)}
        />
      }
    </div>
  );
};
RouteCardScheme.propTypes = {
  diagram: PropTypes.string,
  onRouteClick: PropTypes.func.isRequired,
  routeIds: PropTypes.array.isRequired,
  routes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  routeIds: (
    state.routesStore.filtrationResults[0]
      ? state.routesStore.filtrationResults[0].routeIds
      : []
  ),
  routes: state.routesStore.routes,
});

export default withRouter(connect(mapStateToProps)(RouteCardScheme));
