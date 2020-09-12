import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import RouteCard from '../RouteCard/RouteCard';
import { HIDE_DELAY } from '@/v1/Constants/Scheme';
import SchemePointer from '../SchemePointer/SchemePointer';
import SchemePlaceholder from '../common/SchemePlaceholder/SchemePlaceholder';
import { StyleSheet, css } from '../../aphrodite';

class Scheme extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shownRouteId: null,
      imageIsLoading: true,
      image: undefined,
    };
    this.imagesInternal = {};
  }

  componentDidMount() {
    const { currentSector, sectors, routes } = this.props;
    const sectorId = routes[0]?.sector_id;
    const sector = currentSector || sectors[sectorId];
    this.loadSchemeDiagram(sector);
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentSector, sectors, routes } = this.props;
    const sectorId = routes[0]?.sector_id;
    const sector = currentSector || sectors[sectorId];
    const diagram = sector?.diagram?.url;
    if (diagram !== prevState.image) {
      this.loadSchemeDiagram(sector);
    }
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

  processUrl = (url) => {
    if (R.has(url, this.imagesInternal)) {
      this.setState({ image: url });
      return;
    }
    this.imagesInternal[url] = new Image();
    this.imagesInternal[url].src = url;
    this.setState(
      { image: undefined },
      () => {
        this.imagesInternal[url].onload = () => {
          this.setState({ image: url, imageIsLoading: false });
        };
      },
    );
  };

  loadSchemeDiagram = (sector) => {
    const image = this.state;
    const diagram = sector.diagram?.url;
    if (diagram !== image) {
      this.setState({ imageIsLoading: true });
      this.processUrl(diagram);
    }
  };

  render() {
    const {
      onRouteClick,
      showCards,
      currentRoutes,
      routes,
      onStartMoving,
      currentSector,
      sectors,
    } = this.props;
    const { shownRouteId, imageIsLoading, image } = this.state;
    const position = (left, top) => {
      const dist = [left, top, 100 - left, 100 - top];
      const maxIndex = R.findIndex(e => e === R.sort((a, b) => b - a, dist)[0], dist);
      return ['left', 'top', 'right', 'bottom'][maxIndex];
    };
    const currentRoutesSectorId = routes.length > 0 ? routes[0]?.sector_id : currentSector?.id;
    const currentSectorId = currentSector?.id || sectors[currentRoutesSectorId]?.id;
    return (
      <>
        {
          (imageIsLoading || currentSectorId !== currentRoutesSectorId) ? (
            <SchemePlaceholder />
          ) : (
            <>
              {
                <img
                  style={{ visibility: imageIsLoading ? 'hidden' : 'visible' }}
                  src={image}
                  alt=""
                />
              }
              {
                !imageIsLoading && R.map(
                  route => (
                    <React.Fragment key={route.id}>
                      {
                        route.data && route.data.position && <div
                          className={css(styles.hallSchemeTrack)}
                          style={{
                            left: `${route.data.position.left + (route.data.position.dx || 0)}%`,
                            top: `${route.data.position.top + (route.data.position.dy || 0)}%`,
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
                              route.holds_color === null
                                ? undefined
                                : route.holds_color.color
                            }
                          />
                          {
                            (showCards && route.id === shownRouteId) && <div
                              role="button"
                              tabIndex={0}
                              style={{ outline: 'none' }}
                              onMouseEnter={() => clearTimeout(this.TimerId)}
                              onMouseLeave={() => this.setState({ shownRouteId: null })}
                              onClick={() => onRouteClick(route.id)}
                              className={
                                css(
                                  styles.trackPointTooltip,
                                  (position(route.data.position.left, route.data.position.top) === 'left') ? styles.trackPointTooltipLeft : '',
                                  (position(route.data.position.left, route.data.position.top) === 'top') ? styles.trackPointTooltipTop : '',
                                  (position(route.data.position.left, route.data.position.top) === 'right') ? styles.trackPointTooltipRight : '',
                                  (position(route.data.position.left, route.data.position.top) === 'bottom') ? styles.trackPointTooltipBottom : '',
                                )
                              }
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
          )
        }
      </>
    );
  }
}

const styles = StyleSheet.create({
  hallSchemeTrack: {
    position: 'absolute',
    content: '\'\'',
    ':hover': { zIndex: '9' },
  },

  trackPointTooltip: {
    position: 'absolute',
    content: '\'\'',
    zIndex: '1',
    width: '310px',
    backgroundColor: '#ffffff',
  },

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
  routes: PropTypes.array,
  currentSector: PropTypes.object,
};

Scheme.defaultProps = {
  onRouteClick: null,
  showCards: true,
  onStartMoving: null,
};

const mapStateToProps = state => ({ sectors: state.sectorsStore.sectors });

export default withRouter(connect(mapStateToProps)(Scheme));
