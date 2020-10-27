import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Axios from 'axios';
import * as R from 'ramda';
import dayjs from 'dayjs';
import Scheme from '../Scheme/Scheme';
import BackButton from '../BackButton/BackButton';
import { StyleSheet, css } from '../../aphrodite';
import { DEFAULT_FILTERS } from '@/v1/Constants/DefaultFilters';
import { BACKEND_DATE_FORMAT } from '@/v1/Constants/Date';
import { ApiUrl } from '@/v1/Environ';
import toastHttpError from '@/v2/utils/toastHttpError';

class SchemeModal extends Component {
  constructor(props) {
    super(props);

    const { currentRoute, movedRoutes } = this.props;
    this.state = {
      routes: [],
      currentRoute: R.clone(currentRoute),
      routesInitState: [],
      movedRoutesIds: R.map(route => route.id, movedRoutes),
    };
    this.isMovingId = null;
  }

  componentDidMount() {
    this.loadRoutes();
  }

  loadRoutes = () => {
    const {
      currentRoute,
    } = this.props;
    const currentSectorId = currentRoute.sector_id;
    const currentCategoryFrom = DEFAULT_FILTERS.categoryFrom;
    const currentCategoryTo = DEFAULT_FILTERS.categoryTo;
    const lastActiveDay = currentRoute.installed_until && (
      dayjs(currentRoute.installed_until).subtract(1, 'days')
    );
    const currentDate = (
      currentRoute.installed_at || lastActiveDay || DEFAULT_FILTERS.date
    );
    const params = {
      filters: {
        category: [[currentCategoryFrom], [currentCategoryTo]],
        personal: DEFAULT_FILTERS.personal,
        outdated: true,
      },
    };

    params.filters.installed_at = [[null], [dayjs(currentDate).format(BACKEND_DATE_FORMAT)]];
    params.filters.installed_until = [
      [dayjs(currentDate).add(1, 'days').format(BACKEND_DATE_FORMAT)],
      [null],
    ];
    Axios.get(`${ApiUrl}/v1/sectors/${currentSectorId}/routes`, { params })
      .then((response) => {
        const notMovedRoutes = R.reject(
          route => (
            R.contains(route.id, R.concat(this.state.movedRoutesIds, [currentRoute.id]))
          ),
          response.data.payload,
        );
        const routes = R.concat(
          notMovedRoutes,
          this.props.movedRoutes,
        );
        this.setState({
          routes,
          routesInitState: R.clone(routes),
        });
      }).catch((error) => {
        toastHttpError(error);
      });
  };

  onMouseDown = (event) => {
    if (event.nativeEvent.which === 1 && this.isMovingId === null) {
      const schemeContainerRect = this.schemeContainerRef.getBoundingClientRect();
      const { currentRoute } = this.state;
      const newCurrentRoute = R.clone(currentRoute);
      newCurrentRoute.data.position = {
        left: (event.pageX - schemeContainerRect.x) / schemeContainerRect.width * 100,
        top: (event.pageY - schemeContainerRect.y) / schemeContainerRect.height * 100,
      };
      this.isMovingId = currentRoute.id;
      this.setState({ currentRoute: newCurrentRoute });
    }
  };

  onMouseMove = (event) => {
    if (this.isMovingId !== null) {
      const schemeContainerRect = this.schemeContainerRef.getBoundingClientRect();
      const xOld = (event.pageX - schemeContainerRect.x) / schemeContainerRect.width * 100;
      const yOld = (event.pageY - schemeContainerRect.y) / schemeContainerRect.height * 100;
      const { currentRoute } = this.state;
      if (this.isMovingId === undefined || this.isMovingId === currentRoute.id) {
        currentRoute.data.position.dx = xOld - currentRoute.data.position.left;
        currentRoute.data.position.dy = yOld - currentRoute.data.position.top;
        this.setState({ currentRoute });
      } else {
        const { routes } = this.state;
        const index = R.findIndex(R.propEq('id', this.isMovingId))(routes);
        const route = routes[index];
        route.data.position.dx = xOld - route.data.position.left;
        route.data.position.dy = yOld - route.data.position.top;
        this.setState({
          routes: [...routes.slice(0, index), route, ...routes.slice(index + 1, Infinity)],
        });
      }
    }
  };

  onStartMoving = (routeId, pageX, pageY) => {
    const { editable } = this.props;
    if (!editable) {
      return;
    }
    this.isMovingId = routeId;
    const schemeContainerRect = this.schemeContainerRef.getBoundingClientRect();
    const xOld = (pageX - schemeContainerRect.x) / schemeContainerRect.width * 100;
    const yOld = (pageY - schemeContainerRect.y) / schemeContainerRect.height * 100;
    const { currentRoute, movedRoutesIds } = this.state;
    if (routeId === undefined || routeId === currentRoute.id) {
      currentRoute.data.position.dx = xOld - currentRoute.data.position.left;
      currentRoute.data.position.dy = yOld - currentRoute.data.position.top;
      this.setState({
        currentRoute,
        movedRoutesIds: R.uniq(R.append(routeId, movedRoutesIds)),
      });
    } else {
      const { routes } = this.state;
      const index = R.findIndex(R.propEq('id', routeId))(routes);
      const route = routes[index];
      route.data.position.dx = xOld - route.data.position.left;
      route.data.position.dy = yOld - route.data.position.top;
      this.setState({
        routes: [...routes.slice(0, index), route, ...routes.slice(index + 1, Infinity)],
        movedRoutesIds: R.uniq(R.append(routeId, movedRoutesIds)),
      });
    }
  };

  onMouseUp = (event) => {
    if (this.isMovingId !== null) {
      const schemeContainerRect = this.schemeContainerRef.getBoundingClientRect();
      const { currentRoute } = this.state;
      const xOld = (event.pageX - schemeContainerRect.x) / schemeContainerRect.width * 100;
      const yOld = (event.pageY - schemeContainerRect.y) / schemeContainerRect.height * 100;
      if (this.isMovingId === undefined || this.isMovingId === currentRoute.id) {
        const dx = xOld - currentRoute.data.position.left;
        const dy = yOld - currentRoute.data.position.top;
        currentRoute.data.position = {
          left: parseFloat(currentRoute.data.position.left) + dx,
          top: parseFloat(currentRoute.data.position.top) + dy,
          dx: 0,
          dy: 0,
        };
        this.setState({ currentRoute });
      } else {
        const { routes } = this.state;
        const index = R.findIndex(R.propEq('id', this.isMovingId))(routes);
        const route = routes[index];
        const dx = xOld - route.data.position.left;
        const dy = yOld - route.data.position.top;
        route.data.position = {
          left: parseFloat(route.data.position.left) + dx,
          top: parseFloat(route.data.position.top) + dy,
          dx: 0,
          dy: 0,
        };
        this.setState({
          routes: [...routes.slice(0, index), route, ...routes.slice(index + 1, Infinity)],
        });
      }
      this.isMovingId = null;
    }
  };

  close = () => {
    const { close, currentRoute: currentRouteProp } = this.props;
    this.setState({ currentRoute: currentRouteProp });
    close();
  };

  cancelMoving = (routeId) => {
    const { currentRoute, movedRoutesIds } = this.state;
    if (routeId === undefined || routeId === currentRoute.id) {
      this.setState({
        currentRoute: R.clone(this.props.currentRoute),
        movedRoutesIds: R.reject(id => id === routeId, movedRoutesIds),
      });
    } else {
      const { routes, routesInitState } = this.state;
      const index = R.findIndex(R.propEq('id', routeId))(routes);
      this.setState({
        routes: [
          ...routes.slice(0, index),
          R.clone(routesInitState[index]),
          ...routes.slice(index + 1, Infinity),
        ],
        movedRoutesIds: R.reject(id => id === routeId, movedRoutesIds),
      });
    }
  };

  render() {
    const {
      save,
      editable,
    } = this.props;
    const { currentRoute, routes, movedRoutesIds } = this.state;
    return (
      <>
        <div className={css(styles.modalBack)}>
          <BackButton
            onClick={
              () => {
                save(
                  currentRoute.data.position,
                  R.filter(route => R.contains(route.id, movedRoutesIds), routes),
                );
              }
            }
          />
        </div>
        <div
          role="button"
          tabIndex={0}
          style={{ margin: '50px 70px', outline: 'none' }}
          className={css(styles.modalHallScheme)}
          ref={(ref) => {
            this.schemeContainerRef = ref;
          }}
          onMouseDown={editable ? this.onMouseDown : null}
          onMouseUp={editable ? this.onMouseUp : null}
          onMouseMove={editable ? this.onMouseMove : null}
        >
          <Scheme
            movedRoutesIds={movedRoutesIds}
            currentRoutes={[currentRoute.id]}
            routes={[currentRoute, ...routes]}
            showCards={false}
            onStartMoving={this.onStartMoving}
            cancelMoving={this.cancelMoving}
          />
        </div>
      </>
    );
  }
}

const styles = StyleSheet.create({
  // How is it works?
  modalOverlay: {
    display: 'block',
    position: 'fixed',
    top: 0,
    left: 0,
    overflow: 'auto',
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.8)',
    zIndex: '100',
  },
  modalOverlayWrapper: {
    position: 'relative',
    backgroundColor: 'transparent',
    paddingLeft: '40px',
    paddingRight: '40px',
    width: '100%',
    maxWidth: '1464px',
    boxSizing: 'border-box',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100%',
  },
  modalOverlayModal: {
    '@media screen and (min-width: 1920px)': {
      alignSelf: 'center',
    },
  },
  modalMap: {
    width: '80%',
    maxWidth: '1600px',
    marginLeft: 'auto',
    marginRight: 'auto',
    alignSelf: 'center',
    paddingTop: '10vh',
    paddingBottom: '10vh',
    position: 'relative',
  },
  // END
  modalHallScheme: {
    position: 'relative',
    alignSelf: 'center',
    maxHeight: '100%',
    overflowY: 'auto',
    '> img': {
      width: '100%',
      maxWidth: '100%',
    },
  },
  modalBack: {
    position: 'absolute',
    content: '\'\'',
    left: '24px',
    top: '24px',
  },
});

SchemeModal.propTypes = {
  editable: PropTypes.bool,
  currentRoute: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  movedRoutes: PropTypes.array,
};

SchemeModal.defaultProps = { movedRoutes: [] };

export default withRouter(SchemeModal);
