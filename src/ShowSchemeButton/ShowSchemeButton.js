import React from 'react';
import PropTypes from 'prop-types';
import './ShowSchemeButton.css';

import iconImage from '../../img/btn-handler/btn-handler-sprite.svg';

const ShowSchemeButton = ({ onClick, disabled, title }) => (
  <button
    type="button"
    className="modal__track-show-map"
    onClick={disabled ? null : onClick}
    title={title}
    style={disabled ? { cursor: 'not-allowed' } : { cursor: 'pointer' }}
  >
    <svg><use xlinkHref={`${iconImage}#icon-show-map`} /></svg>
  </button>
);

ShowSchemeButton.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  title: PropTypes.string,
};

ShowSchemeButton.defaultProps = {
  disabled: false,
  onClick: null,
};

export default ShowSchemeButton;
