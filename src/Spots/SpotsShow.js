import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import moment from 'moment/moment';
import Axios from 'axios';
import Qs from 'qs';
import { connect } from 'react-redux';
import * as R from 'ramda';
import Cookies from 'js-cookie';
import { ToastContainer } from 'react-toastr';
import { ApiUrl } from '../Environ';
import {
  setSelectedViewMode,
  setSelectedPage,
  setDefaultSelectedPages,
  setSelectedFilter,
  setDefaultSelectedFilters,
  setRoutes,
  setRoutesData,
  setRouteIds,
  removeRoute,
  setSectorIds,
  setSector,
  setSectors,
  loadRouteMarkColors,
  setUsers,
  saveUser,
  saveToken,
  removeToken,
  increaseNumOfActiveRequests,
  decreaseNumOfActiveRequests,
  setRoute,
  setRouteData,
  loadFromLocalStorageSelectedFilters,
  removeRoutePropertyById,
  setRouteProperty,
} from '../actions';
import Content from '../Content/Content';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import RoutesShowModal from '../RoutesShowModal/RoutesShowModal';
import RoutesEditModal from '../RoutesEditModal/RoutesEditModal';
import SignUpForm from '../SignUpForm/SignUpForm';
import LogInForm from '../LogInForm/LogInForm';
import Profile from '../Profile/Profile';
import Authorization from '../Authorization';
import StickyBar from '../StickyBar/StickyBar';
import { RESULT_FILTERS } from '../Constants/ResultFilters';
import { CARDS_PER_PAGE } from '../Constants/RouteCardTable';
import { DEFAULT_FILTERS } from '../Constants/DefaultFilters';
import { CATEGORIES } from '../Constants/Categories';
import {
  DEFAULT_SPOT_VIEW_MODE,
  DEFAULT_SECTOR_VIEW_MODE_LIST,
} from '../Constants/ViewModeSwitcher';
import { avail, notAvail } from '../Utils';
import { userStateToUser } from '../Utils/Workarounds';
import { BACKEND_DATE_FORMAT } from '../Constants/Date';
import numToStr from '../Constants/NumToStr';
import SectorContext from '../contexts/SectorContext';
import getArrayFromObject from '../../v1/utils/getArrayFromObject';
import {
  reloadComments,
} from '../../v1/utils/RouteFinder';
import { reloadSector } from '../../v1/utils/SectorFinder';

Axios.interceptors.request.use((config) => {
  const configCopy = R.clone(config);
  configCopy.paramsSerializer = params => Qs.stringify(params, { arrayFormat: 'brackets' });
  return configCopy;
});

class SpotsShow extends Authorization {
  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      name: '',
      numOfPages: 1,
      spot: {},
      infoData: undefined,
      ctrlPressed: false,
      editRouteIsWaiting: false,
    });
  }

  componentDidMount() {
    const {
      history,
      saveToken: saveTokenProp,
      saveUser: saveUserProp,
      loadFromLocalStorageSelectedFilters: loadFromLocalStorageSelectedFiltersProp,
      routeMarkColors,
    } = this.props;
    history.listen((location, action) => {
      if (action === 'POP') {
        this.setState({ profileFormVisible: (location.hash === '#profile') });
      }
    });

    const sectorId = this.getSectorId();
    if (Cookies.get('user_session_token') !== undefined) {
      const token = Cookies.get('user_session_token');
      saveTokenProp(token);
      this.signIn(token, (currentUser) => {
        this.reloadUserAscents(currentUser.id);
        this.reloadSectors(sectorId, currentUser);
        if (sectorId === 0) {
          this.reloadSpot(currentUser.id);
        } else {
          this.reloadSector(sectorId, currentUser.id);
        }
      });
    } else {
      this.reloadUserAscents();
      this.reloadSectors(sectorId);
      if (sectorId === 0) {
        this.reloadSpot();
      } else {
        this.reloadSector(sectorId);
      }
      saveUserProp({ id: null });
    }
    loadFromLocalStorageSelectedFiltersProp();
    if (routeMarkColors.length === 0) {
      this.loadRouteMarkColors();
    }
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

    getSpotId = () => {
      const { match } = this.props;
      return parseInt(match.params.id, 10);
    };

    getSectorId = () => {
      const { match } = this.props;
      return match.params.sector_id ? parseInt(match.params.sector_id, 10) : 0;
    };

    onKeyDown = (event) => {
      if (event.key === 'Control') {
        this.setState({ ctrlPressed: true });
      }
    };

    onKeyUp = (event) => {
      if (event.key === 'Control') {
        this.setState({ ctrlPressed: false });
      }
    };

    reloadUserAscents = (userId) => {
      const {
        user,
        setRoutesData: setRoutesDataProp,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      const id = (userId || (avail(user.id) ? user.id : null));
      if (!id) {
        return;
      }
      increaseNumOfActiveRequestsProp();
      Axios.get(`${ApiUrl}/v1/users/${id}/ascents`)
        .then((response) => {
          decreaseNumOfActiveRequestsProp();
          setRoutesDataProp(
            R.map(
              ascent => (
                {
                  routeId: ascent.route_id,
                  content: { ascents: R.fromPairs([[ascent.id, ascent]]) },
                }
              ),
              response.data.payload,
            ),
          );
        }).catch((error) => {
          decreaseNumOfActiveRequestsProp();
          this.displayError(error);
        });
    };

    onRouteClick = (id) => {
      const { history, match } = this.props;
      history.push(`${match.url}/routes/${id}`);
    };

    closeRoutesModal = () => {
      const { history, match } = this.props;
      const sectorId = this.getSectorId();
      if (sectorId === 0) {
        this.reloadSpot();
      } else {
        this.reloadSector(sectorId);
      }
      history.push(R.replace('/routes', '', match.url));
      this.reloadUserAscents();
      this.reloadRoutes({}, null);
    };

    afterLogOut = () => {
      const sectorId = this.getSectorId();
      const { personal, outdated } = this.state;
      this.setState({ ascents: [] });
      this.reloadRoutes();
      if (sectorId === 0) {
        this.reloadSpot(0);
      } else {
        this.reloadSector(sectorId, 0);
      }
      let filters = [];
      const personalNew = {
        clickable: true,
        id: 'personal',
        selected: personal,
        text: `Авторские трассы ${personal ? ' ✓' : ''}`,
        value: 'personal',
      };
      filters = R.append(personalNew, filters);
      const outdatedNew = {
        clickable: true,
        id: 'outdated',
        selected: outdated,
        text: `Скрученные ${outdated ? ' ✓' : ''}`,
        value: 'outdated',
      };
      filters = R.append(outdatedNew, filters);
      this.setState({ filters });
    };

    reloadSpot = (userId) => {
      const {
        user,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      const spotId = this.getSpotId();
      let currentUserId;
      if (userId === null || userId === undefined) {
        if (notAvail(user.id)) {
          currentUserId = 0;
        } else {
          currentUserId = user.id;
        }
      } else {
        currentUserId = userId;
      }
      const params = {};
      if (currentUserId !== 0) {
        params.user_id = currentUserId;
      }
      increaseNumOfActiveRequestsProp();
      Axios.get(`${ApiUrl}/v1/spots/${spotId}`, { params })
        .then((response) => {
          decreaseNumOfActiveRequestsProp();
          let infoData = [
            {
              count: response.data.metadata.num_of_sectors,
              label: numToStr(response.data.metadata.num_of_sectors, ['Зал', 'Зала', 'Залов']),
            },
            {
              count: response.data.metadata.num_of_routes,
              label: numToStr(response.data.metadata.num_of_routes, ['Трасса', 'Трассы', 'Трасс']),
            },
          ];
          if (currentUserId !== 0) {
            infoData = R.append({
              count: response.data.metadata.num_of_unfulfilled,
              label: numToStr(
                response.data.metadata.num_of_unfulfilled,
                ['Невыполненная трасса', 'Невыполненные трассы', 'Невыполненных трасс'],
              ),
            }, infoData);
          }
          this.setState({
            spot: response.data.payload,
            infoData,
          });
        }).catch((error) => {
          decreaseNumOfActiveRequestsProp();
          this.displayError(error);
        });
    };

    reloadSector = (id, userId) => {
      const {
        user,
      } = this.props;
      let currentUserId;
      if (userId === null || userId === undefined) {
        if (notAvail(user.id)) {
          currentUserId = 0;
        } else {
          currentUserId = user.id;
        }
      } else {
        currentUserId = userId;
      }
      const params = {};
      if (currentUserId !== 0) {
        reloadSector(
          id,
          currentUserId,
          (response) => {
            let infoData = [
              {
                count: response.data.metadata.num_of_routes,
                label: numToStr(response.data.metadata.num_of_routes, ['Трасса', 'Трассы', 'Трасс']),
              },
              {
                count: response.data.metadata.num_of_new_routes,
                label: numToStr(
                  response.data.metadata.num_of_new_routes,
                  ['Новая трасса', 'Новые трассы', 'Новых трасс'],
                ),
              },
            ];
            if (currentUserId !== 0) {
              infoData = R.append({
                count: response.data.metadata.num_of_unfulfilled,
                label: numToStr(
                  response.data.metadata.num_of_unfulfilled,
                  ['Невыполненная трасса', 'Невыполненные трассы', 'Невыполненных трасс'],
                ),
              }, infoData);
            }
            this.setState({ infoData });
          },
          (error) => {
            this.displayError(error);
          },
        );
      }
    };

    reloadSectors = (currentSectorId, user) => {
      const {
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
        setSectors: setSectorsProp,
        setSectorIds: setSectorIdsProp,
        selectedFilters,
        setDefaultSelectedFilters: setDefaultSelectedFiltersProp,
        selectedPages,
        setDefaultSelectedPages: setDefaultSelectedPagesProp,
      } = this.props;
      const spotId = this.getSpotId();
      increaseNumOfActiveRequestsProp();
      Axios.get(`${ApiUrl}/v1/spots/${spotId}/sectors`)
        .then((response) => {
          decreaseNumOfActiveRequestsProp();
          setSectorsProp(response.data.payload);
          setSectorIdsProp(R.map(sector => sector.id, response.data.payload));
          if (!selectedFilters || selectedFilters[spotId] === undefined) {
            setDefaultSelectedFiltersProp(
              spotId,
              R.map(sector => sector.id, response.data.payload),
            );
          }
          if (!selectedPages || selectedPages[spotId] === undefined) {
            setDefaultSelectedPagesProp(
              spotId,
              R.map(sector => sector.id, response.data.payload),
            );
            const filters = R.merge(
              { sectorId: currentSectorId },
              (selectedFilters[spotId] === undefined ? DEFAULT_FILTERS : {}),
            );
            this.reloadRoutes(filters, 1, user);
          } else {
            this.reloadRoutes({ sectorId: currentSectorId }, null, user);
          }
        }).catch((error) => {
          decreaseNumOfActiveRequestsProp();
          this.displayError(error);
        });
    };

    loadRouteMarkColors = () => {
      const {
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
        loadRouteMarkColors: loadRouteMarkColorsProp,
      } = this.props;
      increaseNumOfActiveRequestsProp();
      Axios.get(`${ApiUrl}/v1/route_mark_colors`)
        .then((response) => {
          decreaseNumOfActiveRequestsProp();
          loadRouteMarkColorsProp(response.data.payload);
        }).catch((error) => {
          decreaseNumOfActiveRequestsProp();
          this.displayError(error);
        });
    };

    reloadRoutes = (filters = {}, page = 1, userCurr, viewModeCurr) => {
      const {
        sectors,
        user,
        selectedViewModes,
        selectedFilters,
        selectedPages,
        token,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
        setRoutes: setRoutesProp,
        setRouteIds: setRouteIdsProp,
      } = this.props;
      const { name } = this.state;
      const spotId = this.getSpotId();
      const sectorId = this.getSectorId();
      const currentSectorId = parseInt(
        (
          (filters.sectorId === null || filters.sectorId === undefined)
            ? sectorId
            : filters.sectorId
        ),
        10,
      );
      let viewMode;
      const viewModes = selectedViewModes;
      const currSector = currentSectorId && sectors[currentSectorId];
      if (viewModes && viewModes[spotId] && viewModes[spotId][currentSectorId]) {
        viewMode = selectedViewModes[spotId][currentSectorId];
      } else if (currentSectorId === 0) {
        viewMode = DEFAULT_SPOT_VIEW_MODE;
      } else if (currSector && currSector.diagram) {
        [viewMode] = DEFAULT_SECTOR_VIEW_MODE_LIST;
      } else {
        viewMode = R.last(DEFAULT_SECTOR_VIEW_MODE_LIST);
      }
      const currentViewMode = viewModeCurr || viewMode;
      const currentCategoryFrom = (
        (filters.categoryFrom === null || filters.categoryFrom === undefined)
          ? selectedFilters[spotId][currentSectorId].categoryFrom
          : filters.categoryFrom
      );
      const currentCategoryTo = (
        (filters.categoryTo === null || filters.categoryTo === undefined)
          ? selectedFilters[spotId][currentSectorId].categoryTo
          : filters.categoryTo
      );
      const currentName = (
        (filters.name === null || filters.name === undefined)
          ? name
          : filters.name
      );
      const currentPeriod = (
        (filters.period === null || filters.period === undefined)
          ? selectedFilters[spotId][currentSectorId].period
          : filters.period
      );
      let currentDate = (
        (filters.date === null || filters.date === undefined)
          ? selectedFilters[spotId][currentSectorId].date
          : filters.date
      );
      currentDate = currentDate || DEFAULT_FILTERS.date;
      const currentResult = (
        (filters.result === null || filters.result === undefined)
          ? selectedFilters[spotId][currentSectorId].result
          : filters.result
      );
      const currentPersonal = (
        (filters.personal === null || filters.personal === undefined)
          ? selectedFilters[spotId][currentSectorId].personal
          : filters.personal
      );
      const currentOutdated = (
        (filters.outdated === null || filters.outdated === undefined)
          ? selectedFilters[spotId][currentSectorId].outdated
          : filters.outdated
      );
      const currentPage = (
        (page === null || page === undefined)
          ? selectedPages[spotId][currentSectorId]
          : page
      );
      const params = {
        filters: {
          category: [[currentCategoryFrom], [currentCategoryTo]],
          personal: currentPersonal,
          outdated: currentViewMode === 'scheme' ? true : currentOutdated,
        },
      };
      if ((userCurr && avail(userCurr.id)) || (user && avail(user.id))) {
        params.filters.result = (currentResult.length === 0 ? [null] : currentResult);
      }
      if (currentName !== '') {
        params.filters.name = { like: currentName };
      }
      if (currentPeriod !== 0) {
        const d = new Date();
        const dFrom = new Date(d);
        switch (currentPeriod) {
        case 1:
          dFrom.setDate(d.getDate() - 1);
          break;
        case 2:
          dFrom.setDate(d.getDate() - 7);
          break;
        case 3:
          dFrom.setMonth(d.getMonth() - 1);
          break;
        case 4:
          dFrom.setYear(d.getFullYear() - 1);
          break;
        default:
          break;
        }
        params.filters.installed_at = [[dFrom], [d]];
      }
      if (currentViewMode === 'scheme') {
        params.filters.installed_at = [[null], [moment(currentDate).format(BACKEND_DATE_FORMAT)]];
        params.filters.installed_until = [
          [moment(currentDate).add(1, 'days').format(BACKEND_DATE_FORMAT)],
          [null],
        ];
      } else {
        params.limit = CARDS_PER_PAGE;
        params.offset = (currentPage - 1) * CARDS_PER_PAGE;
      }
      if (token) params.token = token;
      if (currentSectorId === 0) {
        increaseNumOfActiveRequestsProp();
        Axios.get(`${ApiUrl}/v1/spots/${spotId}/routes`, { params })
          .then((response) => {
            decreaseNumOfActiveRequestsProp();
            this.setState(
              { numOfPages: Math.max(1, Math.ceil(response.data.metadata.all / CARDS_PER_PAGE)) },
            );
            setRoutesProp(response.data.payload);
            setRouteIdsProp(R.map(route => route.id, response.data.payload));
          }).catch((error) => {
            decreaseNumOfActiveRequestsProp();
            this.displayError(error);
          });
      } else {
        increaseNumOfActiveRequestsProp();
        Axios.get(`${ApiUrl}/v1/sectors/${currentSectorId}/routes`, { params })
          .then((response) => {
            decreaseNumOfActiveRequestsProp();
            this.setState(
              { numOfPages: Math.max(1, Math.ceil(response.data.metadata.all / CARDS_PER_PAGE)) },
            );
            setRoutesProp(response.data.payload);
            setRouteIdsProp(R.map(route => route.id, response.data.payload));
          }).catch((error) => {
            decreaseNumOfActiveRequestsProp();
            this.displayError(error);
          });
      }
    };

    changeSectorFilter = (id) => {
      const { history, user, match } = this.props;
      if (id !== 0) {
        this.reloadSector(id);
        history.push(`${R.replace(/\/sectors\/[0-9]*/, '', match.url)}/sectors/${id}`);
      } else {
        this.reloadSpot();
        history.push(R.replace(/\/sectors\/[0-9]*/, '', match.url));
      }
      this.reloadRoutes({ sectorId: id }, null, user);
    };

    changeCategoryFilter = (categoryFrom, categoryTo) => {
      const {
        setSelectedFilter: setSelectedFilterProp,
        setSelectedPage: setSelectedPageProp,
      } = this.props;
      const spotId = this.getSpotId();
      const sectorId = this.getSectorId();
      if (categoryFrom !== null) {
        setSelectedFilterProp(spotId, sectorId, 'categoryFrom', categoryFrom);
        setSelectedPageProp(spotId, sectorId, 1);
      }
      if (categoryTo !== null) {
        setSelectedFilterProp(spotId, sectorId, 'categoryTo', categoryTo);
        setSelectedPageProp(spotId, sectorId, 1);
      }
      this.reloadRoutes({ categoryFrom, categoryTo });
    };

    changePeriodFilter = (period) => {
      const {
        setSelectedFilter: setSelectedFilterProp,
        setSelectedPage: setSelectedPageProp,
      } = this.props;
      const spotId = this.getSpotId();
      const sectorId = this.getSectorId();
      setSelectedFilterProp(spotId, sectorId, 'period', period);
      setSelectedPageProp(spotId, sectorId, 1);
      this.reloadRoutes({ period });
    };

    changeDateFilter = (date) => {
      const {
        setSelectedFilter: setSelectedFilterProp,
      } = this.props;
      const spotId = this.getSpotId();
      const sectorId = this.getSectorId();
      setSelectedFilterProp(spotId, sectorId, 'date', date ? date.format() : undefined);
      this.reloadRoutes({ date: date ? date.format() : DEFAULT_FILTERS.date });
    };

    changeResultFilter = (result) => {
      const {
        setSelectedFilter: setSelectedFilterProp,
        setSelectedPage: setSelectedPageProp,
      } = this.props;
      const spotId = this.getSpotId();
      const sectorId = this.getSectorId();
      setSelectedFilterProp(spotId, sectorId, 'result', result);
      setSelectedPageProp(spotId, sectorId, 1);
      this.reloadRoutes({ result });
    };

    changeFilter = (name, value) => {
      const {
        setSelectedFilter: setSelectedFilterProp,
        setSelectedPage: setSelectedPageProp,
      } = this.props;
      const spotId = this.getSpotId();
      const sectorId = this.getSectorId();
      setSelectedFilterProp(spotId, sectorId, name, value);
      setSelectedPageProp(spotId, sectorId, 1);
      const state = {};
      state[name] = value;
      this.reloadRoutes(state);
    };

    changeNameFilter = (searchString) => {
      this.setState({ name: searchString });
      this.reloadRoutes({ name: searchString });
    };

    changePage = (page) => {
      const {
        setSelectedPage: setSelectedPageProp,
      } = this.props;
      const spotId = this.getSpotId();
      const sectorId = this.getSectorId();
      setSelectedPageProp(spotId, sectorId, page);
      this.reloadRoutes({}, page);
    };

    onFilterChange = (id) => {
      const {
        selectedFilters,
        setSelectedFilter: setSelectedFilterProp,
      } = this.props;
      const spotId = this.getSpotId();
      const sectorId = this.getSectorId();
      const filters = R.clone(selectedFilters[spotId][sectorId].filters);
      const index = R.findIndex(e => e.id === id, filters);
      if (filters[index].selected) {
        filters[index].text = R.slice(0, -2, filters[index].text);
      } else {
        filters[index].text = `${filters[index].text} ✓`;
      }
      filters[index].selected = !filters[index].selected;
      if (R.contains(id, ['personal', 'outdated'])) {
        this.changeFilter(id, filters[index].selected);
      }
      if (R.contains(id, R.map(e => e.id, RESULT_FILTERS))) {
        const resultFilters = R.filter(
          e => R.contains(e.id, R.map(f => f.id, RESULT_FILTERS)),
          filters,
        );
        this.changeResultFilter(
          R.map(e => e.value, R.filter(e => e.selected, resultFilters)),
        );
      }
      setSelectedFilterProp(spotId, sectorId, 'filters', filters);
    };

    afterSubmitLogInForm = (userId) => {
      const sectorId = this.getSectorId();
      this.reloadRoutes();
      if (sectorId === 0) {
        this.reloadSpot(userId);
      } else {
        this.reloadSector(sectorId, userId);
      }
      this.reloadUserAscents(userId);
    };

    afterSubmitSignUpForm = (userId) => {
      const sectorId = this.getSectorId();
      this.reloadRoutes();
      if (sectorId === 0) {
        this.reloadSpot(userId);
      } else {
        this.reloadSector(sectorId, userId);
      }
      this.reloadUserAscents(userId);
    };

    removeRoute = (routeId) => {
      const {
        token,
        removeRoute: removeRouteProp,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      if (window.confirm('Удалить трассу?')) {
        increaseNumOfActiveRequestsProp();
        Axios({
          url: `${ApiUrl}/v1/routes/${routeId}`,
          method: 'delete',
          headers: { TOKEN: token },
        })
          .then(() => {
            decreaseNumOfActiveRequestsProp();
            this.reloadRoutes();
            removeRouteProp(routeId);
            this.closeRoutesModal();
          }).catch((error) => {
            decreaseNumOfActiveRequestsProp();
            this.displayError(error);
          });
      }
      this.setState({ ctrlPressed: false });
    };

    removeComment = (routeId, comment) => {
      const {
        token,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      if (!window.confirm('Удалить комментарий?')) {
        return;
      }
      increaseNumOfActiveRequestsProp();
      Axios({
        url: `${ApiUrl}/v1/route_comments/${comment.id}`,
        method: 'delete',
        headers: { TOKEN: token },
      })
        .then(() => {
          decreaseNumOfActiveRequestsProp();
          reloadComments(
            routeId,
            null,
            (error) => {
              this.displayError(error);
            },
          );
        }).catch((error) => {
          decreaseNumOfActiveRequestsProp();
          this.displayError(error);
        });
    };

    saveComment = (routeId, params, afterSuccess) => {
      const {
        token,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      increaseNumOfActiveRequestsProp();
      Axios.post(`${ApiUrl}/v1/route_comments`, params, { headers: { TOKEN: token } })
        .then(() => {
          decreaseNumOfActiveRequestsProp();
          reloadComments(
            routeId,
            null,
            (error) => {
              this.displayError(error);
            },
          );
          if (afterSuccess) {
            afterSuccess();
          }
        }).catch((error) => {
          decreaseNumOfActiveRequestsProp();
          this.displayError(error);
        });
    };

    onLikeChange = (routeId, afterChange) => {
      const {
        user,
        token,
        routes,
        setRouteProperty: setRoutePropertyProp,
        removeRoutePropertyById: removeRoutePropertyByIdProp,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      increaseNumOfActiveRequestsProp();
      const route = routes[routeId];
      const like = R.find(R.propEq('user_id', user.id))(getArrayFromObject(route.likes));
      if (like) {
        Axios({
          url: `${ApiUrl}/v1/likes/${like.id}`,
          method: 'delete',
          headers: { TOKEN: token },
        })
          .then(() => {
            decreaseNumOfActiveRequestsProp();
            removeRoutePropertyByIdProp(
              routeId,
              'likes',
              like.id,
            );
            afterChange();
          }).catch((error) => {
            decreaseNumOfActiveRequestsProp();
            this.displayError(error);
            afterChange();
          });
      } else {
        const params = { like: { user_id: user.id, route_id: routeId } };
        Axios.post(`${ApiUrl}/v1/likes`, params, { headers: { TOKEN: token } })
          .then((response) => {
            decreaseNumOfActiveRequestsProp();
            setRoutePropertyProp(
              routeId,
              'likes',
              response.data.payload,
            );
            afterChange();
          }).catch((error) => {
            decreaseNumOfActiveRequestsProp();
            this.displayError(error);
            afterChange();
          });
      }
    };

    changeAscentResult = (routeId) => {
      const {
        user,
        token,
        routes,
        setRouteProperty: setRoutePropertyProp,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      increaseNumOfActiveRequestsProp();
      const route = routes[routeId];
      const ascent = R.find(R.propEq('user_id', user.id))(getArrayFromObject(route.ascents));
      if (ascent) {
        let result;
        if (ascent.result === 'red_point') {
          result = 'flash';
        } else if (ascent.result === 'flash') {
          result = 'unsuccessful';
        } else {
          result = 'red_point';
        }
        const params = { ascent: { result } };
        Axios({
          url: `${ApiUrl}/v1/ascents/${ascent.id}`,
          method: 'patch',
          params,
          headers: { TOKEN: token },
        })
          .then((response) => {
            decreaseNumOfActiveRequestsProp();
            setRoutePropertyProp(
              routeId,
              'ascents',
              response.data.payload,
            );
          }).catch((error) => {
            decreaseNumOfActiveRequestsProp();
            this.displayError(error);
          });
      } else {
        const result = 'red_point';
        const params = { ascent: { result, user_id: user.id, route_id: routeId } };
        Axios.post(`${ApiUrl}/v1/ascents`, params, { headers: { TOKEN: token } })
          .then((response) => {
            decreaseNumOfActiveRequestsProp();
            setRoutePropertyProp(
              routeId,
              'ascents',
              response.data.payload,
            );
          }).catch((error) => {
            decreaseNumOfActiveRequestsProp();
            this.displayError(error);
          });
      }
    };

    loadUsers = () => {
      const {
        token,
        setUsers: setUsersProp,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      increaseNumOfActiveRequestsProp();
      Axios.get(`${ApiUrl}/v1/users`, { headers: { TOKEN: token } })
        .then((response) => {
          decreaseNumOfActiveRequestsProp();
          const users = R.sort(
            (u1, u2) => u2.statistics.numOfCreatedRoutes - u1.statistics.numOfCreatedRoutes,
            response.data.payload,
          );
          setUsersProp(users);
        }).catch((error) => {
          decreaseNumOfActiveRequestsProp();
          this.displayError(error);
        });
    };

    createRoute = (params) => {
      const {
        token,
        history,
        match,
        setRoute: setRouteProp,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      increaseNumOfActiveRequestsProp();
      this.setState({ editRouteIsWaiting: true });
      Axios({
        url: `${ApiUrl}/v1/routes`,
        method: 'post',
        data: params,
        headers: { TOKEN: token },
        config: { headers: { 'Content-Type': 'multipart/form-data' } },
      })
        .then((response) => {
          decreaseNumOfActiveRequestsProp();
          setRouteProp(response.data.payload);
          history.push(
            `${match.url}/${response.data.payload.id}`,
          );
          this.setState({
            editRouteIsWaiting: false,
          });
        }).catch((error) => {
          decreaseNumOfActiveRequestsProp();
          this.displayError(error);
          this.setState({ editRouteIsWaiting: false });
        });
    };

    updateRoute = (routeId, params) => {
      const {
        token,
        history,
        match,
        setRoute: setRouteProp,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      increaseNumOfActiveRequestsProp();
      this.setState({ editRouteIsWaiting: true });
      Axios({
        url: `${ApiUrl}/v1/routes/${routeId}`,
        method: 'patch',
        data: params,
        headers: { TOKEN: token },
        config: { headers: { 'Content-Type': 'multipart/form-data' } },
      })
        .then((response) => {
          decreaseNumOfActiveRequestsProp();
          setRouteProp(response.data.payload);
          history.push(`${match.url}/routes/${routeId}`);
          this.setState(
            {
              editRouteIsWaiting: false,
            },
          );
        }).catch((error) => {
          decreaseNumOfActiveRequestsProp();
          this.displayError(error);
          this.setState({ editRouteIsWaiting: false });
        });
    };

    openEdit = (routeId) => {
      const { history, match } = this.props;
      history.push(`${match.url}/${routeId}/edit`);
    };

    cancelEdit = (routeId) => {
      const { history } = this.props;
      history.goBack();
    };

    goToNew = () => {
      const { history, match } = this.props;
      history.push(`${match.url}/routes/new`);
    };

    onCategoryChange = (id) => {
      switch (id) {
      case 0:
        this.changeCategoryFilter(CATEGORIES[0], CATEGORIES[CATEGORIES.length - 1]);
        break;
      case 1:
        this.changeCategoryFilter(CATEGORIES[0], '6a+');
        break;
      case 2:
        this.changeCategoryFilter('6a', '6b+');
        break;
      case 3:
        this.changeCategoryFilter('6b', '7a+');
        break;
      case 4:
        this.changeCategoryFilter('7a', CATEGORIES[CATEGORIES.length - 1]);
        break;
      default:
        break;
      }
    };

    changeViewMode = (viewMode) => {
      const {
        user,
        selectedFilters,
        setSelectedFilter: setSelectedFilterProp,
        setSelectedViewMode: setSelectedViewModeProp,
      } = this.props;
      const spotId = this.getSpotId();
      const sectorId = this.getSectorId();
      let date = '';
      setSelectedViewModeProp(spotId, sectorId, viewMode);
      if (viewMode === 'scheme') {
        date = (
          (selectedFilters && selectedFilters[spotId])
            ? selectedFilters[spotId][sectorId].date
            : DEFAULT_FILTERS.date
        );
        setSelectedFilterProp(spotId, sectorId, 'date', date);
      }
      this.reloadRoutes({ date }, null, user, viewMode);
    };

    submitNoticeForm = (routeId, msg) => {
      const {
        user,
        selectedFilters,
      } = this.props;
      const sectorId = this.getSectorId();
      const spotId = this.getSpotId();
      Sentry.withScope((scope) => {
        scope.setExtra('user_id', user.id);
        scope.setExtra('route_id', routeId);
        scope.setExtra(
          'filters',
          (
            (selectedFilters && selectedFilters[spotId])
              ? selectedFilters[spotId][sectorId]
              : undefined
          ),
        );
        scope.setExtra('url', window.location.href);
        if (user.login) {
          scope.setExtra('user_login', user.login);
        } else if (user.email) {
          scope.setExtra('user_email', user.email);
        } else {
          scope.setExtra('user_phone', user.phone);
        }
        Sentry.captureException(msg);
        this.showToastr('success', 'Успешно', 'Сообщение успешно отправлено');
      });
    };

    content = () => {
      const {
        selectedPages,
        selectedFilters,
        selectedViewModes,
        sectors,
        user,
        numOfActiveRequests,
      } = this.props;
      const {
        spot,
        ctrlPressed,
        signUpFormVisible,
        signUpIsWaiting,
        signUpFormErrors,
        logInFormVisible,
        logInIsWaiting,
        logInFormErrors,
        profileFormVisible,
        profileIsWaiting,
        profileFormErrors,
        infoData,
        numOfPages,
      } = this.state;
      const spotId = this.getSpotId();
      const sectorId = this.getSectorId();
      let viewMode;
      const currSector = R.find(s => s.id === sectorId, sectors);
      if (selectedViewModes && selectedViewModes[spotId] && selectedViewModes[spotId][sectorId]) {
        viewMode = selectedViewModes[spotId][sectorId];
      } else if (sectorId === 0) {
        viewMode = DEFAULT_SPOT_VIEW_MODE;
      } else if (currSector && currSector.diagram) {
        [viewMode] = DEFAULT_SECTOR_VIEW_MODE_LIST;
      } else {
        viewMode = R.last(DEFAULT_SECTOR_VIEW_MODE_LIST);
      }
      const categoryFrom = (
        (selectedFilters && selectedFilters[spotId])
          ? selectedFilters[spotId][sectorId].categoryFrom
          : DEFAULT_FILTERS.categoryFrom
      );
      const categoryTo = (
        (selectedFilters && selectedFilters[spotId])
          ? selectedFilters[spotId][sectorId].categoryTo
          : DEFAULT_FILTERS.categoryTo
      );
      const period = (
        (selectedFilters && selectedFilters[spotId])
          ? selectedFilters[spotId][sectorId].period
          : DEFAULT_FILTERS.period
      );
      let date = (
        (selectedFilters && selectedFilters[spotId])
          ? selectedFilters[spotId][sectorId].date
          : undefined
      );
      date = date || DEFAULT_FILTERS.date;
      const filters = (
        (selectedFilters && selectedFilters[spotId])
          ? selectedFilters[spotId][sectorId].filters
          : DEFAULT_FILTERS.filters
      );
      let categoryId = 0;
      if (categoryFrom === CATEGORIES[0] && categoryTo === '6a+') {
        categoryId = 1;
      }
      if (categoryFrom === '6a' && categoryTo === '6b+') {
        categoryId = 2;
      }
      if (categoryFrom === '6b' && categoryTo === '7a+') {
        categoryId = 3;
      }
      if (categoryFrom === '7a' && categoryTo === CATEGORIES[CATEGORIES.length - 1]) {
        categoryId = 4;
      }
      const defaultFilters = R.filter(
        e => !R.contains(e.id, R.map(f => f.id, RESULT_FILTERS)),
        filters,
      );
      let data;
      const sector = sectors[sectorId];
      if (sectorId === 0) {
        data = spot;
      } else if (sector && sector.id === sectorId) {
        data = sector;
      } else {
        data = {};
      }
      return (
        <>
          {
            signUpFormVisible
              ? (
                <SignUpForm
                  onFormSubmit={this.submitSignUpForm}
                  closeForm={this.closeSignUpForm}
                  enterWithVk={this.enterWithVk}
                  isWaiting={signUpIsWaiting}
                  formErrors={signUpFormErrors}
                  resetErrors={this.signUpResetErrors}
                />
              )
              : ''
          }
          {
            logInFormVisible
              ? (
                <LogInForm
                  onFormSubmit={this.submitLogInForm}
                  closeForm={this.closeLogInForm}
                  enterWithVk={this.enterWithVk}
                  isWaiting={logInIsWaiting}
                  resetPassword={this.resetPassword}
                  formErrors={logInFormErrors}
                  resetErrors={this.logInResetErrors}
                />
              )
              : ''
          }
          {
            (avail(user.id) && profileFormVisible) && (
              <Profile
                user={user}
                onFormSubmit={this.submitProfileForm}
                removeVk={this.removeVk}
                numOfActiveRequests={numOfActiveRequests}
                showToastr={this.showToastr}
                enterWithVk={this.enterWithVk}
                isWaiting={profileIsWaiting}
                closeForm={this.closeProfileForm}
                formErrors={profileFormErrors}
                resetErrors={this.profileResetErrors}
              />
            )
          }
          <ToastContainer
            ref={(ref) => {
              this.container = ref;
            }}
            onClick={() => this.container.clear()}
            className="toast-top-right"
          />
          <Header
            data={data}
            infoData={infoData}
            changeSectorFilter={this.changeSectorFilter}
            changeNameFilter={this.changeNameFilter}
            user={userStateToUser(user)}
            openProfile={this.openProfileForm}
            signUp={this.signUp}
            logIn={this.logIn}
            logOut={this.logOut}
          />
          <Content
            user={userStateToUser(user)}
            ctrlPressed={ctrlPressed}
            addRoute={this.goToNew}
            page={
              (selectedPages && selectedPages[spotId])
                ? selectedPages[spotId][sectorId]
                : 1
            }
            numOfPages={numOfPages}
            period={period}
            date={date}
            filters={avail(user.id) ? filters : defaultFilters}
            categoryId={categoryId}
            onRouteClick={this.onRouteClick}
            onCategoryChange={this.onCategoryChange}
            changePeriodFilter={this.changePeriodFilter}
            changeDateFilter={this.changeDateFilter}
            onFilterChange={this.onFilterChange}
            changePage={this.changePage}
            viewMode={viewMode}
            changeViewMode={this.changeViewMode}
          />
        </>
      );
    };

    render() {
      const {
        match,
        user,
        sectors,
        numOfActiveRequests,
        routeMarkColors,
      } = this.props;
      const {
        signUpFormVisible,
        logInFormVisible,
        profileFormVisible,
        ctrlPressed,
        editRouteIsWaiting,
      } = this.state;
      const showModal = signUpFormVisible || logInFormVisible || profileFormVisible;
      const sectorId = this.getSectorId();
      const sector = sectorId !== 0 ? sectors[sectorId] : undefined;
      return (
        <SectorContext.Provider value={{ sector }}>
          <div className={showModal ? null : 'page__scroll'}>
            <Switch>
              <Route
                path={[`${match.path}/:route_id/edit`, `${match.path}/new`]}
                render={() => (
                  <RoutesEditModal
                    displayError={this.displayError}
                    onClose={this.closeRoutesModal}
                    cancel={this.cancelEdit}
                    loadUsers={this.loadUsers}
                    routeMarkColors={routeMarkColors}
                    numOfActiveRequests={numOfActiveRequests}
                    createRoute={this.createRoute}
                    updateRoute={this.updateRoute}
                    isWaiting={editRouteIsWaiting}
                  />
                )}
              />
              <Route
                path={`${match.path}/:route_id`}
                render={() => (
                  <RoutesShowModal
                    displayError={this.displayError}
                    onClose={this.closeRoutesModal}
                    openEdit={this.openEdit}
                    removeRoute={this.removeRoute}
                    ctrlPressed={ctrlPressed}
                    goToProfile={this.openProfileForm}
                    removeComment={this.removeComment}
                    saveComment={this.saveComment}
                    onLikeChange={this.onLikeChange}
                    numOfActiveRequests={numOfActiveRequests}
                    changeAscentResult={this.changeAscentResult}
                    submitNoticeForm={this.submitNoticeForm}
                  />
                )}
              />
            </Switch>
            <StickyBar loading={numOfActiveRequests > 0}>
              {this.content()}
            </StickyBar>
            <Footer
              user={userStateToUser(user)}
              logIn={this.logIn}
              signUp={this.signUp}
              logOut={this.logOut}
            />
          </div>
        </SectorContext.Provider>
      );
    }
}

const mapStateToProps = state => ({
  routes: state.routes,
  selectedViewModes: state.selectedViewModes,
  selectedPages: state.selectedPages,
  selectedFilters: state.selectedFilters,
  sectors: state.sectors,
  user: state.user,
  token: state.token,
  numOfActiveRequests: state.numOfActiveRequests,
  routeMarkColors: state.routeMarkColors,
});

const mapDispatchToProps = dispatch => ({
  setRoutes: routes => dispatch(setRoutes(routes)),
  setRoutesData: routesData => dispatch(setRoutesData(routesData)),
  setRouteProperty: (routeId, routePropertyName, routePropertyData) => dispatch(
    setRouteProperty(routeId, routePropertyName, routePropertyData),
  ),
  removeRoutePropertyById: (routeId, routePropertyName, routePropertyId) => dispatch(
    removeRoutePropertyById(routeId, routePropertyName, routePropertyId),
  ),
  setRouteIds: routeIds => dispatch(setRouteIds(routeIds)),
  setSectorIds: sectorIds => dispatch(setSectorIds(sectorIds)),
  removeRoute: routeId => dispatch(removeRoute(routeId)),
  setSelectedViewMode: (spotId, sectorId, viewMode) => (
    dispatch(setSelectedViewMode(spotId, sectorId, viewMode))
  ),
  setSelectedPage: (spotId, sectorId, page) => dispatch(setSelectedPage(spotId, sectorId, page)),
  setDefaultSelectedPages: (spotId, sectorIds) => (
    dispatch(setDefaultSelectedPages(spotId, sectorIds))
  ),
  setSelectedFilter: (spotId, sectorId, filterName, filterValue) => (
    dispatch(setSelectedFilter(spotId, sectorId, filterName, filterValue))
  ),
  setDefaultSelectedFilters: (spotId, sectorIds) => (
    dispatch(setDefaultSelectedFilters(spotId, sectorIds))
  ),
  loadFromLocalStorageSelectedFilters: () => dispatch(loadFromLocalStorageSelectedFilters()),
  setSectors: sectors => dispatch(setSectors(sectors)),
  setSector: sector => dispatch(setSector(sector)),
  loadRouteMarkColors: routeMarkColors => dispatch(loadRouteMarkColors(routeMarkColors)),
  saveUser: user => dispatch(saveUser(user)),
  setUsers: users => dispatch(setUsers(users)),
  saveToken: token => dispatch(saveToken(token)),
  removeToken: () => dispatch(removeToken()),
  setRoute: route => dispatch(setRoute(route)),
  setRouteData: (routeId, routeData) => (
    dispatch(setRouteData(routeId, routeData))
  ),
  increaseNumOfActiveRequests: () => dispatch(increaseNumOfActiveRequests()),
  decreaseNumOfActiveRequests: () => dispatch(decreaseNumOfActiveRequests()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsShow));
