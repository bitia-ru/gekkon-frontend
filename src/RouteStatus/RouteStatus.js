import React from 'react';
import PropTypes from 'prop-types';
import './RouteStatus.css';

const RouteStatus = ({
  ascent, changeAscentResult,
}) => {
  const complete = (ascent && ascent.result !== 'unsuccessful');
  let statusClass = '';
  if (complete && ascent.result === 'red_point') {
    statusClass = ' route-status__type_redpoint';
  } else if (complete && ascent.result === 'flash') {
    statusClass = ' route-status__type_flash';
  }
  return (
    <div
      className={`route-status${complete ? ' route-status_complete' : ''}`}
      role="button"
      tabIndex={0}
      style={{ outline: 'none' }}
      onClick={changeAscentResult || null}
    >
      <div
        className={`route-status__type${statusClass}`}
      />
      {
        complete
          ? (
            ascent.result === 'red_point' ? 'Пролез' : 'Флешанул'
          )
          : 'Не пройдена'
      }
    </div>
  );
};

RouteStatus.propTypes = {
  ascent: PropTypes.object,
  changeAscentResult: PropTypes.func,
};

RouteStatus.defaultProps = {
  ascent: null,
  changeAscentResult: null,
};

export default RouteStatus;
