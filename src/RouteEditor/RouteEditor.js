import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import Marker             from '../Marker/Marker';
import * as R             from 'ramda';
import {MARKER_RADIUS}    from '../Constants/Marker';
import './RouteEditor.css';

export default class RouteEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url: (this.props.route.photo === null ? '/public/img/route-img/route.jpg' : this.props.route.photo.url),
            movingPointerIndex: null,
            movingStartPosX: 0,
            movingStartPosY: 0
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.props.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.props.updateDimensions);
    }


    addPointer = (mouseX, mouseY) => {
        if (mouseX - this.props.currentLeftShift < 0 || mouseX - this.props.currentLeftShift > this.props.currentImageW) {
            return
        }
        if (mouseY - this.props.currentTopShift < 0 || mouseY - this.props.currentTopShift > this.props.currentImageH) {
            return
        }
        let x = (mouseX - this.props.currentLeftShift) / this.props.currentImageW * this.props.realImageW;
        let y = (mouseY - this.props.currentTopShift) / this.props.currentImageH * this.props.realImageH;
        this.props.updatePointers(R.append({x: x, y: y, dx: 0, dy: 0, angle: 0}, this.props.pointers));
    };

    onMouseDown = (event) => {
        if (event.nativeEvent.which === 1) {
            if (!this.isMoving) {
                this.addPointer(event.pageX - this.props.containerX, event.pageY - this.props.containerY);
            }
        }
    };

    onMouseMove = (event) => {
        if (this.state.movingPointerIndex !== null) {
            let mouseX = event.pageX - this.props.containerX;
            let mouseY = event.pageY - this.props.containerY;
            if (mouseX - this.props.currentLeftShift < 0 || mouseX - this.props.currentLeftShift > this.props.currentImageW) {
                return
            }
            if (mouseY - this.props.currentTopShift < 0 || mouseY - this.props.currentTopShift > this.props.currentImageH) {
                return
            }
            let pointers = R.clone(this.props.pointers);
            let index = this.state.movingPointerIndex;
            pointers[index].dx = mouseX - pointers[index].x / this.props.realImageW * this.props.currentImageW - this.props.currentLeftShift;
            pointers[index].dy = mouseY - pointers[index].y / this.props.realImageH * this.props.currentImageH - this.props.currentTopShift;
            this.props.updatePointers(pointers);
        }
    };

    rotate = (index) => {
        let pointers = R.clone(this.props.pointers);
        pointers[index].angle = (pointers[index].angle + 90) % 360;
        this.props.updatePointers(pointers);
    };

    onMouseUp = (event) => {
        if (this.isMoving) {
            let dx = this.props.pointers[this.state.movingPointerIndex].dx;
            let dy = this.props.pointers[this.state.movingPointerIndex].dy;
            if (dx ** 2 + dy ** 2 <= MARKER_RADIUS ** 2) {
                this.rotate(this.state.movingPointerIndex);
                this.setState({movingPointerIndex: null});
            } else {
                let pointers = R.clone(this.props.pointers);
                let dx = pointers[this.state.movingPointerIndex].dx / this.props.currentImageW * this.props.realImageW;
                let dy = pointers[this.state.movingPointerIndex].dy / this.props.currentImageH * this.props.realImageH;
                pointers[this.state.movingPointerIndex].x = pointers[this.state.movingPointerIndex].x + dx;
                pointers[this.state.movingPointerIndex].y = pointers[this.state.movingPointerIndex].y + dy;
                pointers[this.state.movingPointerIndex].dx = 0;
                pointers[this.state.movingPointerIndex].dy = 0;
                this.props.updatePointers(pointers);
                this.setState({movingPointerIndex: null});
            }
            this.isMoving = false;
        }
    };

    removePointer = (index) => {
        this.props.updatePointers(R.remove(index, 1, this.props.pointers));
    };

    onContextMenu = (event) => {
        event.preventDefault();
    };

    onStartMoving = (index, pageX, pageY) => {
        this.isMoving = true;
        let pointers = R.clone(this.props.pointers);
        pointers[index].dx = (pageX - this.props.containerX) - pointers[index].x / this.props.realImageW * this.props.currentImageW - this.props.currentLeftShift;
        pointers[index].dy = (pageY - this.props.containerY) - pointers[index].y / this.props.realImageH * this.props.currentImageH - this.props.currentTopShift;
        this.props.updatePointers(pointers);
        this.setState({movingPointerIndex: index});
    };

    overflow = () => {
        if (this.props.realImageW / this.props.realImageH > this.props.currentContainerW / this.props.currentContainerH) {
            return true;
        }
        return false;
    };

    render() {
        let mapIndexed = R.addIndex(R.map);
        return <div className="route-editor" ref={(ref) => this.props.setImageContainer(ref)}
                    onMouseDown={this.props.editable ? this.onMouseDown : (() => {
                    })}
                    onMouseUp={this.props.editable ? this.onMouseUp : (() => {
                    })}
                    onMouseMove={this.props.editable ? this.onMouseMove : (() => {
                    })}
                    onContextMenu={this.onContextMenu}
                    style={{
                        backgroundImage: `url(${this.state.url})`,
                        backgroundSize: this.overflow() ? 'cover' : 'contain'
                    }}>
            {mapIndexed((pointer, index) => <Marker key={index}
                                                    width={this.props.currentContainerW}
                                                    removePointer={this.props.editable ? (() => this.removePointer(index)) : (() => {
                                                    })}
                                                    onStartMoving={this.props.editable ? ((x, y) => this.onStartMoving(index, x, y)) : (() => {
                                                    })}
                                                    angle={pointer.angle}
                                                    radius={MARKER_RADIUS}
                                                    dx={pointer.dx}
                                                    dy={pointer.dy}
                                                    left={pointer.x / this.props.realImageW * this.props.currentImageW + this.props.currentLeftShift}
                                                    top={pointer.y / this.props.realImageH * this.props.currentImageH + this.props.currentTopShift}/>, this.props.pointers)}</div>
    }
}

RouteEditor.propTypes = {
    route: PropTypes.object.isRequired,
    pointers: PropTypes.array.isRequired,
    editable: PropTypes.bool.isRequired,
    updatePointers: PropTypes.func.isRequired,
    setImageContainer: PropTypes.func.isRequired,
    currentContainerW: PropTypes.number.isRequired,
    currentContainerH: PropTypes.number.isRequired,
    containerX: PropTypes.number.isRequired,
    containerY: PropTypes.number.isRequired,
    realImageW: PropTypes.number.isRequired,
    realImageH: PropTypes.number.isRequired,
    currentImageW: PropTypes.number.isRequired,
    currentImageH: PropTypes.number.isRequired,
    currentLeftShift: PropTypes.number.isRequired,
    currentTopShift: PropTypes.number.isRequired,
    updateDimensions: PropTypes.func.isRequired
};
