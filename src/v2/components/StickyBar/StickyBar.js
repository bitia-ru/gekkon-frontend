import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '../../aphrodite';

const StickyBar = ({
  children, loading, hideLoaded,
}) => {
  return (
    <div className="sticky-bar">
      <div className="wrapper">
        {children}
      </div>
      <div className={css(styles.stickyBarItem)}>
        <div
          style={(loading ? {} : (hideLoaded ? { opacity: 0 } : {}))}
          className={css(styles.stickyBarItemIndicator,
            loading ? styles.stickyBarItemIndicatorActive : '',
            styles.loading)}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  stickyBarItem: {
    position: 'sticky',
    bottom: '0',
    height: '3px',
    width: '100%',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    zIndex: '2',
  },
  loading: {
    animationName: [{
      '0%': {
        width: '0',
      },
    }],
  },
  stickyBarItemIndicator: {
    backgroundColor: '#006CEB',
    height: '100%',
    width: '100%',
    transition: 'width 0.5s ease-out,opacity 0.5s linear',
  },
  stickyBarItemIndicatorActive: {
    animation: 'loading 20s cubic-bezier(0, 0.78, 1, 0.53) 0s infinite',
    opacity: '1',
  },
});

StickyBar.propTypes = {
  hideLoaded: PropTypes.bool,
  loading: PropTypes.bool,
};

StickyBar.defaultProps = {
  hideLoaded: false,
  loading: true,
};

export default StickyBar;
