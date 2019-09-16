import React from 'react';
import PropTypes from 'prop-types';
import './BackButton.css';

const BackButton = ({
  onClick,
}) => (
  <button
    className="back"
    type="button"
    onClick={onClick}
  />
);

BackButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default BackButton;
