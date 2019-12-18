import React from 'react';
import PropTypes from 'prop-types';
import { getColorStyle } from '../../Constants/Route';
import './RouteColor.css';

const RouteColor = ({
  size,
  route,
  fieldName,
}) => (
  <div
    className={`hook hook__${size}`}
    style={getColorStyle(route[fieldName])}
  />
);

RouteColor.propTypes = {
  size: PropTypes.string,
  route: PropTypes.object.isRequired,
  fieldName: PropTypes.string.isRequired,
};

export default RouteColor;
