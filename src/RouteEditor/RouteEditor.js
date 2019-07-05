import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import Marker             from '../Marker/Marker';
import * as R             from 'ramda';
import {MARKER_RADIUS}    from '../Constants/Marker';
import './RouteEditor.css';

export default class RouteEditor extends Component {
    constructor(props) {
        super(props);

        const {route} = this.props;
        this.state = {
            url: (route.photo === null ? '/public/img/route-img/route.jpg' : route.photo.url),
            movingPointerIndex: null
        }
    }

    addPointer = (x, y) => {
        const {updatePointers, pointers} = this.props;
        updatePointers(R.append({x: x, y: y, dx: 0, dy: 0, angle: 0}, pointers));
    };

    onMouseDown = (event) => {
        if (event.nativeEvent.which === 1) {
            let imageContainerRect = this.imageContainerRef.getBoundingClientRect();
            if (!this.isMoving) {
                this.addPointer((event.pageX - imageContainerRect.x) / imageContainerRect.width * 100, (event.pageY - imageContainerRect.y) / imageContainerRect.height * 100);
            }
        }
    };

    onMouseMove = (event) => {
        const {updatePointers, pointers} = this.props;
        const {movingPointerIndex} = this.state;
        if (movingPointerIndex !== null) {
            let imageContainerRect = this.imageContainerRef.getBoundingClientRect();
            let pointersCopy = R.clone(pointers);
            let index = movingPointerIndex;
            pointersCopy[index].dx = (event.pageX - imageContainerRect.x) / imageContainerRect.width * 100 - pointersCopy[index].x;
            pointersCopy[index].dy = (event.pageY - imageContainerRect.y) / imageContainerRect.height * 100 - pointersCopy[index].y;
            updatePointers(pointersCopy);
        }
    };

    rotate = (index) => {
        const {updatePointers, pointers} = this.props;
        let pointersCopy = R.clone(pointers);
        pointersCopy[index].angle = (pointersCopy[index].angle + 90) % 360;
        updatePointers(pointersCopy);
    };

    onMouseUp = (event) => {
        const {updatePointers, pointers} = this.props;
        const {movingPointerIndex} = this.state;
        if (this.isMoving) {
            let dx = pointers[movingPointerIndex].dx;
            let dy = pointers[movingPointerIndex].dy;
            if ((dx ** 2 + dy ** 2) ** 0.5 <= 1) {
                this.rotate(movingPointerIndex);
                this.setState({movingPointerIndex: null});
            } else {
                let pointersCopy = R.clone(pointers);
                let imageContainerRect = this.imageContainerRef.getBoundingClientRect();
                let dx = (event.pageX - imageContainerRect.x) / imageContainerRect.width * 100 - pointersCopy[movingPointerIndex].x;
                let dy = (event.pageY - imageContainerRect.y) / imageContainerRect.height * 100 - pointersCopy[movingPointerIndex].y;
                pointersCopy[movingPointerIndex].x = pointersCopy[movingPointerIndex].x + dx;
                pointersCopy[movingPointerIndex].y = pointersCopy[movingPointerIndex].y + dy;
                pointersCopy[movingPointerIndex].dx = 0;
                pointersCopy[movingPointerIndex].dy = 0;
                updatePointers(pointersCopy);
                this.setState({movingPointerIndex: null});
            }
            this.isMoving = false;
        }
    };

    removePointer = (index) => {
        const {updatePointers, pointers} = this.props;
        updatePointers(R.remove(index, 1, pointers));
    };

    onContextMenu = (event) => {
        event.preventDefault();
    };

    onStartMoving = (index, pageX, pageY) => {
        const {updatePointers, pointers} = this.props;
        this.isMoving = true;
        let pointersCopy = R.clone(pointers);
        let imageContainerRect = this.imageContainerRef.getBoundingClientRect();
        pointersCopy[index].dx = (pageX - imageContainerRect.x) / imageContainerRect.width * 100 - pointersCopy[index].x;
        pointersCopy[index].dy = (pageY - imageContainerRect.y) / imageContainerRect.height * 100 - pointersCopy[index].y;
        updatePointers(pointersCopy);
        this.setState({movingPointerIndex: index});
    };

    render() {
        const {
                  editable, routePhoto, route, pointers,
              } = this.props;
        let mapIndexed = R.addIndex(R.map);
        return <div className="modal__track-image-wrapper">
            <div className="route-editor__inner-container">
                <div className="route-editor__img-container" ref={(ref) => this.imageContainerRef = ref}
                     onMouseDown={editable ? this.onMouseDown : null}
                     onMouseUp={editable ? this.onMouseUp : null}
                     onMouseMove={editable ? this.onMouseMove : null}
                     onContextMenu={this.onContextMenu}>
                    <img className="route-editor__img"
                         src={routePhoto} alt={route.name}/>
                    {mapIndexed((pointer, index) => <Marker key={index}
                                                            removePointer={editable ? (() => this.removePointer(index)) : null}
                                                            onStartMoving={editable ? ((x, y) => this.onStartMoving(index, x, y)) : null}
                                                            angle={pointer.angle}
                                                            radius={MARKER_RADIUS}
                                                            dx={pointer.dx}
                                                            dy={pointer.dy}
                                                            left={pointer.x}
                                                            top={pointer.y}/>, pointers)}
                </div>
            </div>
        </div>
    }
}

RouteEditor.propTypes = {
    routePhoto: PropTypes.string.isRequired,
    route: PropTypes.object.isRequired,
    pointers: PropTypes.array.isRequired,
    editable: PropTypes.bool.isRequired,
    updatePointers: PropTypes.func.isRequired,
};
