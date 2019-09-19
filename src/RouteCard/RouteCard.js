import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { SOON_END_PERIOD } from '../Constants/Route';
import RouteStatus from '../RouteStatus/RouteStatus';
import { timeFromNow } from '../Constants/DateTimeFormatter';
import './RouteCard.css';

export default class RouteCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageIsLoading: true,
    };
  }

  render() {
    moment.locale('ru');
    const { ascent, route, onRouteClick } = this.props;
    const { imageIsLoading } = this.state;
    const date = moment().add(SOON_END_PERIOD, 'days');
    const installedUntil = route.installed_until ? moment(route.installed_until) : null;
    const statusClass = (ascent && ascent.result !== 'unsuccessful') ? ' route-card_done' : '';
    let year;
    let titleDate;
    let soonClass;
    if (route.installed_until) {
      const yearUntil = installedUntil.format('YYYY');
      year = yearUntil !== moment().format('YYYY') ? yearUntil : '';
      titleDate = installedUntil.format('Do MMMM');
      soonClass = (
        (installedUntil && date >= installedUntil)
          ? ' route-card__date_end-soon'
          : ''
      );
    }
    const alarmIcon = '/public/img/route-card-sprite/card-sprite.svg#icon-alarm';
    const clockIcon = '/public/img/route-card-sprite/card-sprite.svg#icon-clock';
    const installedUntilValid = (installedUntil && date >= installedUntil);
    return (
      <div
        className="content__col-md-4 content__col-lg-3"
        role="button"
        tabIndex={0}
        style={{ outline: 'none' }}
        onClick={onRouteClick || null}
      >
        <div className="content__route-card">
          <a className={`route-card${statusClass}`}>
            <article className="route-card__inner">
              <div className="route-card__image">
                <div className="route-card__image-inner">
                  {
                    route.photo && (
                      <img
                        src={route.photo.thumb_url}
                        alt={route.name}
                        onLoad={() => this.setState({ imageIsLoading: false })}
                        style={{ visibility: imageIsLoading ? 'hidden' : 'visible' }}
                      />
                    )
                  }
                  {
                    (ascent && ascent.result !== 'unsuccessful') && (
                      <div className="route-card__track-status">
                        <RouteStatus ascent={ascent} />
                      </div>
                    )
                  }
                </div>
              </div>
              <div className="route-card__info">
                <div className="route-card__header">
                  <div className="route-card__number">
                    {route.number ? `№${route.number}` : `#${route.id}`}
                  </div>
                  <h1 className="route-card__title">{route.name}</h1>
                </div>
                <div className="route-card__footer">
                  {
                    route.installed_until
                      ? (
                        <span
                          title={`Скрутят: ${titleDate} ${year}`}
                          className={`route-card__date${soonClass}`}
                        >
                          <span className="route-card__date-icon">
                            {
                              <svg>
                                <use xlinkHref={installedUntilValid ? alarmIcon : clockIcon} />
                              </svg>
                            }
                          </span>
                          {timeFromNow(moment(route.installed_until))}
                        </span>
                      )
                      : (
                        <span className="route-card__date" />
                      )
                  }
                  <div className="route-card__level">{route.category}</div>
                </div>
              </div>
            </article>
          </a>
        </div>
      </div>
    );
  }
}


RouteCard.propTypes = {
  ascent: PropTypes.object,
  onRouteClick: PropTypes.func,
  route: PropTypes.object.isRequired,
};

RouteCard.defaultProps = {
  ascent: null,
  onRouteClick: null,
};
