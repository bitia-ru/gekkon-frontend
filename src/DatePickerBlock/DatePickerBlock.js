import React from 'react';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import 'react-datepicker/dist/react-datepicker.css';
import './DatePickerBlock.css';

const DatePickerBlock = ({
  date, dateFormat, onChange,
}) => {
  const datePickerClasses = classNames({
    'date-picker-block__select': true,
    'date-picker-block__select-transparent': true,
    'date-picker-block__select_small': true,
  });
  return (
    <div className="date-picker-block__container">
      {
        date
          ? (
            <DatePicker
              dateFormat={dateFormat}
              className={datePickerClasses}
              selected={date}
              onChange={onChange}
            />
          )
          : (
            <DatePicker
              dateFormat={dateFormat}
              className={datePickerClasses}
              onChange={onChange}
            />
          )
      }
    </div>
  );
};

DatePickerBlock.propTypes = {
  date: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  dateFormat: PropTypes.string.isRequired,
};

DatePickerBlock.defaultProps = {
  date: null,
};

export default DatePickerBlock;
