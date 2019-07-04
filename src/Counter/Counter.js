import React     from 'react';
import PropTypes from 'prop-types';
import './Counter.css';

const Counter = ({
                     number, text,
                 }) => (
    <div className="counter">
        <span className="counter__num">{number}</span> {text}
    </div>
);

Counter.propTypes = {
    number: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
};

export default Counter;
