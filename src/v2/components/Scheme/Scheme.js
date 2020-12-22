import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import RouteCard from '../RouteCard/RouteCard';
import { HIDE_DELAY } from '@/v1/Constants/Scheme';
import SchemePointer from '../SchemePointer/SchemePointer';
import SectorContext from '@/v1/contexts/SectorContext';
import { StyleSheet, css } from '../../aphrodite';

class Scheme extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shownRouteId: null,
      imageIsLoading: true,
    };
  }

  showRouteCard = (id) => {
    this.setState({ shownRouteId: id });
    if (this.TimerId) {
      clearTimeout(this.TimerId);
    }
  };

  hideCard = () => {
    this.TimerId = setTimeout(() => this.setState({ shownRouteId: null }), HIDE_DELAY);
  };

  render() {
    const {
      sectors,
      onRouteClick,
      showCards,
      currentRoutes,
      routes,
      onStartMoving,
    } = this.props;
    const { shownRouteId, imageIsLoading } = this.state;
    const position = (left, top) => {
      const dist = [left, top, 100 - left, 100 - top];
      const maxIndex = R.findIndex(e => e === R.sort((a, b) => b - a, dist)[0], dist);
      return ['left', 'top', 'right', 'bottom'][maxIndex];
    };
    return (
      <SectorContext.Consumer>
        {
          ({ sector }) => {
            const currentSector = (
              routes.length > 0
                ? sectors[routes[0].sector_id]
                : sector
            );
            const diagram = currentSector && currentSector.diagram && currentSector.diagram.url;
            return (
              <>
                {
                  diagram && <>
                    <img
                      onLoad={() => this.setState({ imageIsLoading: false })}
                      style={{ visibility: imageIsLoading ? 'hidden' : 'visible' }}
                      src={diagram}
                      alt=""
                    />
                    {
                      !imageIsLoading && R.map(
                        route => (
                          <React.Fragment key={route.id}>
                            {
                              route.data && route.data.position && <div
                                className={css(styles.hallSchemeTrack)}
                                style={{
                                  left: `${parseFloat(route.data.position.left) + (route.data.position.dx || 0)}%`,
                                  top: `${parseFloat(route.data.position.top) + (route.data.position.dy || 0)}%`,
                                }}
                              >
                                <SchemePointer
                                  onClick={onRouteClick ? () => onRouteClick(route.id) : null}
                                  onMouseEnter={() => this.showRouteCard(route.id)}
                                  onMouseLeave={this.hideCard}
                                  onStartMoving={
                                    route.id === undefined || R.contains(route.id, currentRoutes)
                                      ? onStartMoving
                                      : null
                                  }
                                  category={route.category}
                                  transparent={!R.contains(route.id, currentRoutes)}
                                  color={
                                    route.holds_color === null ? undefined : route.holds_color.color
                                  }
                                  borderColor={route.marks_color?.color}
                                />
                                {
                                  (showCards && route.id === shownRouteId) && <div
                                    role="button"
                                    tabIndex={0}
                                    style={{ outline: 'none' }}
                                    onMouseEnter={() => clearTimeout(this.TimerId)}
                                    onMouseLeave={() => this.setState({ shownRouteId: null })}
                                    onClick={() => onRouteClick(route.id)}
                                    className={css(styles.trackPointTooltip,
                                      (position(route.data.position.left, route.data.position.top) === 'left') ? styles.trackPointTooltipLeft : '',
                                      (position(route.data.position.left, route.data.position.top) === 'top') ? styles.trackPointTooltipTop : '',
                                      (position(route.data.position.left, route.data.position.top) === 'right') ? styles.trackPointTooltipRight : '',
                                      (position(route.data.position.left, route.data.position.top) === 'bottom') ? styles.trackPointTooltipBottom : '')}
                                  >
                                    <RouteCard route={route} />
                                  </div>
                                }
                              </div>
                            }
                          </React.Fragment>),
                        routes,
                      )
                    }
                  </>
                }
              </>
            );
          }
        }
      </SectorContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  hallSchemeTrack: {
    position: 'absolute',
    content: '\'\'',
    ':hover': {
      zIndex: '9',
    },
  },
  // NOT USED
  trackPoint: {
    width: '1vw',
    height: '1vw',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '0.65vw',
    fontFamily: ['Gilroy', 'sans-serif'],
    border: 'none',
    padding: '0',
    outline: 'none',
    cursor: 'pointer',
    transition: 'box-shadow .4s ease-out',
    backgroundColor: '#84888B',
    '@media screen and (min-width: 1600px)': {
      width: '18px',
      height: '18px',
      fontSize: '12px',
    },
    ':hover': {
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08), inset 0px 0px 0px 50px rgba(255, 255, 255, 0.4)',
    },
  },
  // END

  // ????
  // .track-point:hover + .track-point__tooltip {
  //     display: block;
  // },
  // ???

  // NOT USED
  trackPoint7b: {
    backgroundColor: '#E32727',
    color: '#ffffff',
  },
  trackPoint7a: {
    backgroundColor: '#1650D5',
    color: '#ffffff',
  },
  // END

  trackPointTooltip: {
    position: 'absolute',
    content: '\'\'',
    zIndex: '1',
    width: '310px',
    backgroundColor: '#ffffff',
  },

  // NOT USED
  trackPointTooltipActive: {
    display: 'block',
  },
  // END

  trackPointTooltipRight: {
    left: 'calc(100% + 10px)',
    top: '-200px',
    ':before': {
      display: 'block',
      position: 'absolute',
      content: '\'\'',
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '0',
      height: '0',
      borderStyle: 'solid',
      borderWidth: '20px 18px 20px 0',
      borderColor: 'transparent #ffffff transparent transparent',
    },

  },

  // ???
  trackPointTooltipRightBottom: {
    left: 'calc(100% + 26px)',
    top: '-354px',
    ':before': {
      display: 'block',
      position: 'absolute',
      content: '\'\'',
      right: '100%',
      top: '93%',
      transform: 'translateY(-50%)',
      width: '0',
      height: '0',
      borderStyle: 'solid',
      borderWidth: '20px 18px 20px 0',
      borderColor: 'transparent #ffffff transparent transparent',
    },
  },
  trackPointTooltipRightTop: {
    left: 'calc(100% + 26px)',
    top: '-8px',
    ':before': {
      display: 'block',
      position: 'absolute',
      content: '\'\'',
      right: '100%',
      top: '7%',
      transform: 'translateY(-50%)',
      width: '0',
      height: '0',
      borderStyle: 'solid',
      borderWidth: '20px 18px 20px 0',
      borderColor: 'transparent #ffffff transparent transparent',
    },
  },
  // END

  trackPointTooltipLeft: {
    right: 'calc(100% + 28px)',
    top: '-200px',
    ':before': {
      display: 'block',
      position: 'absolute',
      content: '\'\'',
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '0',
      height: '0',
      borderStyle: 'solid',
      borderWidth: '20px 0 20px 18px',
      borderColor: 'transparent transparent transparent #ffffff',
    },
  },

  // ??
  trackPointTooltipLeftTop: {
    right: 'calc(100% + 26px)',
    top: '-8px',
    ':before': {
      display: 'block',
      position: 'absolute',
      content: '\'\'',
      left: '100%',
      top: '7%',
      transform: 'translateY(-50%)',
      width: '0',
      height: '0',
      borderStyle: 'solid',
      borderWidth: '20px 0 20px 18px',
      borderColor: 'transparent transparent transparent #ffffff',
    },
  },
  trackPointTooltipLeftBottom: {
    right: 'calc(100% + 26px)',
    top: '-354px',
    ':before': {
      display: 'block',
      position: 'absolute',
      content: '\'\'',
      left: '100%',
      top: '93%',
      transform: 'translateY(-50%)',
      width: '0',
      height: '0',
      borderStyle: 'solid',
      borderWidth: '20px 0 20px 18px',
      borderColor: 'transparent transparent transparent #ffffff',
    },
  },
  // END

  trackPointTooltipTop: {
    right: '-137px',
    bottom: 'calc(100% + 28px)',
    ':before': {
      display: 'block',
      position: 'absolute',
      content: '\'\'',
      left: '50%',
      top: '100%',
      transform: 'translateX(-50%)',
      width: '0',
      height: '0',
      borderStyle: 'solid',
      borderWidth: '18px 20px 0 20px',
      borderColor: '#ffffff transparent transparent transparent',
    },
  },
  trackPointTooltipBottom: {
    right: '-137px',
    top: 'calc(100% + 10px)',
    ':before': {
      display: 'block',
      position: 'absolute',
      content: '\'\'',
      left: '50%',
      bottom: '100%',
      transform: 'translateX(-50%)',
      width: '0',
      height: '0',
      borderStyle: 'solid',
      borderWidth: '0 20px 18px 20px',
      borderColor: 'transparent transparent #ffffff transparent',
    },
  },
});

Scheme.propTypes = {
  onRouteClick: PropTypes.func,
  currentRoutes: PropTypes.array.isRequired,
  showCards: PropTypes.bool,
  sectors: PropTypes.object.isRequired,
  onStartMoving: PropTypes.func,
};

Scheme.defaultProps = {
  onRouteClick: null,
  showCards: true,
  onStartMoving: null,
};

const mapStateToProps = state => ({
  sectors: state.sectorsStore.sectors,
});

export default withRouter(connect(mapStateToProps)(Scheme));
