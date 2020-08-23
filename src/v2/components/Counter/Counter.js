import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '../../aphrodite';

const styles = StyleSheet.create({
  counter: {
    fontSize: '16px',
    fontFamily: ['GilroyRegular', 'sans-serif'],
    display: 'flex',
    alignItems: 'center',
    '@media screen and (max-width: 1440px)': { fontSize: '14px' },
  },
  counterNum: { marginRight: '4px' },
  counterNumWrapper: {
    color: '#FFFFFF',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    textAlign: 'center',
    lineHeight: '28px',
  },
  defaultCounterColor: { color: '#828282' },
  redpointsTextColor: { color: '#E24D4D' },
  flashesTextColor: { color: '#000000' },
  redpointsNumColor: { backgroundColor: '#E24D4D' },
  flashesNumColor: { backgroundColor: '#000000' },
});

const Counter = ({ number, text, type }) => (
  <div className={css(styles.counter)}>
    <div
      className={
        css(
          styles.counterNum,
          !type && styles.defaultCounterColor,
          type && styles.counterNumWrapper,
          type === 'redpoints' && styles.redpointsNumColor,
          type === 'flashes' && styles.flashesNumColor,
        )
      }
    >
      {number}
    </div>
    <span
      className={
        css(
          !type && styles.defaultCounterColor,
          type === 'redpoints' && styles.redpointsTextColor,
          type === 'flashes' && styles.flashesTextColor,
        )
      }
    >
      {' '}
      {text}
    </span>
  </div>
);

Counter.propTypes = {
  number: PropTypes.number,
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default Counter;
