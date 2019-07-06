import React     from 'react';
import PropTypes from 'prop-types';
import './CollapsableBlock.css';

const CollapsableBlock = ({
                              title, text, isCollapsed, onCollapseChange,
                          }) => (
    <div>
        <button onClick={() => onCollapseChange(!isCollapsed)}
                type="button"
                className={
                    'collapsable-block__header' + (
                        isCollapsed
                            ? ''
                            : ' collapsable-block__header_active'
                    )
                }>
            {title}
        </button>
        <React.Fragment>
            {
                isCollapsed
                    ? ''
                    : (
                        <div className="collapsable-block__content">
                            {text}
                        </div>
                    )
            }
        </React.Fragment>
    </div>
);

CollapsableBlock.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    isCollapsed: PropTypes.bool.isRequired,
    onCollapseChange: PropTypes.func.isRequired,
};

export default CollapsableBlock;
