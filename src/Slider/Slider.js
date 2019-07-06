import React from 'react';
import PropTypes from 'prop-types';
import './Slider.css';

const Slider = ({
  position, numOfPositions,
}) => (
  <div className="slider__decor">
    <div className="slider__indicator-block">
      <div
        className="slider__indicator-status"
        style={{
          width: `${position === 0 ? 100 : 100 / numOfPositions}%`,
          transform: `translateX(${position === 0 ? 0 : 100 * (position - 1)}%)`,
        }}
      />
    </div>
  </div>
);

Slider.propTypes = {
  numOfPositions: PropTypes.number.isRequired,
  position: PropTypes.number.isRequired,
};

export default Slider;
