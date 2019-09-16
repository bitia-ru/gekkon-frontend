import React from 'react';
import PropTypes from 'prop-types';
import Scheme from '../Scheme/Scheme';
import './RouteCardScheme.css';

const RouteCardScheme = ({
  onRouteClick,
  routes,
  ascents,
  diagram,
}) => (
  <div className="hall-scheme">
    <Scheme routes={routes} diagram={diagram} onRouteClick={onRouteClick} ascents={ascents} />
  </div>
);

RouteCardScheme.propTypes = {
  diagram: PropTypes.string,
  ascents: PropTypes.array.isRequired,
  routes: PropTypes.array.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};

export default RouteCardScheme;
