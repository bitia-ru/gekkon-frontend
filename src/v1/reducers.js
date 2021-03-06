import { combineReducers } from 'redux';
import * as R from 'ramda';
import * as acts from './Constants/Actions';
import routeMarkColorsStoreReducer from './stores/route_mark_colors/reducers';
import usersStoreReducer from './stores/users/reducers';
import sectorsStoreReducer from './stores/sectors/reducers';
import spotsStoreReducer from './stores/spots/reducers';
import newsStoreReducer from './stores/news/reducers';
import { default as usersReducerV2 } from '@/v2/redux/users/reducer';
import { default as userSessionReducerV2 } from '@/v2/redux/user_session/reducer';
import { default as wallPhotosReducerV2 } from '@/v2/redux/wall_photos/reducer';
import { default as spotsReducerV2 } from '@/v2/redux/spots/reducer';
import { default as routesReducerV2 } from '@/v2/redux/routes/reducer';
import { default as selectedFiltersReducerV2 } from '@/v2/redux/selectedFilters/reducer';
import initializedAtReducer from '@/v2/redux/initizalizedAt/reducer';


const tabReducer = (state = 1, action) => {
  switch (action.type) {
  case acts.CHANGE_TAB:
    return action.tab;
  default:
    return state;
  }
};

const selectedPagesReducer = (state = {}, action) => {
  switch (action.type) {
  case acts.SET_DEFAULT_SELECTED_PAGES: {
    const sectorsDefaultPages = R.map(sectorId => [sectorId, 1], action.sectorIds);
    return {
      ...state,
      [action.spotId]: {
        0: 1,
        ...R.fromPairs(sectorsDefaultPages),
      },
    };
  }
  case acts.SET_SELECTED_PAGE:
    return {
      ...state,
      [action.spotId]: {
        ...state[action.spotId],
        [action.sectorId]: action.page,
      },
    };
  default:
    return state;
  }
};

const selectedViewModesReducer = (state = {}, action) => {
  switch (action.type) {
  case acts.SET_SELECTED_VIEW_MODE:
    return {
      ...state,
      [action.spotId]: {
        ...state[action.spotId],
        [action.sectorId]: action.viewMode,
      },
    };
  default:
    return state;
  }
};

export default combineReducers({
  tab: tabReducer,
  selectedPages: selectedPagesReducer,
  selectedFilters: selectedFiltersReducerV2,
  selectedViewModes: selectedViewModesReducer,
  routeMarkColorsStore: routeMarkColorsStoreReducer,
  usersStore: usersStoreReducer,
  spotsStore: spotsStoreReducer,
  sectorsStore: sectorsStoreReducer,
  newsStore: newsStoreReducer,
  usersStoreV2: usersReducerV2,
  userSessionV2: userSessionReducerV2,
  wallPhotosV2: wallPhotosReducerV2,
  spotsStoreV2: spotsReducerV2,
  routesStoreV2: routesReducerV2,
  initializedAt: initializedAtReducer,
});
