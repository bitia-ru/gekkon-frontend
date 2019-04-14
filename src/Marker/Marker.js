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
        return <React.Fragment>
            <div className="marker"
                 style={{
                     left: `calc(${this.props.left + this.props.dx}% - ${this.props.radius}px)`,
                     top: `calc(${this.props.top + this.props.dy}% - ${this.props.radius}px)`
                 }}>
                <img draggable={false} src="/public/img/marker-img/hold-mark.png" style={{
                    width: `${this.props.radius * 2}px`,
                    height: `${this.props.radius * 2}px`,
                    transform: `rotate(${this.props.angle}deg)`
                }}
                     onMouseDown={this.onMouseDown} onContextMenu={this.onContextMenu}/>
            </div></React.Fragment>;
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
    onStartMoving: PropTypes.func.isRequired
};
