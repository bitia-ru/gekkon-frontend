import React from 'react';
import PropTypes from 'prop-types';
import './NewsTooltipRow.css';

const NewsTooltipRow = ({ count, category }) => (
  <div className="tooltip__row">
    <div className="tooltip__count">{count}</div>
    <div className="tooltip__count-multiplication">x</div>
    <div className="level">
      <div className="level__item">
        {category}
      </div>
    </div>
  </div>
);

NewsTooltipRow.propTypes = {
  count: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
};

export default NewsTooltipRow;
