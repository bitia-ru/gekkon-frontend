import React from 'react';
import { StyleSheet, css } from '@/v2/aphrodite';

const ContentWithLeftPanel = ({ children }) => (
  <div className={css(style.container)}>
    <div>
    </div>
    <div>
      {children}
    </div>
  </div>
);

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: '1600px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '30px',
    paddingRight: '30px',
    paddingBottom: '60px',
  },
});

export default ContentWithLeftPanel;
