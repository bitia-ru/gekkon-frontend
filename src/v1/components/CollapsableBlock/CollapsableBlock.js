import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import './CollapsableBlock.css';
import { wrapHashtagsInText, wrapWebLinksInText } from '@/v2/utils/text_processors';

const CollapsableBlock = ({ title, text, isCollapsed, onCollapseChange, history }) => {
  const textWithLinks = wrapWebLinksInText(text);
  const path = history.location;
  const textWithHashtags = wrapHashtagsInText(path, textWithLinks);
  return (
    <div>
      <button
        onClick={() => onCollapseChange(!isCollapsed)}
        type="button"
        className={
          `collapsable-block__header${
            isCollapsed
              ? ''
              : ' collapsable-block__header_active'}`
        }
      >
        {title}
      </button>
      <React.Fragment>
        {
          isCollapsed
            ? ''
            : (
              <div className="collapsable-block__content">
                {textWithHashtags}
              </div>
            )
        }
      </React.Fragment>
    </div>
  );
};


CollapsableBlock.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  onCollapseChange: PropTypes.func.isRequired,
  history: PropTypes.object,
};

export default withRouter(CollapsableBlock);
