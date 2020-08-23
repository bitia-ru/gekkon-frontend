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
  redpointsCounter: { color: '#E24D4D' },
  flashesCounter: { color: '#000000' },
  counterNum: {
    marginRight: '4px',
    width: '28px',
    height: '28px',
    borderRadius: '14px',
    textAlign: 'center',
    lineHeight: '28px',
  },
  redpointsNum: {
    backgroundColor: '#E24D4D',
    color: '#FFFFFF',
  },
  flashesNum: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
  },
});

const Counter = ({ number, text, type }) => (
  <div className={css(styles.counter)}>
    <div
      className={
        css(
          styles.counterNum,
          type === 'redpoints' && styles.redpointsNum,
          type === 'flashes' && styles.flashesNum,
        )
      }
    >
      {number}
    </div>
    <span
      className={
        css(
          type === 'redpoints' && styles.redpointsCounter,
          type === 'flashes' && styles.flashesCounter,
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
