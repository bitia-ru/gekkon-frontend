import React      from 'react';
import DatePicker from 'react-datepicker';
import PropTypes  from 'prop-types';

import 'react-datepicker/dist/react-datepicker.css';
import './DatePickerBlock.css';

const DatePickerBlock = ({
                             date, dateFormat, onChange,
                         }) => (
    <div className="date-picker-block__container">
        {
            date
                ? (
                    <DatePicker
                        dateFormat={dateFormat}
                        className="date-picker-block__select date-picker-block__select-transparent date-picker-block__select_small"
                        selected={date}
                        onChange={onChange}
                    />
                )
                : (
                    <DatePicker
                        dateFormat={dateFormat}
                        className="date-picker-block__select date-picker-block__select-transparent date-picker-block__select_small"
                        onChange={onChange}
                    />
                )
        }
    </div>
);

DatePickerBlock.propTypes = {
    date: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    dateFormat: PropTypes.string.isRequired,
};

DatePickerBlock.defaultProps = {
    date: null,
};

export default DatePickerBlock;
