import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Marker from '../Marker/Marker';
import { MARKER_RADIUS } from '../Constants/Marker';
import { SHORT_CLICK_DELAY } from '../Constants/Route';
import './RouteEditor.css';

export default class RouteEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movingPointerIndex: null,
    };
    this.timerId = null;
    this.isRotate = true;
  }

    addPointer = (x, y) => {
      const { pointers, updatePointers } = this.props;
      updatePointers(R.append({
        x: x + this.getXShift(0), y: y + this.getYShift(0), dx: 0, dy: 0, angle: 0,
      }, pointers));
    };

    onMouseDown = (event) => {
      if (event.nativeEvent.which === 1) {
        const imageContainerRect = this.imageContainerRef.getBoundingClientRect();
        if (!this.isMoving) {
          this.addPointer(
            (event.pageX - imageContainerRect.x) / imageContainerRect.width * 100,
            (event.pageY - imageContainerRect.y) / imageContainerRect.height * 100,
          );
        }
      }
    };

    onMouseMove = (event) => {
      const { updatePointers, pointers } = this.props;
      const { movingPointerIndex } = this.state;
      if (movingPointerIndex !== null) {
        const imageContainerRect = this.imageContainerRef.getBoundingClientRect();
        const pointersCopy = R.clone(pointers);
        const index = movingPointerIndex;
        const { angle } = pointersCopy[index];
        const xOld = (event.pageX - imageContainerRect.x) / imageContainerRect.width * 100;
        const yOld = (event.pageY - imageContainerRect.y) / imageContainerRect.height * 100;
        pointersCopy[index].dx = xOld - pointersCopy[index].x + this.getXShift(angle);
        pointersCopy[index].dy = yOld - pointersCopy[index].y + this.getYShift(angle);
        updatePointers(pointersCopy);
      }
    };

    rotate = (index) => {
      const { pointers, updatePointers } = this.props;
      const pointersCopy = R.clone(pointers);
      const { angle } = pointersCopy[index];
      pointersCopy[index].x += pointersCopy[index].dx;
      pointersCopy[index].y += pointersCopy[index].dy;
      pointersCopy[index].x -= this.getXShift(angle);
      pointersCopy[index].y -= this.getYShift(angle);
      pointersCopy[index].dx = 0;
      pointersCopy[index].dy = 0;
      pointersCopy[index].angle = (angle + 90) % 360;
      pointersCopy[index].x += this.getXShift(pointersCopy[index].angle);
      pointersCopy[index].y += this.getYShift(pointersCopy[index].angle);
      updatePointers(pointersCopy);
    };

    getXShift = (angle) => {
      const imageContainerRect = this.imageContainerRef.getBoundingClientRect();
      switch (angle) {
      case 0:
        return -MARKER_RADIUS / imageContainerRect.width * 100;
      case 90:
        return -MARKER_RADIUS / imageContainerRect.width * 100;
      case 180:
        return MARKER_RADIUS / imageContainerRect.width * 100;
      case 270:
        return MARKER_RADIUS / imageContainerRect.width * 100;
      default:
        break;
      }
      return 0;
    };

    getYShift = (angle) => {
      const imageContainerRect = this.imageContainerRef.getBoundingClientRect();
      switch (angle) {
      case 0:
        return MARKER_RADIUS / imageContainerRect.height * 100;
      case 90:
        return -MARKER_RADIUS / imageContainerRect.height * 100;
      case 180:
        return -MARKER_RADIUS / imageContainerRect.height * 100;
      case 270:
        return MARKER_RADIUS / imageContainerRect.height * 100;
      default:
        break;
      }
      return 0;
    };

    onMouseUp = (event) => {
      if (this.isMoving) {
        clearTimeout(this.timerId);
        const { movingPointerIndex } = this.state;
        const { pointers, updatePointers } = this.props;
        const imageContainerRect = this.imageContainerRef.getBoundingClientRect();
        if (this.isRotate) {
          this.rotate(movingPointerIndex);
          this.setState({ movingPointerIndex: null });
        } else {
          const pointersCopy = R.clone(pointers);
          const { angle } = pointersCopy[movingPointerIndex];
          const xOld = (event.pageX - imageContainerRect.x) / imageContainerRect.width * 100;
          const yOld = (event.pageY - imageContainerRect.y) / imageContainerRect.height * 100;
          const dx = xOld - pointersCopy[movingPointerIndex].x + this.getXShift(angle);
          const dy = yOld - pointersCopy[movingPointerIndex].y + this.getYShift(angle);
          pointersCopy[movingPointerIndex].x += dx;
          pointersCopy[movingPointerIndex].y += dy;
          pointersCopy[movingPointerIndex].dx = 0;
          pointersCopy[movingPointerIndex].dy = 0;
          updatePointers(pointersCopy);
          this.setState({ movingPointerIndex: null });
        }
        this.isMoving = false;
      }
    };

    removePointer = (index) => {
      const { pointers, updatePointers } = this.props;
      updatePointers(R.remove(index, 1, pointers));
    };

    onContextMenu = (event) => {
      event.preventDefault();
    };

    onStartMoving = (index, pageX, pageY) => {
      const { pointers, updatePointers } = this.props;
      this.isMoving = true;
      const self = this;
      this.isRotate = true;
      this.timerId = setTimeout(() => { self.isRotate = false; return true; }, SHORT_CLICK_DELAY);
      const pointersCopy = R.clone(pointers);
      const imageContainerRect = this.imageContainerRef.getBoundingClientRect();
      const { angle } = pointersCopy[index];
      const xOld = (pageX - imageContainerRect.x) / imageContainerRect.width * 100;
      const yOld = (pageY - imageContainerRect.y) / imageContainerRect.height * 100;
      pointersCopy[index].dx = xOld - pointersCopy[index].x + this.getXShift(angle);
      pointersCopy[index].dy = yOld - pointersCopy[index].y + this.getYShift(angle);
      updatePointers(pointersCopy);
      this.setState({ movingPointerIndex: index });
    };

    render() {
      const {
        editable, routePhoto, route, pointers, onImageLoad, routeImageLoading,
      } = this.props;
      const mapIndexed = R.addIndex(R.map);
      return (
        <div className="modal__track-image-wrapper" draggable={false}>
          <div className="route-editor__inner-container" draggable={false}>
            <div
              draggable={false}
              className="route-editor__img-container"
              ref={(ref) => {
                this.imageContainerRef = ref;
              }}
              role="button"
              tabIndex={0}
              style={{ outline: 'none' }}
              onMouseDown={editable ? this.onMouseDown : null}
              onMouseUp={editable ? this.onMouseUp : null}
              onMouseMove={editable ? this.onMouseMove : null}
              onContextMenu={this.onContextMenu}
            >
              <img
                draggable={false}
                className="route-editor__img"
                src={routePhoto}
                alt={route.name}
                onLoad={onImageLoad}
                style={{ visibility: routeImageLoading ? 'hidden' : 'visible' }}
              />
              {
                !routeImageLoading && (
                <>
                  {
                    mapIndexed((pointer, index) => (
                      <Marker
                        key={index}
                        removePointer={
                          editable ? (() => this.removePointer(index)) : null
                        }
                        onStartMoving={
                          editable
                            ? ((x, y) => this.onStartMoving(index, x, y))
                            : null
                        }
                        angle={pointer.angle}
                        radius={MARKER_RADIUS}
                        dx={pointer.dx}
                        dy={pointer.dy}
                        left={pointer.x}
                        top={pointer.y}
                      />
                    ), pointers)}
                </>
                )
              }
            </div>
          </div>
        </div>
      );
    }
}

RouteEditor.propTypes = {
  routeImageLoading: PropTypes.bool,
  routePhoto: PropTypes.string.isRequired,
  route: PropTypes.object.isRequired,
  pointers: PropTypes.array.isRequired,
  editable: PropTypes.bool.isRequired,
  updatePointers: PropTypes.func.isRequired,
  onImageLoad: PropTypes.func.isRequired,
};

RouteEditor.defaultProps = {
  routeImageLoading: false,
};
