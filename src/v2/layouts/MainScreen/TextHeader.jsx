import React from 'react';
import { css, StyleSheet } from '../../aphrodite';

const TextHeader = ({ title }) => (
  <div className={css(style.container)}>
    {title}
  </div>
);

const style = StyleSheet.create({
  container: {
    width: '100%',
    boxSizing: 'border-box',
    maxWidth: '1600px',
    minHeight: '195px',
    paddingTop: '100px',
    lineHeight: '65px',
    paddingLeft: '30px',
    paddingRight: '30px',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: '24px',
  },
});

export default TextHeader;
