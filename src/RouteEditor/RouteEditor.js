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
            movingPointerIndex: null
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.props.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.props.updateDimensions);
    }


    addPointer = (x, y) => {
        this.props.updatePointers(R.append({x: x, y: y, dx: 0, dy: 0, angle: 0}, this.props.pointers));
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
        if (this.state.movingPointerIndex !== null) {
            let imageContainerRect = this.imageContainerRef.getBoundingClientRect();
            let pointers = R.clone(this.props.pointers);
            let index = this.state.movingPointerIndex;
            pointers[index].dx = (event.pageX - imageContainerRect.x) / imageContainerRect.width * 100 - pointers[index].x;
            pointers[index].dy = (event.pageY - imageContainerRect.y) / imageContainerRect.height * 100 - pointers[index].y;
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
            if ((dx ** 2 + dy ** 2) ** 0.5 <= 1) {
                this.rotate(this.state.movingPointerIndex);
                this.setState({movingPointerIndex: null});
            } else {
                let pointers = R.clone(this.props.pointers);
                let imageContainerRect = this.imageContainerRef.getBoundingClientRect();
                let dx = (event.pageX - imageContainerRect.x) / imageContainerRect.width * 100 - pointers[this.state.movingPointerIndex].x;
                let dy = (event.pageY - imageContainerRect.y) / imageContainerRect.height * 100 - pointers[this.state.movingPointerIndex].y;
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
        let imageContainerRect = this.imageContainerRef.getBoundingClientRect();
        pointers[index].dx = (pageX - imageContainerRect.x) / imageContainerRect.width * 100 - pointers[index].x;
        pointers[index].dy = (pageY - imageContainerRect.y) / imageContainerRect.height * 100 - pointers[index].y;
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
        return <div className="modal__track-image-wrapper">
            <div className="route-editor__inner-container">
                <div className="route-editor__img-container" ref={(ref) => this.imageContainerRef = ref}
                     onMouseDown={this.props.editable ? this.onMouseDown : (() => {
                     })}
                     onMouseUp={this.props.editable ? this.onMouseUp : (() => {
                     })}
                     onMouseMove={this.props.editable ? this.onMouseMove : (() => {
                     })}
                     onContextMenu={this.onContextMenu}>
                    <img className="route-editor__img"
                         src={this.props.routePhoto} alt={this.props.route.name}/>
                    {mapIndexed((pointer, index) => <Marker key={index}
                                                            removePointer={this.props.editable ? (() => this.removePointer(index)) : (() => {
                                                            })}
                                                            onStartMoving={this.props.editable ? ((x, y) => this.onStartMoving(index, x, y)) : (() => {
                                                            })}
                                                            angle={pointer.angle}
                                                            radius={MARKER_RADIUS}
                                                            dx={pointer.dx}
                                                            dy={pointer.dy}
                                                            left={pointer.x}
                                                            top={pointer.y}/>, this.props.pointers)}
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
    updatePointers: PropTypes.func.isRequired
};
