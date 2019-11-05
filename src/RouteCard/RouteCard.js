import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import moment from 'moment';
import { SOON_END_PERIOD } from '../Constants/Route';
import RouteStatus from '../RouteStatus/RouteStatus';
import { timeFromNow } from '../Constants/DateTimeFormatter';
import RouteContext from '../contexts/RouteContext';
import { avail, notAvail } from '../Utils';
import getArrayFromObject from '../../v1/utils/getArrayFromObject';
import './RouteCard.css';

class RouteCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageIsLoading: true,
    };
  }

  render() {
    moment.locale('ru');
    const { route, user } = this.props;
    const { imageIsLoading } = this.state;
    const date = moment().add(SOON_END_PERIOD, 'days');
    const installedUntil = route.installed_until ? moment(route.installed_until) : null;
    const ascents = avail(route.ascents) && getArrayFromObject(route.ascents);
    const ascent = (
      notAvail(user.id) || notAvail(ascents)
        ? null
        : (R.find(R.propEq('user_id', user.id))(ascents))
    );
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
    const cardSprite = require('./images/card-sprite.svg');
    const alarmIcon = `${cardSprite}#icon-alarm`;
    const clockIcon = `${cardSprite}#icon-clock`;
    const installedUntilValid = (installedUntil && date >= installedUntil);
    return (
      <RouteContext.Provider value={{ route }}>
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
                      <RouteStatus />
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
      </RouteContext.Provider>
    );
  }
}


RouteCard.propTypes = {
  route: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default withRouter(connect(mapStateToProps)(RouteCard));
