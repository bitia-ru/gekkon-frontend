import React, { Component } from 'react';
import * as R from 'ramda';
import moment from 'moment';
import PropTypes from 'prop-types';
import { css } from '../../../aphrodite';
import styles from './styles';

export default class DatePicker extends Component {
  constructor(props) {
    super(props);

    const { date } = this.props;
    this.state = {
      displayedDate: date ? moment(date) : moment(),
      selectedDate: moment(date),
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

  isDisabled = (week, day) => {
    const { disabledToDate, disabledFromDate } = this.props;
    const { displayedDate } = this.state;
    let d = R.clone(displayedDate);
    d = d.startOf('month').startOf('week').add(week * 7 + day, 'days');
    if (disabledToDate && disabledToDate > d) {
      return true;
    }
    if (disabledFromDate && disabledFromDate < d) {
      return true;
    }
    return false;
  };

  selectDate = (e, week, day) => {
    e.stopPropagation();
    const { displayedDate } = this.state;
    const { onSelect, hide } = this.props;
    const d = R.clone(displayedDate);
    onSelect(d.startOf('month').startOf('week').add(week * 7 + day, 'days'));
    hide();
  };

  removeDate = (e) => {
    e.stopPropagation();
    const { onSelect, hide } = this.props;
    onSelect(null);
    hide();
  };

  getDayClasses = (week, day) => {
    const isCurrentDate = this.isCurrentDate(week, day);
    const isSelectedDate = this.isSelectedDate(week, day);
    return css(
      styles.calendarContentDay,
      this.notSelectedMonth(week, day) && styles.calendarContentDayUnactive,
      isCurrentDate && styles.calendarContentDayCurrent,
      isSelectedDate && styles.calendarContentDayActive,
      isCurrentDate && isSelectedDate && styles.calendarContentDayActiveDayCurrent,
      this.isDisabled(week, day) && styles.calendarContentDayUnactive,
    );
  };

  render() {
    return (
      <div className={css(styles.modalTableItemCalendar)}>
        <div className={css(styles.calendar, styles.calendarLeftV2)}>
          <div>
            <div>
              <div className={css(styles.calendarContentHeaderMonth)}>
                <button
                  type="button"
                  onClick={this.showPrevMonth}
                  style={{ outline: 'none' }}
                  className={
                    css(
                      styles.calendarContentHeaderButton,
                      styles.calendarContentHeaderButtonPrev,
                    )
                  }
                />
                {`${this.getCurrentMonth()} ${this.getCurrentYear()}`}
                <button
                  type="button"
                  onClick={this.showNextMonth}
                  style={{ outline: 'none' }}
                  className={
                    css(
                      styles.calendarContentHeaderButton,
                      styles.calendarContentHeaderButtonNext,
                    )
                  }
                />
              </div>
              <div className={css(styles.calendarContentWeekHeader)}>
                <div className={css(styles.calendarContentWeekHeaderDay)}>Пн</div>
                <div className={css(styles.calendarContentWeekHeaderDay)}>Вт</div>
                <div className={css(styles.calendarContentWeekHeaderDay)}>Ср</div>
                <div className={css(styles.calendarContentWeekHeaderDay)}>Чт</div>
                <div className={css(styles.calendarContentWeekHeaderDay)}>Пт</div>
                <div className={css(styles.calendarContentWeekHeaderDay)}>Сб</div>
                <div className={css(styles.calendarContentWeekHeaderDay)}>Вс</div>
              </div>
            </div>
            <div className={css(styles.calendarContentMonth)}>
              {
                R.map(
                  week => (
                    <div key={week} className={css(styles.calendarContentWeek)}>
                      {
                        R.map(
                          day => (
                            <button
                              key={day}
                              disabled={this.isDisabled(week, day)}
                              type="button"
                              style={{ outline: 'none' }}
                              onClick={e => this.selectDate(e, week, day)}
                              className={this.getDayClasses(week, day)}
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
            className={css(styles.calendarButton)}
          >
            Сбросить дату
          </button>
        </div>
      </div>
    );
  }
}

DatePicker.propTypes = {
  date: PropTypes.string,
  hide: PropTypes.func,
  disabledToDate: PropTypes.object,
  disabledFromDate: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
};

DatePicker.defaultProps = {
  date: null,
  hide: () => {},
};
