import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import moment from 'moment';
import { SOON_END_PERIOD } from '../../Constants/Route';
import RouteStatus from '../RouteStatus/RouteStatus';
import { timeFromNow } from '../../Constants/DateTimeFormatter';
import RouteContext from '../../contexts/RouteContext';
import { avail, notAvail } from '../../utils';
import getArrayFromObject from '../../utils/getArrayFromObject';
import { StyleSheet, css } from '../../aphrodite';

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
                <div className={css(styles.routeCardLevel)}>{route.category}</div>
              </div>
            </div>
          </article>
        </a>
      </RouteContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  // NOT USED
  contentColMd4: {
    width: 'calc(33.33% - 30px)',
    marginLeft: '15px',
    marginRight: '15px',
    display: 'flex',
  },
  contentColLg3: {
    '@media screen and (min-width: 1200px)': {
      width: 'calc(25% - 30px)',
      marginLeft: '15px',
      marginRight: '15px',
      display: 'flex',
    },
  },
  // END
  routeCard: {
    width: '100%',
    height: '100%',
    minHeight: '350px',
    padding: '24px',
    paddingBottom: '22px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08)',
    transition: 'box-shadow .4s ease-out',
    display: 'flex',
    flexDirection: 'column',
    textDecoration: 'none',
    boxSizing: 'border-box',
    outline: 'none',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    ':hover': {
      boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.12)',
    },
    ':focus': {
      boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.12), 0px 0px 0px 2px rgba(0, 108, 235, 0.7)',
    },
  },
  routeCardInner: {
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    backgroundColor: '#ffffff',
  },
  routeCardImage: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%22239%22%20height%3D%22186%22%20viewBox%3D%220%200%20239%20186%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M239%20186L146%200L92.5%20107L66%2054L0%20186H53H132H239Z%22%20fill%3D%22white%22/%3E%0A%3C/svg%3E%0A")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundColor: '#F3F3F3',
    overflow: 'hidden',
    position: 'relative',
    ':before': {
      display: 'block',
      width: '100%',
      paddingTop: '100%',
      content: '\'\'',
    },
  },
  routeCardImageInner: {
    position: 'absolute',
    content: '\'\'',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    '> img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  },
  routeCardTrackStatus: {
    position: 'absolute',
    content: '\'\'',
    top: '20px',
    right: '0',
  },
  routeCardInfo: {
    paddingTop: '25px',
    backgroundColor: '#ffffff',
    '@media screen and (max-width: 1440px)': {
      paddingTop: '20px',
    },
  },
  routeCardHeader: {
    display: 'inline-flex',
    alignItems: 'baseline',
    overflow: 'hidden',
    width: '100%',
  },
  routeCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
    '@media screen and (max-width: 1440px)': {
      marginTop: '10px',
    },
  },
  routeCardNumber: {
    fontSize: '20px',
    fontFamily: ['GilroyBold', 'sans-serif'],
    color: '#1f1f1f',
    marginRight: '20px',
    lineHeight: '1.3em',
  },
  routeCardTitle: {
    fontSize: '20px',
    color: '#1f1f1f',
    marginTop: '0',
    marginBottom: '0',
    textDecoration: 'none',
    fontFamily: ['GilroyBold', 'sans-serif'],
    fontWeight: 'normal',
    whiteSpace: 'nowrap',
    width: 'auto',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: '24px',
    lineHeight: '1.3em',
    minWidth: '0',
  },
  routeCardDate: {
    fontSize: '18px',
    color: '#B4BABC',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    lineHeight: '16px',
    '@media screen and (max-width: 1440px)': {
      fontSize: '14px',
    },
  },
  routeCardDateEndSoon: {
    color: '#E24D4D',
    '> svg:first-child': {
      fill: '#E24D4D',
    },
  },
  routeCardDateIcon: {
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '16px',
    marginTop: '-1px',
    '@media screen and (max-width: 1440px)': {
      width: '16px',
      height: '16px',
      marginRight: '10px',
    },
    '> svg': {
      width: '100%',
      height: '100%',
      fill: '#D5DADC',
    },
  },
  routeCardLevel: {
    fontSize: '20px',
    fontFamily: ['GilroyRegular', 'sans-serif'],
    color: '#1f1f1f',
  },
  routeCardDone: {
    opacity: '.7',
    ':hover': {
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08)',
    },
  },

  // NOT USED
  contentRouteCard: {
    marginBottom: '30px',
    display: 'flex',
    width: '100%',
  },
  // END
});

RouteCard.propTypes = {
  route: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.usersStore.users[state.usersStore.currentUserId],
});

export default withRouter(connect(mapStateToProps)(RouteCard));
