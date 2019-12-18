import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Marker.css';

export default class Marker extends Component {
    onMouseDown = (event) => {
      const { onStartMoving, removePointer } = this.props;
      if (event.nativeEvent.which === 1 && onStartMoving) {
        onStartMoving(event.pageX, event.pageY);
      }
      if (event.nativeEvent.which === 3 && removePointer) {
        removePointer();
      }
    };

    onContextMenu = (event) => {
      event.preventDefault();
    };

    xShift = () => {
      const { angle, radius } = this.props;
      if (angle === 0 || angle === 90) {
        return radius;
      }
      return -radius;
    };

    yShift = () => {
      const { angle, radius } = this.props;
      if (angle === 90 || angle === 180) {
        return radius;
      }
      return -radius;
    };

    render() {
      const {
        left, top, dx, dy, radius, angle,
      } = this.props;
      return (
        <div
          draggable={false}
          className="marker"
          style={{
            left: `calc(${left + dx}% - ${radius - this.xShift()}px)`,
            top: `calc(${top + dy}% - ${radius - this.yShift()}px)`,
          }}
        >
          <img
            draggable={false}
            src={require('./images/hold-mark.png')}
            className="marker__image"
            style={{
              width: `${radius * 2}px`,
              height: `${radius * 2}px`,
              transform: `rotate(${angle}deg)`,
            }}
            onMouseDown={this.onMouseDown}
            onContextMenu={this.onContextMenu}
            alt=""
          />
        </div>
      );
    }
}

Marker.propTypes = {
  onStartMoving: PropTypes.func,
  removePointer: PropTypes.func,
  left: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  dx: PropTypes.number.isRequired,
  dy: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  angle: PropTypes.number.isRequired,
};

Marker.defaultProps = {
  onStartMoving: null,
  removePointer: null,
};
