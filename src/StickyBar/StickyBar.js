import React     from 'react';
import PropTypes from 'prop-types';
import './StickyBar.css';

const StickyBar = ({
                       content, loading, hideLoaded,
                   }) => {
    const loadingClass = (loading ? ' sticky-bar__item-indicator_active' : '');
    return (
        <div className="sticky-bar">
            <div className="wrapper">
                {content}
            </div>

            <div className="sticky-bar__item">
                <div style={(loading ? {} : (hideLoaded ? {opacity: 0} : {}))}
                     className={'sticky-bar__item-indicator' + loadingClass}></div>
            </div>
        </div>
    );
};

StickyBar.propTypes = {
    content: PropTypes.object,
    hideLoaded: PropTypes.bool,
    loading: PropTypes.bool.isRequired,
};

StickyBar.defaultProps = {
    content: null,
    hideLoaded: false,
};

export default StickyBar;
