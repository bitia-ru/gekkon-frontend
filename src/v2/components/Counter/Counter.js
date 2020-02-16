import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '../../aphrodite';

const Counter = ({
  number, text,
}) => (
  <div className={css(styles.counter)}>
    <span className={css(styles.counterNum)}>{number}</span>
    {' '}
    {text}
  </div>
);

const styles = StyleSheet.create({
  counter: {
    color: '#828282',
    fontSize: '16px',
    fontFamily: ['GilroyRegular', 'sans-serif'],
    display: 'flex',
    alignItems: 'center',
    '@media screen and (max-width: 1440px)': {
      fontSize: '14px',
    },
  },
  counterNum: {
    marginRight: '4px',
  },
});

Counter.propTypes = {
  number: PropTypes.number,
  text: PropTypes.string.isRequired,
};

export default Counter;
