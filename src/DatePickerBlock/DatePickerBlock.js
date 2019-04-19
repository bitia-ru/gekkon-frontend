import React, {Component} from 'react';
import DatePicker         from 'react-datepicker';
import PropTypes          from 'prop-types';

import 'react-datepicker/dist/react-datepicker.css';
import './DatePickerBlock.css';

export default class DatePickerBlock extends Component {

    render() {
        return <div className="date-picker-block__container">
            {this.props.date ?
            <DatePicker
                dateFormat={this.props.dateFormat}
                className="date-picker-block__select date-picker-block__select-transparent date-picker-block__select_small"
                selected={this.props.date}
                onChange={this.props.onChange}
            /> : <DatePicker
                    dateFormat={this.props.dateFormat}
                    className="date-picker-block__select date-picker-block__select-transparent date-picker-block__select_small"
                    onChange={this.props.onChange}
                />}
        </div>;
    }
}

DatePickerBlock.propTypes = {
    onChange: PropTypes.func.isRequired,
    dateFormat: PropTypes.string.isRequired
};
