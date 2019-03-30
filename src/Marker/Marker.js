import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import './Marker.css';

export default class Marker extends Component {

    onMouseDown = (event) => {
        if (event.nativeEvent.which === 1) {
            this.props.onStartMoving(event.pageX, event.pageY);
        }
        if (event.nativeEvent.which === 3) {
            this.props.removePointer();
        }
    };

    onContextMenu = (event) => {
        event.preventDefault();
    };

    render() {
        return <React.Fragment>{(this.props.left && (this.props.left - this.props.radius + this.props.dx > 2 * this.props.radius && this.props.left - this.props.radius + this.props.dx < this.props.width - 2 * this.props.radius)) ?
            <div className="marker"
                 style={{
                     left: this.props.left - this.props.radius + this.props.dx,
                     top: this.props.top - this.props.radius + this.props.dy
                 }}>
                <img draggable={false} src="/public/img/marker-img/hold-mark.png" style={{
                    width: `${this.props.radius * 2}px`,
                    height: `${this.props.radius * 2}px`,
                    transform: `rotate(${this.props.angle}deg)`
                }}
                     onMouseDown={this.onMouseDown} onContextMenu={this.onContextMenu}/>
            </div> : ''}</React.Fragment>;
    }
}

Marker.propTypes = {
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    dx: PropTypes.number.isRequired,
    dy: PropTypes.number.isRequired,
    radius: PropTypes.number.isRequired,
    angle: PropTypes.number.isRequired,
    removePointer: PropTypes.func.isRequired,
    onStartMoving: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired
};
