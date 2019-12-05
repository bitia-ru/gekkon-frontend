import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import moment from 'moment/moment';
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
import BaseComponent from '../BaseComponent';
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
import { BACKEND_DATE_FORMAT } from '../Constants/Date';
import SpotContext from '../contexts/SpotContext';
import SectorContext from '../contexts/SectorContext';
import getArrayFromObject from '../../v1/utils/getArrayFromObject';
import { NUM_OF_DAYS } from '../Constants/Route';
import { loadSector } from '../../v1/stores/sectors/utils';
import { loadSpot } from '../../v1/stores/spots/utils';
import { signIn } from '../../v1/stores/users/utils';
import { logOutUser, loadToken } from '../../v1/stores/users/actions';
import {
  loadRoutes,
  removeLike,
  addLike,
  addAscent,
  updateAscent,
  addComment,
  removeComment,
  addRoute,
  updateRoute,
  removeRoute,
} from '../../v1/stores/routes/utils';
import getState from '../../v1/utils/getState';

class SpotsShow extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      name: '',
      numOfPages: 1,
      ctrlPressed: false,
      editRouteIsWaiting: false,
    });
  }

  componentDidMount() {
    const {
      history,
      signIn: signInProp,
      loadToken: loadTokenProp,
      logOutUser: logOutUserProp,
      loadFromLocalStorageSelectedFilters: loadFromLocalStorageSelectedFiltersProp,
    } = this.props;
    history.listen((location, action) => {
      if (action === 'POP') {
        this.setState({ profileFormVisible: (location.hash === '#profile') });
      }
    });

    const sectorId = this.getSectorId();
    if (Cookies.get('user_session_token') !== undefined) {
      const token = Cookies.get('user_session_token');
      loadTokenProp(token);
      signInProp(token, (currentUser) => {
        this.reloadSpot(currentUser.id);
        if (sectorId !== 0) {
          this.reloadSector(sectorId, currentUser.id);
        }
        this.reloadRoutes();
      });
    } else {
      this.reloadSpot();
      if (sectorId !== 0) {
        this.reloadSector(sectorId);
      }
      this.reloadRoutes();
      logOutUserProp();
    }
    loadFromLocalStorageSelectedFiltersProp();
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
        loadSpot: loadSpotProp,
      } = this.props;
      const spotId = this.getSpotId();
      const sectorId = this.getSectorId();
      let currentUserId;
      if (userId === null || userId === undefined) {
        if (notAvail(user)) {
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
      loadSpotProp(`${ApiUrl}/v1/spots/${spotId}`, params, sectorId);
    };

    reloadSector = (id, userId) => {
      const {
        user,
        loadSector: loadSectorProp,
      } = this.props;
      let currentUserId;
      if (userId === null || userId === undefined) {
        if (notAvail(user)) {
          currentUserId = 0;
        } else {
          currentUserId = user.id;
        }
      } else {
        currentUserId = userId;
      }
      const params = {};
      if (currentUserId) {
        params.user_id = currentUserId;
      }
      params.numOfDays = NUM_OF_DAYS;
      loadSectorProp(`${ApiUrl}/v1/sectors/${id}`, params);
    };

    reloadRoutes = (filters = {}, page = 1, userCurrId, viewModeCurr) => {
      const {
        sectors,
        user,
        selectedViewModes,
        selectedFilters,
        selectedPages,
        token,
        loadRoutes: loadRoutesProp,
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
      if ((userCurrId) || (user && avail(user))) {
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
        loadRoutesProp(`${ApiUrl}/v1/spots/${spotId}/routes`, params);
      } else {
        loadRoutesProp(`${ApiUrl}/v1/sectors/${currentSectorId}/routes`, params);
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
      this.reloadRoutes(
        { sectorId: id },
        null,
        user ? user.id : user,
      );
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
    };

    afterSubmitSignUpForm = (userId) => {
      const sectorId = this.getSectorId();
      this.reloadRoutes();
      if (sectorId === 0) {
        this.reloadSpot(userId);
      } else {
        this.reloadSector(sectorId, userId);
      }
    };

    removeRoute = (routeId) => {
      const { removeRoute: removeRouteProp } = this.props;
      if (window.confirm('Удалить трассу?')) {
        removeRouteProp(
          `${ApiUrl}/v1/routes/${routeId}`,
          () => {
            this.reloadRoutes();
            this.closeRoutesModal();
          },
        );
      }
      this.setState({ ctrlPressed: false });
    };

    removeComment = (routeId, comment) => {
      const { removeComment: removeCommentProp } = this.props;
      if (!window.confirm('Удалить комментарий?')) {
        return;
      }
      removeCommentProp(`${ApiUrl}/v1/route_comments/${comment.id}`);
    };

    saveComment = (routeId, params, afterSuccess) => {
      const { addComment: addCommentProp } = this.props;
      addCommentProp(params, afterSuccess);
    };

    onLikeChange = (routeId, afterChange) => {
      const {
        user,
        routes,
        removeLike: removeLikeProp,
        addLike: addLikeProp,
      } = this.props;
      const route = routes[routeId];
      const like = R.find(R.propEq('user_id', user.id))(getArrayFromObject(route.likes));
      if (like) {
        removeLikeProp(`${ApiUrl}/v1/likes/${like.id}`, afterChange);
      } else {
        const params = { like: { user_id: user.id, route_id: routeId } };
        addLikeProp(params, afterChange);
      }
    };

    changeAscentResult = (routeId) => {
      const {
        user,
        routes,
        addAscent: addAscentProp,
        updateAscent: updateAscentProp,
      } = this.props;
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
        updateAscentProp(`${ApiUrl}/v1/ascents/${ascent.id}`, params);
      } else {
        const result = 'red_point';
        const params = { ascent: { result, user_id: user.id, route_id: routeId } };
        addAscentProp(params);
      }
    };

    createRoute = (params) => {
      const {
        history,
        match,
        addRoute: addRouteProp,
      } = this.props;
      this.setState({ editRouteIsWaiting: true });
      addRouteProp(
        params,
        response => history.push(
          `${match.url}/${response.data.payload.id}`,
        ),
        () => this.setState({ editRouteIsWaiting: false }),
      );
    };

    updateRoute = (routeId, params) => {
      const {
        history,
        match,
        updateRoute: updateRouteProp,
      } = this.props;
      this.setState({ editRouteIsWaiting: true });
      updateRouteProp(
        `${ApiUrl}/v1/routes/${routeId}`,
        params,
        () => history.push(`${match.url}/${routeId}`),
        () => this.setState({ editRouteIsWaiting: false }),
      );
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
      this.reloadRoutes({ date }, null, user.id, viewMode);
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
        spots,
        user,
      } = this.props;
      const {
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
        numOfPages,
      } = this.state;
      const spotId = this.getSpotId();
      const sectorId = this.getSectorId();
      const spot = spots[spotId];
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
        if (spot) {
          data = spot;
        } else {
          data = {};
        }
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
            (avail(user) && profileFormVisible) && (
              <Profile
                user={user}
                onFormSubmit={this.submitProfileForm}
                removeVk={this.removeVk}
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
            changeSectorFilter={this.changeSectorFilter}
            changeNameFilter={this.changeNameFilter}
            user={user}
            openProfile={this.openProfileForm}
            signUp={this.signUp}
            logIn={this.logIn}
            logOut={this.logOut}
          />
          <Content
            user={user}
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
            filters={avail(user) ? filters : defaultFilters}
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
        spots,
        loading,
      } = this.props;
      const {
        signUpFormVisible,
        logInFormVisible,
        profileFormVisible,
        ctrlPressed,
        editRouteIsWaiting,
      } = this.state;
      const showModal = signUpFormVisible || logInFormVisible || profileFormVisible;
      const spotId = this.getSpotId();
      const spot = spots[spotId];
      const sectorId = this.getSectorId();
      const sector = sectorId !== 0 ? sectors[sectorId] : undefined;
      return (
        <SpotContext.Provider value={{ spot }}>
          <SectorContext.Provider value={{ sector }}>
            <div className={showModal ? null : 'page__scroll'}>
              <Switch>
                <Route
                  path={[`${match.path}/:route_id/edit`, `${match.path}/new`]}
                  render={() => (
                    <RoutesEditModal
                      onClose={this.closeRoutesModal}
                      cancel={this.cancelEdit}
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
                      onClose={this.closeRoutesModal}
                      openEdit={this.openEdit}
                      removeRoute={this.removeRoute}
                      ctrlPressed={ctrlPressed}
                      goToProfile={this.openProfileForm}
                      removeComment={this.removeComment}
                      saveComment={this.saveComment}
                      onLikeChange={this.onLikeChange}
                      changeAscentResult={this.changeAscentResult}
                      submitNoticeForm={this.submitNoticeForm}
                    />
                  )}
                />
              </Switch>
              <StickyBar loading={loading}>
                {this.content()}
              </StickyBar>
              <Footer
                user={user}
                logIn={this.logIn}
                signUp={this.signUp}
                logOut={this.logOut}
              />
            </div>
          </SectorContext.Provider>
        </SpotContext.Provider>
      );
    }
}

const mapStateToProps = state => ({
  routes: state.routesStore.routes,
  selectedViewModes: state.selectedViewModes,
  selectedPages: state.selectedPages,
  selectedFilters: state.selectedFilters,
  spots: state.spotsStore.spots,
  sectors: state.sectorsStore.sectors,
  user: state.usersStore.users[state.usersStore.currentUserId],
  token: state.usersStore.currentUserToken,
  loading: getState(state),
});

const mapDispatchToProps = dispatch => ({
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
  loadToken: token => dispatch(loadToken(token)),
  signIn: (token, afterSignIn) => dispatch(signIn(token, afterSignIn)),
  logOutUser: () => dispatch(logOutUser()),
  loadSector: (url, params) => dispatch(loadSector(url, params)),
  loadSpot: (url, params, currentSectorId, afterLoad) => dispatch(
    loadSpot(url, params, currentSectorId, afterLoad),
  ),
  loadRoutes: (url, params) => dispatch(loadRoutes(url, params)),
  removeLike: (url, afterAll) => dispatch(removeLike(url, afterAll)),
  addLike: (params, afterAll) => dispatch(addLike(params, afterAll)),
  addAscent: params => dispatch(addAscent(params)),
  updateAscent: (url, params) => dispatch(updateAscent(url, params)),
  addComment: (params, afterSuccess) => dispatch(addComment(params, afterSuccess)),
  removeComment: url => dispatch(removeComment(url)),
  addRoute: (params, afterSuccess, afterAll) => dispatch(addRoute(params, afterSuccess, afterAll)),
  removeRoute: (url, afterSuccess) => dispatch(removeRoute(url, afterSuccess)),
  updateRoute: (url, params, afterSuccess, afterAll) => dispatch(
    updateRoute(url, params, afterSuccess, afterAll),
  ),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsShow));
