import { combineReducers } from 'redux';
import * as R from 'ramda';
import * as acts from './Constants/Actions';
import { DEFAULT_FILTERS } from './Constants/DefaultFilters';
import routeMarkColorsStoreReducer from '../v1/stores/route_mark_colors/reducers';
import usersStoreReducer from '../v1/stores/users/reducers';
import routesStoreReducer from '../v1/stores/routes/reducers';
import sectorsStoreReducer from '../v1/stores/sectors/reducers';
import spotsStoreReducer from '../v1/stores/spots/reducers';

const tabReducer = (state = 1, action) => {
  switch (action.type) {
  case acts.CHANGE_TAB:
    return action.tab;
  default:
    return state;
  }
};

const selectedPagesReducer = (state = {}, action) => {
  let selectedPages;
  switch (action.type) {
  case acts.SET_DEFAULT_SELECTED_PAGES:
    selectedPages = R.clone(state);
    const sectorsDefaultPages = R.map(sectorId => [sectorId, 1], action.sectorIds);
    selectedPages[action.spotId] = R.merge({ 0: 1 }, R.fromPairs(sectorsDefaultPages));
    return selectedPages;
  case acts.SET_SELECTED_PAGE:
    selectedPages = R.clone(state);
    selectedPages[action.spotId][action.sectorId] = action.page;
    return selectedPages;
  default:
    return state;
  }
};

const selectedFiltersReducer = (state = {}, action) => {
  let selectedFilters;
  switch (action.type) {
  case acts.SET_DEFAULT_SELECTED_FILTERS:
    selectedFilters = state === null ? {} : R.clone(state);
    const defaultFilters = R.merge(DEFAULT_FILTERS, { wasChanged: false });
    const sectorsDefaultFilters = R.map(
      sectorId => [sectorId, R.clone(defaultFilters)],
      action.sectorIds,
    );
    const spotFilters = R.merge(
      { 0: R.clone(defaultFilters) },
      R.fromPairs(sectorsDefaultFilters),
    );
    selectedFilters[action.spotId] = spotFilters;
    localStorage.setItem('routeFilters', JSON.stringify(selectedFilters));
    return R.clone(selectedFilters);
  case acts.SET_SELECTED_FILTER:
    selectedFilters = R.clone(state);
    if (action.sectorId === 0) {
      const spotSelectedFilters = R.clone(selectedFilters[action.spotId]);
      selectedFilters[action.spotId] = R.map((filters) => {
        const filtersCopy = R.clone(filters);
        if (!filtersCopy.wasChanged) {
          filtersCopy[action.filterName] = action.filterValue;
        }
        return filtersCopy;
      }, spotSelectedFilters);
    } else {
      selectedFilters[action.spotId][action.sectorId][action.filterName] = action.filterValue;
      selectedFilters[action.spotId][action.sectorId].wasChanged = true;
    }
    localStorage.setItem('routeFilters', JSON.stringify(selectedFilters));
    return R.clone(selectedFilters);
  case acts.LOAD_FROM_LOCAL_STORAGE_SELECTED_FILTERS:
    let routeFilters = localStorage.getItem('routeFilters');
    if (routeFilters === undefined) {
      routeFilters = {};
    } else {
      routeFilters = JSON.parse(routeFilters);
    }
    return routeFilters;
  default:
    return state;
  }
};

const selectedViewModesReducer = (state = {}, action) => {
  let selectedViewModes;
  switch (action.type) {
  case acts.SET_SELECTED_VIEW_MODE:
    selectedViewModes = R.clone(state);
    selectedViewModes[action.spotId] = selectedViewModes[action.spotId] || {};
    selectedViewModes[action.spotId][action.sectorId] = action.viewMode;
    localStorage.setItem('viewModes', JSON.stringify(selectedViewModes));
    return selectedViewModes;
  default:
    if (R.equals(state, {})) {
      selectedViewModes = localStorage.getItem('viewModes');
      selectedViewModes = selectedViewModes ? JSON.parse(selectedViewModes) : {};
    } else {
      selectedViewModes = R.clone(state);
    }
    return selectedViewModes;
  }
};

export default combineReducers({
  tab: tabReducer,
  selectedPages: selectedPagesReducer,
  selectedFilters: selectedFiltersReducer,
  selectedViewModes: selectedViewModesReducer,
  routeMarkColorsStore: routeMarkColorsStoreReducer,
  usersStore: usersStoreReducer,
  spotsStore: spotsStoreReducer,
  sectorsStore: sectorsStoreReducer,
  routesStore: routesStoreReducer,
});
