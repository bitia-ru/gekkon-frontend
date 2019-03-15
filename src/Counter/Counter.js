import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import './Counter.css';

export default class Counter extends Component {
    render() {
        return <div className="counter">
            <span className="counter__num">{this.props.number}</span> {this.props.text}
        </div>;
    }
}

Counter.propTypes = {
    number: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired
};
