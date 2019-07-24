import React from 'react';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import Qs from 'qs';
import { connect } from 'react-redux';
import * as R from 'ramda';
import Cookies from 'js-cookie';
import { ToastContainer } from 'react-toastr';
import ApiUrl from '../ApiUrl';
import {
  setSelectedPage,
  setDefaultSelectedPages,
  setSelectedFilter,
  setDefaultSelectedFilters,
  loadRoutes,
  loadSectors,
  loadRouteMarkColors,
  saveUser,
  saveToken,
  removeToken,
  increaseNumOfActiveRequests,
  decreaseNumOfActiveRequests,
  updateRoute,
  addRoute,
  loadFromLocalStorageSelectedFilters,
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
import { avail, notAvail } from '../Utils';
import { userStateToUser } from '../Utils/Workarounds';

const NumOfDays = 7;

Axios.interceptors.request.use((config) => {
  const configCopy = R.clone(config);
  configCopy.paramsSerializer = params => Qs.stringify(params, { arrayFormat: 'brackets' });
  return configCopy;
});

class SpotsShow extends Authorization {
  constructor(props) {
    super(props);

    const { match } = this.props;
    this.state = Object.assign(this.state, {
      spotId: parseInt(match.params.id, 10),
      sectorId: match.params.sector_id ? parseInt(match.params.sector_id, 10) : 0,
      sector: {},
      name: '',
      numOfPages: 1,
      perPage: CARDS_PER_PAGE,
      spot: {},
      infoData: undefined,
      routesModalVisible: false,
      currentShown: {},
      editMode: false,
      ascents: [],
      ctrlPressed: false,
      comments: [],
      numOfComments: 0,
      numOfLikes: undefined,
      isLiked: false,
      likeId: 0,
      likeBtnIsBusy: false,
      ascent: null,
      numOfRedpoints: undefined,
      numOfFlash: undefined,
      users: [],
      editRouteIsWaiting: false,
    });
    this.loadingRouteId = match.params.route_id;
    this.loadEditMode = false;
  }

  componentDidMount() {
    const {
      user,
      history,
      saveToken: saveTokenProp,
      saveUser: saveUserProp,
      loadFromLocalStorageSelectedFilters: loadFromLocalStorageSelectedFiltersProp,
      routeMarkColors,
    } = this.props;
    history.listen((location, action) => {
      if (action === 'POP') {
        const data = location.pathname.split('/');
        if (data.length > 3 && data[3] === 'sectors') {
          const sectorId = parseInt(data[4], 10);
          if (data.length > 5 && data[5] === 'routes') {
            if (data[6] === 'new') {
              if (avail(user.id) && (user.role === 'admin' || user.role === 'creator')) {
                this.addRoute();
              } else {
                window.location = '/';
              }
            } else {
              this.loadingRouteId = data[6];
              if (data.length > 7 && data[7] === 'edit') {
                if (avail(user.id) && (user.role === 'admin' || user.role === 'creator')) {
                  this.loadUsers();
                  this.loadEditMode = true;
                  this.setState({ sectorId });
                } else {
                  window.location = '/';
                }
              } else {
                this.loadEditMode = false;
                this.setState({ sectorId });
              }
            }
          } else {
            this.setState({
              sectorId,
              profileFormVisible: (location.hash === '#profile'),
              routesModalVisible: false,
            });
          }
          this.reloadSector(sectorId);
          this.reloadSectors(sectorId);
          this.reloadUserAscents();
        } else {
          if (data.length > 3 && data[3] === 'routes') {
            if (data[4] === 'new') {
              if (avail(user.id) && (user.role === 'admin' || user.role === 'creator')) {
                this.addRoute();
              } else {
                window.location = '/';
              }
            } else {
              this.loadingRouteId = data[4];
              if (data.length > 5 && data[5] === 'edit') {
                if (avail(user.id) && (user.role === 'admin' || user.role === 'creator')) {
                  this.loadUsers();
                  this.loadEditMode = true;
                  this.setState({ sectorId: 0 });
                } else {
                  window.location = '/';
                }
              } else {
                this.loadEditMode = false;
                this.setState({ sectorId: 0 });
              }
            }
          } else {
            this.setState({
              sectorId: 0,
              profileFormVisible: (location.hash === '#profile'),
              routesModalVisible: false,
            });
          }
          this.reloadSpot();
          this.reloadSectors(0);
          this.reloadUserAscents();
        }
      }
    });

    const { sectorId } = this.state;
    if (Cookies.get('user_session_token') !== undefined) {
      const token = Cookies.get('user_session_token');
      saveTokenProp(token);
      this.signIn(token, (currentUser) => {
        this.reloadUserAscents(currentUser.id);
        const data = location.pathname.split('/');
        if (currentUser.role === 'admin' || currentUser.role === 'creator') {
          if (R.find(e => e === 'new', data)) {
            this.addRoute();
          }
          if (R.find(e => e === 'edit', data)) {
            this.loadUsers();
            this.loadEditMode = true;
            this.loadRoute(data[3] === 'routes' ? data[4] : data[6], this.openModal);
          }
        } else if (R.find(e => (e === 'new' || e === 'edit'), data)) {
          window.location = '/';
        }
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
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      const id = (userId || (avail(user.id) ? user.id : null));
      if (!id) {
        this.setState({ ascents: [] });
        return;
      }
      increaseNumOfActiveRequestsProp();
      Axios.get(`${ApiUrl}/v1/users/${id}/ascents`)
        .then((response) => {
          decreaseNumOfActiveRequestsProp();
          this.setState({ ascents: response.data.payload });
        }).catch((error) => {
          decreaseNumOfActiveRequestsProp();
          this.displayError(error);
        });
    };

    onRouteClick = (id) => {
      const { routes, history } = this.props;
      const { spotId, sectorId } = this.state;
      if (sectorId === 0) {
        history.push(`/spots/${spotId}/routes/${id}`);
      } else {
        history.push(`/spots/${spotId}/sectors/${sectorId}/routes/${id}`);
      }
      this.reloadComments(id);
      this.reloadLikes(id);
      this.reloadAscents(id);
      const route = R.find(
        R.propEq('id', id),
        R.pathOr({}, [spotId, sectorId], routes),
      );
      this.loadRoute(id, route ? null : this.openModal);
      this.setState({
        editMode: false,
        currentShown: route || {},
        routesModalVisible: route,
      });
    };

    openModal = () => {
      this.setState({ routesModalVisible: true });
    };

    loadRoute = (id, afterLoadRoute) => {
      const {
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      increaseNumOfActiveRequestsProp();
      Axios.get(`${ApiUrl}/v1/routes/${id}`)
        .then((response) => {
          decreaseNumOfActiveRequestsProp();
          this.setState({
            currentShown: response.data.payload,
          });
          if (afterLoadRoute) {
            afterLoadRoute();
          }
        }).catch((error) => {
          decreaseNumOfActiveRequestsProp();
          this.displayError(error);
        });
    };

    closeRoutesModal = () => {
      const { history } = this.props;
      const { spotId, sectorId } = this.state;
      this.setState({
        routesModalVisible: false,
        comments: [],
        numOfComments: 0,
        numOfLikes: undefined,
        isLiked: false,
        likeId: 0,
        likeBtnIsBusy: false,
        ascent: null,
        numOfRedpoints: undefined,
        numOfFlash: undefined,
      });
      if (sectorId === 0) {
        this.reloadSpot();
        history.push(`/spots/${spotId}`);
      } else {
        this.reloadSector(sectorId);
        history.push(`/spots/${spotId}/sectors/${sectorId}`);
      }
      this.reloadUserAscents();
      this.reloadRoutes({}, null);
    };

    afterLogOut = () => {
      const { personal, sectorId } = this.state;
      this.setState({ ascents: [] });
      this.reloadRoutes();
      if (sectorId === 0) {
        this.reloadSpot(0);
      } else {
        this.reloadSector(sectorId, 0);
      }
      const resultFilters = [];
      const personalNew = {
        clickable: true,
        id: 'personal',
        selected: personal,
        text: `Авторские трассы ${personal ? ' ✓' : ''}`,
        value: 'personal',
      };
      this.setState({ filters: R.append(personalNew, resultFilters) });
    };

    reloadSpot = (userId) => {
      const {
        user,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      const { spotId } = this.state;
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
            { count: response.data.metadata.num_of_sectors, label: 'Залов' },
            { count: response.data.metadata.num_of_routes, label: 'Трасс' },
          ];
          if (currentUserId !== 0) {
            infoData = R.append({
              count: response.data.metadata.num_of_unfulfilled,
              label: 'Невыполненных трасс',
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
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
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
        params.user_id = currentUserId;
      }
      params.numOfDays = NumOfDays;
      increaseNumOfActiveRequestsProp();
      Axios.get(`${ApiUrl}/v1/sectors/${id}`, { params })
        .then((response) => {
          decreaseNumOfActiveRequestsProp();
          let infoData = [
            { count: response.data.metadata.num_of_routes, label: 'Трасс' },
            { count: response.data.metadata.num_of_new_routes, label: 'Новых трасс' },
          ];
          if (currentUserId !== 0) {
            infoData = R.append({
              count: response.data.metadata.num_of_unfulfilled,
              label: 'Невыполненных трасс',
            }, infoData);
          }
          this.setState({
            sector: response.data.payload,
            infoData,
          });
        }).catch((error) => {
          decreaseNumOfActiveRequestsProp();
          this.displayError(error);
        });
    };

    reloadSectors = (currentSectorId, user) => {
      const {
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
        loadSectors: loadSectorsProp,
        selectedFilters,
        setDefaultSelectedFilters: setDefaultSelectedFiltersProp,
        selectedPages,
        setDefaultSelectedPages: setDefaultSelectedPagesProp,
      } = this.props;
      const { spotId } = this.state;
      increaseNumOfActiveRequestsProp();
      Axios.get(`${ApiUrl}/v1/spots/${spotId}/sectors`)
        .then((response) => {
          decreaseNumOfActiveRequestsProp();
          loadSectorsProp(response.data.payload);
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

    reloadRoutes = (filters = {}, page = 1, userCurr) => {
      const {
        user,
        selectedFilters,
        selectedPages,
        token,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
        loadRoutes: loadRoutesProp,
      } = this.props;
      const {
        spotId, sectorId, name, perPage,
      } = this.state;
      const currentSectorId = parseInt(
        (
          (filters.sectorId === null || filters.sectorId === undefined)
            ? sectorId
            : filters.sectorId
        ),
        10,
      );
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
      const currentPage = (
        (page === null || page === undefined)
          ? selectedPages[spotId][currentSectorId]
          : page
      );
      const params = {
        filters: {
          category: [[currentCategoryFrom], [currentCategoryTo]],
          personal: currentPersonal,
        },
      };
      if (userCurr || avail(user.id)) {
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
      params.limit = perPage;
      params.offset = (currentPage - 1) * perPage;
      if (token) params.token = token;
      if (currentSectorId === 0) {
        increaseNumOfActiveRequestsProp();
        Axios.get(`${ApiUrl}/v1/spots/${spotId}/routes`, { params })
          .then((response) => {
            decreaseNumOfActiveRequestsProp();
            this.setState(
              { numOfPages: Math.max(1, Math.ceil(response.data.metadata.all / perPage)) },
            );
            loadRoutesProp(spotId, 0, response.data.payload);
            if (this.loadingRouteId) {
              const routeId = parseInt(this.loadingRouteId, 10);
              this.loadingRouteId = null;
              this.reloadComments(routeId);
              this.reloadLikes(routeId);
              this.reloadAscents(routeId);
              this.loadRoute(routeId, this.openModal);
              this.setState({ editMode: this.loadEditMode });
            }
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
              { numOfPages: Math.max(1, Math.ceil(response.data.metadata.all / perPage)) },
            );
            loadRoutesProp(spotId, currentSectorId, response.data.payload);
            if (this.loadingRouteId) {
              const routeId = parseInt(this.loadingRouteId, 10);
              this.loadingRouteId = null;
              this.reloadComments(routeId);
              this.reloadLikes(routeId);
              this.reloadAscents(routeId);
              this.loadRoute(routeId, this.openModal);
              this.setState({ editMode: this.loadEditMode });
            }
          }).catch((error) => {
            decreaseNumOfActiveRequestsProp();
            this.displayError(error);
          });
      }
    };

    changeSectorFilter = (id) => {
      const { history } = this.props;
      const { spotId } = this.state;
      if (id !== 0) {
        this.reloadSector(id);
        history.push(`/spots/${spotId}/sectors/${id}`);
        this.setState({ sectorId: id, infoData: undefined });
      } else {
        this.reloadSpot();
        history.push(`/spots/${spotId}`);
        this.setState({ sectorId: id, infoData: undefined });
      }
      this.reloadRoutes({ sectorId: id }, null);
    };

    changeCategoryFilter = (categoryFrom, categoryTo) => {
      const {
        setSelectedFilter: setSelectedFilterProp,
        setSelectedPage: setSelectedPageProp,
      } = this.props;
      const { spotId, sectorId } = this.state;
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
      const { spotId, sectorId } = this.state;
      setSelectedFilterProp(spotId, sectorId, 'period', period);
      setSelectedPageProp(spotId, sectorId, 1);
      this.reloadRoutes({ period, period });
    };

    changeResultFilter = (result) => {
      const {
        setSelectedFilter: setSelectedFilterProp,
        setSelectedPage: setSelectedPageProp,
      } = this.props;
      const { spotId, sectorId } = this.state;
      setSelectedFilterProp(spotId, sectorId, 'result', result);
      setSelectedPageProp(spotId, sectorId, 1);
      this.reloadRoutes({ result });
    };

    changePersonalFilter = (personal) => {
      const {
        setSelectedFilter: setSelectedFilterProp,
        setSelectedPage: setSelectedPageProp,
      } = this.props;
      const { spotId, sectorId } = this.state;
      setSelectedFilterProp(spotId, sectorId, 'personal', personal);
      setSelectedPageProp(spotId, sectorId, 1);
      this.reloadRoutes({ personal });
    };

    changeNameFilter = (searchString) => {
      this.setState({ name: searchString });
      this.reloadRoutes({ name: searchString });
    };

    changePage = (page) => {
      const {
        setSelectedPage: setSelectedPageProp,
      } = this.props;
      const { spotId, sectorId } = this.state;
      setSelectedPageProp(spotId, sectorId, page);
      this.reloadRoutes({}, page);
    };

    onFilterChange = (id) => {
      const {
        selectedFilters,
        setSelectedFilter: setSelectedFilterProp,
      } = this.props;
      const { spotId, sectorId } = this.state;
      const filters = R.clone(selectedFilters[spotId][sectorId].filters);
      const index = R.findIndex(e => e.id === id, filters);
      if (filters[index].selected) {
        filters[index].text = R.slice(0, -2, filters[index].text);
      } else {
        filters[index].text = `${filters[index].text} ✓`;
      }
      filters[index].selected = !filters[index].selected;
      if (id === 'personal') {
        this.changePersonalFilter(filters[index].selected);
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
      const { sectorId } = this.state;
      this.reloadRoutes();
      if (sectorId === 0) {
        this.reloadSpot(userId);
      } else {
        this.reloadSector(sectorId, userId);
      }
      this.reloadUserAscents(userId);
    };

    afterSubmitSignUpForm = (userId) => {
      const { sectorId } = this.state;
      this.reloadRoutes();
      if (sectorId === 0) {
        this.reloadSpot(userId);
      } else {
        this.reloadSector(sectorId, userId);
      }
      this.reloadUserAscents(userId);
    };

    removeRoute = () => {
      const {
        token,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      const { currentShown } = this.state;
      if (window.confirm('Удалить трассу?')) {
        increaseNumOfActiveRequestsProp();
        Axios({
          url: `${ApiUrl}/v1/routes/${currentShown.id}`,
          method: 'delete',
          headers: { TOKEN: token },
        })
          .then(() => {
            decreaseNumOfActiveRequestsProp();
            this.reloadRoutes();
            this.closeRoutesModal();
          }).catch((error) => {
            decreaseNumOfActiveRequestsProp();
            this.displayError(error);
          });
      }
      this.setState({ ctrlPressed: false });
    };

    addRoute = () => {
      const {
        user,
        token,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      const { sector, sectorId } = this.state;
      increaseNumOfActiveRequestsProp();
      Axios.get(`${ApiUrl}/v1/routes/new`, { headers: { TOKEN: token } })
        .then((response) => {
          decreaseNumOfActiveRequestsProp();
          const newRoute = R.clone(response.data.payload);
          newRoute.sector_id = sectorId;
          if (sector.kind !== 'mixed') {
            newRoute.kind = sector.kind;
          }
          this.loadUsers();
          if (user.role === 'user') newRoute.data.personal = true;
          this.setState({ currentShown: newRoute, routesModalVisible: true, editMode: true });
        }).catch((error) => {
          decreaseNumOfActiveRequestsProp();
          this.displayError(error);
        });
    };

    goToProfile = () => {
      const { history } = this.props;
      const { spotId, sectorId } = this.state;
      if (sectorId === 0) {
        history.push(`/spots/${spotId}#profile`);
      } else {
        history.push(`/spots/${spotId}/sectors/${sectorId}#profile`);
      }
      this.setState({ routesModalVisible: false, profileFormVisible: true });
    };

    openProfileForm = () => {
      const { history } = this.props;
      const { spotId, sectorId } = this.state;
      this.setState({ profileFormVisible: true });
      if (sectorId === 0) {
        history.push(`/spots/${spotId}#profile`);
      } else {
        history.push(`/spots/${spotId}/sectors/${sectorId}#profile`);
      }
    };

    closeProfileForm = () => {
      const { history } = this.props;
      const { spotId, sectorId } = this.state;
      this.setState({ profileFormVisible: false });
      if (sectorId === 0) {
        history.push(`/spots/${spotId}`);
      } else {
        history.push(`/spots/${spotId}/sectors/${sectorId}`);
      }
    };

    flatten = (arr) => {
      if (arr.length === 0) {
        return [];
      }
      return R.map(e => R.concat([e], this.flatten(e.route_comments)), arr);
    };

    formattedCommentsData = (data) => {
      const self = this;
      return R.map((comment) => {
        const c = R.clone(comment);
        c.route_comments = R.flatten(self.flatten(c.route_comments));
        return c;
      }, data);
    };

    reloadComments = (routeId) => {
      const {
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      increaseNumOfActiveRequestsProp();
      Axios.get(`${ApiUrl}/v1/routes/${routeId}/route_comments`)
        .then((response) => {
          decreaseNumOfActiveRequestsProp();
          this.setState({
            comments: this.formattedCommentsData(response.data.payload),
            numOfComments: response.data.metadata.all,
          });
        }).catch((error) => {
          decreaseNumOfActiveRequestsProp();
          this.displayError(error);
        });
    };

    removeComment = (comment) => {
      const {
        token,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      const { currentShown } = this.state;
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
          this.reloadComments(currentShown.id);
        }).catch((error) => {
          decreaseNumOfActiveRequestsProp();
          this.displayError(error);
        });
    };

    saveComment = (params, afterSuccess) => {
      const {
        token,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      const { currentShown } = this.state;
      increaseNumOfActiveRequestsProp();
      Axios.post(`${ApiUrl}/v1/route_comments`, params, { headers: { TOKEN: token } })
        .then(() => {
          decreaseNumOfActiveRequestsProp();
          this.reloadComments(currentShown.id);
          if (afterSuccess) {
            afterSuccess();
          }
        }).catch((error) => {
          decreaseNumOfActiveRequestsProp();
          this.displayError(error);
        });
    };

    reloadLikes = (routeId) => {
      const {
        user,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      increaseNumOfActiveRequestsProp();
      Axios.get(`${ApiUrl}/v1/routes/${routeId}/likes`)
        .then((response) => {
          decreaseNumOfActiveRequestsProp();
          const like = (
            notAvail(user.id)
              ? 0
              : (R.find(R.propEq('user_id', user.id))(response.data.payload))
          );
          const isLiked = notAvail(user.id) ? false : (like !== undefined);
          this.setState({
            numOfLikes: response.data.metadata.all,
            isLiked,
            likeBtnIsBusy: false,
            likeId: like === undefined ? 0 : like.id,
          });
        }).catch((error) => {
          decreaseNumOfActiveRequestsProp();
          this.setState({ likeBtnIsBusy: false });
          this.displayError(error);
        });
    };

    onLikeChange = () => {
      const {
        user,
        token,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      const { isLiked, likeId, currentShown } = this.state;
      increaseNumOfActiveRequestsProp();
      this.setState({ likeBtnIsBusy: true });
      if (isLiked) {
        Axios({
          url: `${ApiUrl}/v1/likes/${likeId}`,
          method: 'delete',
          headers: { TOKEN: token },
        })
          .then(() => {
            decreaseNumOfActiveRequestsProp();
            this.reloadLikes(currentShown.id);
          }).catch((error) => {
            decreaseNumOfActiveRequestsProp();
            this.displayError(error);
            this.setState({ likeBtnIsBusy: false });
          });
      } else {
        const params = { like: { user_id: user.id, route_id: currentShown.id } };
        Axios.post(`${ApiUrl}/v1/likes`, params, { headers: { TOKEN: token } })
          .then(() => {
            decreaseNumOfActiveRequestsProp();
            this.reloadLikes(currentShown.id);
          }).catch((error) => {
            decreaseNumOfActiveRequestsProp();
            this.displayError(error);
            this.setState({ likeBtnIsBusy: false });
          });
      }
    };

    reloadAscents = (routeId) => {
      const {
        user,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      increaseNumOfActiveRequestsProp();
      Axios.get(`${ApiUrl}/v1/routes/${routeId}/ascents`)
        .then((response) => {
          decreaseNumOfActiveRequestsProp();
          const ascent = (
            notAvail(user.id)
              ? null
              : (R.find(R.propEq('user_id', user.id))(response.data.payload))
          );
          this.setState({
            ascent: ascent === undefined ? null : ascent,
            numOfRedpoints: R.filter(
              R.propEq('result', 'red_point'),
              response.data.payload,
            ).length,
            numOfFlash: R.filter(
              R.propEq('result', 'flash'),
              response.data.payload,
            ).length,
          });
        }).catch((error) => {
          decreaseNumOfActiveRequestsProp();
          this.displayError(error);
        });
    };

    changeAscentResult = () => {
      const {
        user,
        token,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      const { ascent, currentShown } = this.state;
      increaseNumOfActiveRequestsProp();
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
          .then(() => {
            decreaseNumOfActiveRequestsProp();
            this.reloadAscents(currentShown.id);
          }).catch((error) => {
            decreaseNumOfActiveRequestsProp();
            this.displayError(error);
          });
      } else {
        const result = 'red_point';
        const params = { ascent: { result, user_id: user.id, route_id: currentShown.id } };
        Axios.post(`${ApiUrl}/v1/ascents`, params, { headers: { TOKEN: token } })
          .then(() => {
            decreaseNumOfActiveRequestsProp();
            this.reloadAscents(currentShown.id);
          }).catch((error) => {
            decreaseNumOfActiveRequestsProp();
            this.displayError(error);
          });
      }
    };

    loadUsers = () => {
      const {
        token,
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
          this.setState({ users });
        }).catch((error) => {
          decreaseNumOfActiveRequestsProp();
          this.displayError(error);
        });
    };

    createRoute = (params) => {
      const {
        token,
        history,
        addRoute: addRouteProp,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      const { spotId, sectorId } = this.state;
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
          history.push(
            `/spots/${spotId}/sectors/${sectorId}/routes/${response.data.payload.id}`,
          );
          this.setState({
            editRouteIsWaiting: false,
            editMode: false,
            currentShown: R.clone(response.data.payload),
          });
          addRouteProp(spotId, sectorId, response.data.payload);
          this.setState({
            comments: [],
            ascents: [],
            ascent: null,
            numOfComments: 0,
            numOfLikes: 0,
            isLiked: false,
            likeBtnIsBusy: false,
            likeId: 0,
            numOfRedpoints: 0,
            numOfFlash: 0,
          });
        }).catch((error) => {
          decreaseNumOfActiveRequestsProp();
          this.displayError(error);
          this.setState({ editRouteIsWaiting: false });
        });
    };

    updateRoute = (params) => {
      const {
        token,
        history,
        updateRoute: updateRouteProp,
        increaseNumOfActiveRequests: increaseNumOfActiveRequestsProp,
        decreaseNumOfActiveRequests: decreaseNumOfActiveRequestsProp,
      } = this.props;
      const { spotId, sectorId, currentShown } = this.state;
      increaseNumOfActiveRequestsProp();
      this.setState({ editRouteIsWaiting: true });
      Axios({
        url: `${ApiUrl}/v1/routes/${currentShown.id}`,
        method: 'patch',
        data: params,
        headers: { TOKEN: token },
        config: { headers: { 'Content-Type': 'multipart/form-data' } },
      })
        .then((response) => {
          decreaseNumOfActiveRequestsProp();
          if (sectorId === 0) {
            history.push(`/spots/${spotId}/routes/${currentShown.id}`);
          } else {
            history.push(`/spots/${spotId}/sectors/${sectorId}/routes/${currentShown.id}`);
          }
          this.setState(
            { editRouteIsWaiting: false, editMode: false, currentShown: response.data.payload },
          );
          updateRouteProp(spotId, sectorId, currentShown.id, response.data.payload);
        }).catch((error) => {
          decreaseNumOfActiveRequestsProp();
          this.displayError(error);
          this.setState({ editRouteIsWaiting: false });
        });
    };

    openEdit = () => {
      const { history } = this.props;
      const { spotId, sectorId, currentShown } = this.state;
      this.loadUsers();
      this.setState({ editMode: true });
      if (sectorId === 0) {
        history.push(`/spots/${spotId}/routes/${currentShown.id}/edit`);
      } else {
        history.push(`/spots/${spotId}/sectors/${sectorId}/routes/${currentShown.id}/edit`);
      }
    };

    cancelEdit = () => {
      const { history } = this.props;
      const { spotId, sectorId, currentShown } = this.state;
      if (currentShown.id === null) {
        this.setState({ routesModalVisible: false });
        if (sectorId === 0) {
          history.push(`/spots/${spotId}`);
        } else {
          history.push(`/spots/${spotId}/sectors/${sectorId}`);
        }
      } else {
        this.setState({ editMode: false });
        if (sectorId === 0) {
          history.push(`/spots/${spotId}/routes/${currentShown.id}`);
        } else {
          history.push(`/spots/${spotId}/sectors/${sectorId}/routes/${currentShown.id}`);
        }
      }
    };

    goToNew = () => {
      const { history } = this.props;
      const { spotId, sectorId } = this.state;
      history.push(`/spots/${spotId}/sectors/${sectorId}/routes/new`);
      this.addRoute();
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

    content = () => {
      const {
        selectedPages,
        selectedFilters,
        sectors,
        routeMarkColors,
        user,
        numOfActiveRequests,
        routes,
      } = this.props;
      const {
        spotId,
        sectorId,
        routesModalVisible,
        editMode,
        currentShown,
        spot,
        sector,
        users,
        editRouteIsWaiting,
        ctrlPressed,
        comments,
        numOfComments,
        numOfLikes,
        isLiked,
        likeBtnIsBusy,
        ascent,
        numOfRedpoints,
        numOfFlash,
        signUpFormVisible,
        signUpIsWaiting,
        signUpFormErrors,
        resetPasswordFormVisible,
        resetPasswordIsWaiting,
        resetPasswordFormErrors,
        email,
        logInFormVisible,
        logInIsWaiting,
        logInFormErrors,
        profileFormVisible,
        profileIsWaiting,
        profileFormErrors,
        infoData,
        ascents,
        numOfPages,
      } = this.state;
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
      let currentSector;
      if (sectorId === 0) {
        currentSector = R.find(
          currentSector => currentSector.id === currentShown.sector_id,
          sectors,
        );
      }
      let data;
      if (sectorId === 0) {
        data = spot;
      } else if (sector.id === sectorId) {
        data = sector;
      } else {
        data = {};
      }
      return (
        <>
          {
            routesModalVisible
              ? (
                editMode
                  ? (
                    <RoutesEditModal
                      onClose={this.closeRoutesModal}
                      sector={
                        sectorId === 0
                          ? currentSector
                          : sector
                      }
                      cancel={this.cancelEdit}
                      users={users}
                      routeMarkColors={routeMarkColors}
                      user={userStateToUser(user)}
                      numOfActiveRequests={numOfActiveRequests}
                      createRoute={this.createRoute}
                      updateRoute={this.updateRoute}
                      isWaiting={editRouteIsWaiting}
                      route={currentShown}
                    />
                  )
                  : (
                    <RoutesShowModal
                      onClose={this.closeRoutesModal}
                      openEdit={this.openEdit}
                      removeRoute={this.removeRoute}
                      ctrlPressed={ctrlPressed}
                      goToProfile={this.goToProfile}
                      comments={comments}
                      removeComment={this.removeComment}
                      saveComment={this.saveComment}
                      numOfComments={numOfComments}
                      numOfLikes={numOfLikes}
                      isLiked={isLiked}
                      likeBtnIsBusy={likeBtnIsBusy}
                      onLikeChange={this.onLikeChange}
                      user={userStateToUser(user)}
                      numOfActiveRequests={numOfActiveRequests}
                      ascent={ascent}
                      numOfRedpoints={numOfRedpoints}
                      numOfFlash={numOfFlash}
                      changeAscentResult={this.changeAscentResult}
                      route={currentShown}
                    />
                  )
              )
              : ''
          }
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
            resetPasswordFormVisible
              ? (
                <ResetPasswordForm
                  onFormSubmit={this.submitResetPasswordForm}
                  closeForm={this.closeResetPasswordForm}
                  isWaiting={resetPasswordIsWaiting}
                  formErrors={resetPasswordFormErrors}
                  email={email}
                  resetErrors={this.resetPasswordResetErrors}
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
            sectors={sectors}
            sectorId={sectorId}
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
            routes={R.pathOr([], [spotId, sectorId], routes)}
            ascents={ascents}
            user={userStateToUser(user)}
            ctrlPressed={ctrlPressed}
            addRoute={this.goToNew}
            sectorId={sectorId}
            page={
              (selectedPages && selectedPages[spotId])
                ? selectedPages[spotId][sectorId]
                : 1
            }
            numOfPages={numOfPages}
            period={period}
            filters={avail(user.id) ? filters : defaultFilters}
            categoryId={categoryId}
            onRouteClick={this.onRouteClick}
            onCategoryChange={this.onCategoryChange}
            changePeriodFilter={this.changePeriodFilter}
            onFilterChange={this.onFilterChange}
            changePage={this.changePage}
          />
        </>
      );
    };

    render() {
      const { user, numOfActiveRequests } = this.props;
      const {
        routesModalVisible,
        signUpFormVisible,
        logInFormVisible,
        profileFormVisible,
      } = this.state;
      const showModal = signUpFormVisible || logInFormVisible || profileFormVisible;
      return (
        <div className={routesModalVisible || showModal ? null : 'page__scroll'}>
          <StickyBar loading={numOfActiveRequests > 0} content={this.content()} />
          <Footer
            user={userStateToUser(user)}
            logIn={this.logIn}
            signUp={this.signUp}
            logOut={this.logOut}
          />
        </div>
      );
    }
}

const mapStateToProps = state => ({
  selectedPages: state.selectedPages,
  selectedFilters: state.selectedFilters,
  routes: state.routes,
  sectors: state.sectors,
  user: state.user,
  token: state.token,
  numOfActiveRequests: state.numOfActiveRequests,
  routeMarkColors: state.routeMarkColors,
});

const mapDispatchToProps = dispatch => ({
  loadRoutes: (spotId, sectorId, routes) => dispatch(loadRoutes(spotId, sectorId, routes)),
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
  loadSectors: sectors => dispatch(loadSectors(sectors)),
  loadRouteMarkColors: routeMarkColors => dispatch(loadRouteMarkColors(routeMarkColors)),
  saveUser: user => dispatch(saveUser(user)),
  saveToken: token => dispatch(saveToken(token)),
  removeToken: () => dispatch(removeToken()),
  updateRoute: (spotId, sectorId, id, route) => (
    dispatch(updateRoute(spotId, sectorId, id, route))
  ),
  addRoute: (spotId, sectorId, route) => dispatch(addRoute(spotId, sectorId, route)),
  increaseNumOfActiveRequests: () => dispatch(increaseNumOfActiveRequests()),
  decreaseNumOfActiveRequests: () => dispatch(decreaseNumOfActiveRequests()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsShow));
