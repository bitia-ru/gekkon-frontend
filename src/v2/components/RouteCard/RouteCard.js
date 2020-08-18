import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import moment from 'moment';
import { SOON_END_PERIOD } from '@/v1/Constants/Route';
import RouteStatus from '../RouteStatus/RouteStatus';
import { timeFromNow } from '@/v1/Constants/DateTimeFormatter';
import RouteContext from '@/v1/contexts/RouteContext';
import { avail, notAvail } from '@/v1/utils';
import getArrayFromObject from '@/v1/utils/getArrayFromObject';
import { css } from '../../aphrodite';
import styles from './styles';


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
      notAvail(user) || notAvail(ascents)
        ? null
        : (R.find(R.propEq('user_id', user.id))(ascents))
    );
    let year;
    let titleDate;
    if (route.installed_until) {
      const yearUntil = installedUntil.format('YYYY');
      year = yearUntil !== moment().format('YYYY') ? yearUntil : '';
      titleDate = installedUntil.format('Do MMMM');
    }
    const cardSprite = require('./images/card-sprite.svg');
    const alarmIcon = `${cardSprite}#icon-alarm`;
    const clockIcon = `${cardSprite}#icon-clock`;
    const installedUntilValid = (installedUntil && date >= installedUntil);
    return (
      <RouteContext.Provider value={{ route }}>
        <a className={css(styles.routeCard, (ascent && ascent.result !== 'unsuccessful') ? styles.routeCardDone : '')}>
          <article className={css(styles.routeCardInner)}>
            <div className={css(styles.routeCardImage)}>
              <div className={css(styles.routeCardImageInner)}>
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
                    <div className={css(styles.routeCardTrackStatus)}>
                      <RouteStatus />
                    </div>
                  )
                  }
              </div>
            </div>
            <div className={css(styles.routeCardInfo)}>
              <div className={css(styles.routeCardHeader)}>
                <div className={css(styles.routeCardNumber)}>
                  {route.number ? `№${route.number}` : `#${route.id}`}
                </div>
                <h1 className={css(styles.routeCardTitle)}>{route.name}</h1>
              </div>
              <div className={css(styles.routeCardFooter)}>
                {
                  route.installed_until
                    ? (
                      <span
                        title={`Скрутят: ${titleDate} ${year}`}
                        className={css(styles.routeCardDate, (installedUntil && date >= installedUntil) ? styles.routeCardDateEndSoon : '')}
                      >
                        <span className={css(styles.routeCardDateIcon)}>
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
                      <span className={css(styles.routeCardDate)} />
                    )
                }
                <div className={css(styles.routeAttributesWrapper)}>
                  <div
                    className={css(styles.routeCardCategory)}
                    style={{ borderColor: route.marks_color?.color || 'rgba(0, 0, 0, 0)' }}
                  >
                    {route.category}
                  </div>
                  {
                    route.holds_color && (
                      <div
                        className={css(styles.routeHoldsColor)}
                        style={{backgroundColor: route.holds_color?.color || 'rgba(0, 0, 0, 0)'}}
                      />
                    )
                  }
                </div>
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
  user: state.usersStore.users[state.usersStore.currentUserId],
});

export default withRouter(connect(mapStateToProps)(RouteCard));
