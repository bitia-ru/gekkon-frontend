import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Scheme from '../Scheme/Scheme';
import getArrayByIds from '../../v1/utils/getArrayByIds';
import './RouteCardScheme.css';

const RouteCardScheme = ({
  onRouteClick,
  diagram,
  routeIds,
  routes,
}) => (
  <div className="hall-scheme">
    <Scheme
      diagram={diagram}
      onRouteClick={onRouteClick}
      currentRoutes={getArrayByIds(routeIds, routes)}
    />
  </div>
);

RouteCardScheme.propTypes = {
  diagram: PropTypes.string,
  onRouteClick: PropTypes.func.isRequired,
  routeIds: PropTypes.array.isRequired,
  routes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  routeIds: state.routeIds,
  routes: state.routes,
});

export default withRouter(connect(mapStateToProps)(RouteCardScheme));
