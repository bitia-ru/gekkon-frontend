import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SchemePointer.css';

class SchemePointer extends Component {
  onMouseDown = (event) => {
    const { onStartMoving } = this.props;
    if (event.nativeEvent.which === 1 && onStartMoving) {
      onStartMoving(event.pageX, event.pageY);
    }
  };

  render() {
    const {
      onClick,
      onMouseEnter,
      onMouseLeave,
      category,
      color,
      transparent,
    } = this.props;
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      } : null;
    };

    const getFontColor = (hexColor) => {
      const rgbColor = hexToRgb(hexColor);
      const dist = Math.sqrt((rgbColor.r ** 2) + (rgbColor.g ** 2) + (rgbColor.b ** 2));
      if (dist < Math.sqrt((128 ** 2) * 3)) {
        return '#ffffff';
      }
      return '#000000';
    };

    return <button
      type="button"
      onClick={onClick}
      style={{
        backgroundColor: color,
        color: getFontColor(color),
        opacity: transparent ? 0.5 : 1,
        cursor: transparent ? 'default' : 'pointer',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={this.onMouseDown}
      className="track-point"
    >
      {category}
    </button>;
  }
}

SchemePointer.propTypes = {
  category: PropTypes.string,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onStartMoving: PropTypes.func,
  onClick: PropTypes.func,
  color: PropTypes.string,
  transparent: PropTypes.bool,
};

SchemePointer.defaultProps = {
  category: '',
  onMouseEnter: null,
  onMouseLeave: null,
  onStartMoving: null,
  onClick: null,
  color: '#ffffff',
  transparent: false,
};

export default SchemePointer;
