import React from 'react';
import PropTypes from 'prop-types';
import './CollapsableBlock.css';

const CollapsableBlock = ({
  title, text, isCollapsed, onCollapseChange,
}) => {
  const linkDecorator = (string) => {
    const regExp = /(https?:\/\/[^\s]+)/g;
    const arrayOfText = string.split(regExp);
    for (let i = 1; i < arrayOfText.length; i += 2) {
      arrayOfText[i] = <a key={`link${i}`} href={arrayOfText[i]}>{arrayOfText[i]}</a>;
    }
    return arrayOfText;
  };
  const preparedDescription = linkDecorator(text);
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
                {preparedDescription}
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
};

export default CollapsableBlock;
