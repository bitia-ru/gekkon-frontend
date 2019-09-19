import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import NewsTooltipRow from '../NewsTooltipRow/NewsTooltipRow';
import './NewsTooltip.css';

const NewsTooltip = ({ rows }) => {
  const mapIndexed = R.addIndex(R.map);
  return (
    <div className="news__level-block-tooltip">
      <div className="tooltip tooltip_bottom-side tooltip__levels">
        {
          mapIndexed(
            (row, index) => (
              <NewsTooltipRow key={index} count={row.count} category={row.category} />
            ),
            rows,
          )
        }
      </div>
    </div>
  );
};

NewsTooltip.propTypes = {
  rows: PropTypes.array.isRequired,
};

export default NewsTooltip;
