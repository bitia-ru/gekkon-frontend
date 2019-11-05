import React from 'react';
import PropTypes from 'prop-types';
import './StickyBar.css';

const StickyBar = ({
  children, loading, hideLoaded,
}) => {
  const loadingClass = (loading ? ' sticky-bar__item-indicator_active' : '');
  return (
    <div className="sticky-bar">
      <div className="wrapper">
        {children}
      </div>

      <div className="sticky-bar__item">
        <div
          style={(loading ? {} : (hideLoaded ? { opacity: 0 } : {}))}
          className={`sticky-bar__item-indicator${loadingClass}`}
        />
      </div>
    </div>
  );
};

StickyBar.propTypes = {
  hideLoaded: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
};

StickyBar.defaultProps = {
  hideLoaded: false,
};

export default StickyBar;
