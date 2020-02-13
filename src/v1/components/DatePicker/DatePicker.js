import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import { DATE_FORMAT } from '../../Constants/Date';
import Calendar from '../Calendar/Calendar';
import './DatePicker.css';

export default class DatePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCalendar: false,
    };
    this.mouseOver = false;
  }

  onMouseEnter = () => {
    this.mouseOver = true;
  };

  onMouseLeave = () => {
    this.mouseOver = false;
  };

  onBlur = () => {
    if (!this.mouseOver) {
      this.setState({ showCalendar: false });
    }
  };

  render() {
    const { showCalendar } = this.state;
    const {
      date,
      onSelect,
      size,
      borderStyle,
      formatter: formatterProp,
    } = this.props;
    const dateClass = 'date-picker-block__select';
    const styleClass = (
      borderStyle === 'transparent'
        ? ' date-picker-block__select-transparent'
        : ''
    );
    const sizeClass = size === 'small' ? ' date-picker-block__select_small' : '';
    const formatter = formatterProp || (d => moment(d).format(DATE_FORMAT));
    return (
      <div
        className="date-picker-block__container"
        role="button"
        tabIndex={0}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onBlur={this.onBlur}
      >
        <input
          className={`${dateClass}${styleClass}${sizeClass}`}
          value={date ? formatter(date) : 'сегодня'}
          readOnly
          style={{ cursor: 'default' }}
          onClick={() => this.setState({ showCalendar: true })}
        />
        {
          showCalendar && <Calendar
            hide={() => this.setState({ showCalendar: false })}
            date={date ? moment(date) : null}
            onSelect={onSelect}
          />
        }
      </div>
    );
  }
}

DatePicker.propTypes = {
  size: PropTypes.string,
  formatter: PropTypes.func,
  borderStyle: PropTypes.string,
  date: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};
