import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import './Slider.css';

export default class Slider extends Component {

    render() {
        return <div className="slider__decor">
            <div className="slider__indicator-block">
                <div className="slider__indicator-status"
                     style={{
                         width: `${this.props.position === 0 ? 100 : 100 / this.props.numOfPositions}%`,
                         transform: `translateX(${this.props.position === 0 ? 0 : 100 * (this.props.position - 1)}%)`
                     }}></div>
            </div>
        </div>;
    }
}

Slider.propTypes = {
    numOfPositions: PropTypes.number.isRequired,
    position: PropTypes.number.isRequired
};
