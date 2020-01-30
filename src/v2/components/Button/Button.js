import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const Button = ({
  disabled,
  submit,
  fullLength,
  isWaiting,
  size,
  style,
  onClick,
  children,
}) => {
  let styleClass = '';
  if (style !== 'normal') {
    if (style === 'gray') {
      styleClass = ' btn_gray';
    } else {
      styleClass = ' btn_transparent';
    }
  }
  let sizeClass = '';
  if (size === 'small') {
    sizeClass = ' btn__small';
  } else if (size === 'medium') {
    sizeClass = ' btn__medium';
  }
  const fullLengthClass = fullLength ? ' btn_full-length' : '';
  const submitClass = submit ? ' btn__submit' : '';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!!disabled}
      style={disabled ? { cursor: 'not-allowed' } : (isWaiting ? { cursor: 'wait' } : {})}
      className={
        `btn${styleClass}${sizeClass}${fullLengthClass}${submitClass}`
      }
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  disabled: PropTypes.bool,
  submit: PropTypes.bool,
  fullLength: PropTypes.bool,
  isWaiting: PropTypes.bool,
  size: PropTypes.string,
  style: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

Button.defaultProps = {
  disabled: false,
  submit: false,
  fullLength: false,
  isWaiting: false,
};

export default Button;
