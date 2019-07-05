import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import './Marker.css';

export default class Marker extends Component {

    onMouseDown = (event) => {
        const {onStartMoving, removePointer} = this.props;
        if (event.nativeEvent.which === 1) {
            onStartMoving(event.pageX, event.pageY);
        }
        if (event.nativeEvent.which === 3) {
            removePointer();
        }
    };

    onContextMenu = (event) => {
        event.preventDefault();
    };

    render() {
        const {
                  left, top, dx, dy, radius, angle,
              } = this.props;
        return <React.Fragment>
            <div className="marker"
                 style={{
                     left: `calc(${left + dx}% - ${radius}px)`,
                     top: `calc(${top + dy}% - ${radius}px)`
                 }}>
                <img draggable={false} src="/public/img/marker-img/hold-mark.png" style={{
                    width: `${radius * 2}px`,
                    height: `${radius * 2}px`,
                    transform: `rotate(${angle}deg)`
                }}
                     onMouseDown={this.onMouseDown} onContextMenu={this.onContextMenu}/>
            </div>
        </React.Fragment>;
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
    angle: PropTypes.number.isRequired
};

Marker.defaultProps = {
    onStartMoving: null,
    removePointer: null,
};
