import React, { Component } from 'react';
import * as R from 'ramda';
import moment from 'moment';
import PropTypes from 'prop-types';
import './Calendar.css';

export default class DatePicker extends Component {
  constructor(props) {
    super(props);

    const { date } = this.props;
    this.state = {
      displayedDate: date ? R.clone(date) : moment(),
      selectedDate: R.clone(date),
    };
  }

  getCurrentMonth = () => {
    const { displayedDate } = this.state;
    const d = displayedDate.format('MMMM');
    return d.charAt(0).toUpperCase() + d.slice(1);
  };

  getCurrentYear = () => {
    const { displayedDate } = this.state;
    return displayedDate.format('YYYY');
  };

  showPrevMonth = (event) => {
    event.stopPropagation();
    const { displayedDate } = this.state;
    this.setState({ displayedDate: displayedDate.subtract(1, 'month') });
  };

  showNextMonth = (event) => {
    event.stopPropagation();
    const { displayedDate } = this.state;
    this.setState({ displayedDate: displayedDate.add(1, 'month') });
  };

  getDay = (week, day) => {
    const { displayedDate } = this.state;
    const d = R.clone(displayedDate);
    return d.startOf('month').startOf('week').add(week * 7 + day, 'days').format('D');
  };

  notSelectedMonth = (week, day) => {
    const { displayedDate } = this.state;
    const d = R.clone(displayedDate);
    const month = d.startOf('month').startOf('week').add(week * 7 + day, 'days').format('M');
    const displayedMonth = displayedDate.format('M');
    return month !== displayedMonth;
  };

  numOfWeeks = () => {
    const { displayedDate } = this.state;
    let d = R.clone(displayedDate);
    const start = d.startOf('month').weeks();
    d = R.clone(displayedDate);
    const end = d.endOf('month').weeks();
    if (end > start) {
      return end - start + 1;
    }
    if (end === 1) {
      d = R.clone(displayedDate);
      return d.endOf('month').subtract(7, 'days').weeks() - start + 2;
    }
    return end + 1;
  };

  isSelectedDate = (week, day) => {
    const { displayedDate, selectedDate } = this.state;
    if (selectedDate === null) {
      return false;
    }
    let d = R.clone(displayedDate);
    d = d.startOf('month').startOf('week').add(week * 7 + day, 'days');
    if (d.format('D') !== R.clone(selectedDate).format('D')) {
      return false;
    }
    if (d.format('MM') !== R.clone(selectedDate).format('MM')) {
      return false;
    }
    if (d.format('YYYY') !== R.clone(selectedDate).format('YYYY')) {
      return false;
    }
    return true;
  };

  isCurrentDate = (week, day) => {
    const { displayedDate } = this.state;
    let d = R.clone(displayedDate);
    d = d.startOf('month').startOf('week').add(week * 7 + day, 'days');
    if (d.format('D') !== moment().format('D')) {
      return false;
    }
    if (d.format('MM') !== moment().format('MM')) {
      return false;
    }
    if (d.format('YYYY') !== moment().format('YYYY')) {
      return false;
    }
    return true;
  };

  selectDate = (week, day) => {
    const { displayedDate } = this.state;
    const { onSelect, hide } = this.props;
    const d = R.clone(displayedDate);
    onSelect(d.startOf('month').startOf('week').add(week * 7 + day, 'days'));
    hide();
  };

  removeDate = () => {
    const { onSelect, hide } = this.props;
    onSelect(null);
    hide();
  };

  render() {
    return (
      <div className="modal__table-item-calendar">
        <div className="calendar calendar_left">
          <div className="calendar__header" />
          <div className="calendar__content">
            <div className="calendar__content-header">
              <div className="calendar__content-header-month">
                <button
                  type="button"
                  onClick={this.showPrevMonth}
                  style={{ outline: 'none' }}
                  className="calendar__content-header-button calendar__content-header-button_prev"
                />
                {`${this.getCurrentMonth()} ${this.getCurrentYear()}`}
                <button
                  type="button"
                  onClick={this.showNextMonth}
                  style={{ outline: 'none' }}
                  className="calendar__content-header-button calendar__content-header-button_next"
                />
              </div>
              <div className="calendar__content-week-header">
                <div className="calendar__content-week-header-day">Пн</div>
                <div className="calendar__content-week-header-day">Вт</div>
                <div className="calendar__content-week-header-day">Ср</div>
                <div className="calendar__content-week-header-day">Чт</div>
                <div className="calendar__content-week-header-day">Пт</div>
                <div className="calendar__content-week-header-day">Сб</div>
                <div className="calendar__content-week-header-day">Вс</div>
              </div>
            </div>
            <div className="calendar__content-month">
              {
                R.map(
                  week => (
                    <div key={week} className="calendar__content-week">
                      {
                        R.map(
                          day => (
                            <button
                              key={day}
                              type="button"
                              style={{ outline: 'none' }}
                              onClick={() => this.selectDate(week, day)}
                              className={`calendar__content-day${
                                this.notSelectedMonth(week, day)
                                  ? ' calendar__content-day_unactive'
                                  : ''
                              }${
                                this.isCurrentDate(week, day)
                                  ? ' calendar__content-day_current'
                                  : ''
                              }${
                                this.isSelectedDate(week, day)
                                  ? ' calendar__content-day_active'
                                  : ''
                              }`}
                            >
                              {this.getDay(week, day)}
                            </button>
                          ),
                          R.range(0, 7),
                        )
                      }
                    </div>
                  ),
                  R.range(0, this.numOfWeeks()),
                )
              }
            </div>
          </div>
          <button
            type="button"
            onClick={this.removeDate}
            style={{ outline: 'none' }}
            className="calendar__button"
          >
            Сбросить дату
          </button>
        </div>
      </div>
    );
  }
}

DatePicker.propTypes = {
  date: PropTypes.object,
  hide: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

DatePicker.defaultProps = {
  date: null,
};
