import React from 'react';
import { StyleSheet, css } from '../aphrodite';

const ContentWithLeftPanel = ({ children, panelTitle, panel }) => (
  <div className={css(style.container)}>
    <div className={css(style.panel)}>
      <div className={css(style.panelTitle)}>{panelTitle}</div>
      {panel}
    </div>
    <div className={css(style.content)}>
      {children}
    </div>
  </div>
);

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexFlow: 'row',
    flex: 1,
    width: '100%',
    boxSizing: 'border-box',
    maxWidth: '1600px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '30px',
    paddingRight: '30px',
    paddingBottom: '60px',
  },
  panelTitle: {
    fontWeight: 'bold',
    fontFamily: 'GilroyBold',
    marginBottom: '15px',
  },
  panel: {
    flex: 1,
    padding: '15px',
  },
  content: {
    flex: 3,
  },
});

export default ContentWithLeftPanel;
