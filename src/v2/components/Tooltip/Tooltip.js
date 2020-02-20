import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '../../aphrodite';

const Tooltip = ({ text }) => (
  <div className={css(styles.tooltip, styles.tooltipLeftSide)}>{text}</div>
);

const styles = StyleSheet.create({
  tooltip: {
    fontSize: '12px',
    fontFamily: ['GilroyBold', 'sans-serif'],
    whiteSpace: 'nowrap',
    display: 'inline-block',
    color: ' #1f1f1f',
    backgroundColor: '#ffffff',
    paddingLeft: '10px',
    paddingRight: '10px',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
  },
  tooltipLeftSide: {
    ':before': {
      position: 'absolute',
      content: '\'\'',
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '0',
      height: '0',
      borderStyle: 'solid',
      borderWidth: '5px 0 5px 6px',
      borderColor: 'transparent transparent transparent #ffffff',
    },
  },
});

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Tooltip;
