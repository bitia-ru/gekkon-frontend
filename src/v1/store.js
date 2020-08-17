import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import localForage from 'localforage';
import rootReducer from './reducers';
import USERS_DEFAULT_STORE_FORMAT from './stores/users/constants/defaultStoreFormat';
import SPOTS_DEFAULT_STORE_FORMAT from './stores/spots/constants/defaultStoreFormat';
import SECTORS_DEFAULT_STORE_FORMAT from './stores/sectors/constants/defaultStoreFormat';
import ROUTES_DEFAULT_STORE_FORMAT from './stores/routes/constants/defaultStoreFormat';
import ROUTE_MARK_COLORS_DEFAULT_STORE_FORMAT from './stores/route_mark_colors/constants/defaultStoreFormat';
import NEWS_DEFAULT_STORE_FORMAT from './stores/news/constants/defaultStoreFormat';

export const saveState = (state) => {
  try {
    const data = {};
    data.selectedViewModes = state.selectedViewModes;
    data.selectedFilters = state.selectedFilters;

    data.routes = state.routesStoreV2.routes;
    data.filtrationResults = state.routesStoreV2.filtrationResults;

    data.spots = state.spotsStore.spots;

    data.sectors = state.sectorsStore.sectors;

    data.users = state.usersStore.users;
    data.sortedUserIds = state.usersStore.sortedUserIds;

    data.routeMarkColors = state.routeMarkColorsStore.routeMarkColors;
    data.news = state.newsStore.news;
    localForage.setItem('reduxState', data);
  } catch (err) {
    console.log('Error saving redux state', err);
  }
};

const getDataFromLocalForagePromise = () => (
  new Promise((resolve) => {
    localForage.getItem('reduxState', (err, data) => {
      if (err) {
        resolve(undefined);
      } else {
        const state = {};

        try {
          state.selectedViewModes = data.selectedViewModes;
          state.selectedFilters = data.selectedFilters;

          state.newsStore = NEWS_DEFAULT_STORE_FORMAT;
          state.newsStore.news = data.news;

          state.routeMarkColorsStore = ROUTE_MARK_COLORS_DEFAULT_STORE_FORMAT;
          state.routeMarkColorsStore.routeMarkColors = data.routeMarkColors;

          state.routesStoreV2 = ROUTES_DEFAULT_STORE_FORMAT;
          state.routesStoreV2.routes = data.routes;
          state.routesStoreV2.filtrationResults = data.filtrationResults;

          state.spotsStore = SPOTS_DEFAULT_STORE_FORMAT;
          state.spotsStore.spots = data.spots;

          state.sectorsStore = SECTORS_DEFAULT_STORE_FORMAT;
          state.sectorsStore.sectors = data.sectors;

          state.usersStore = USERS_DEFAULT_STORE_FORMAT;
          state.usersStore.users = data.users;
          state.usersStore.sortedUserIds = data.sortedUserIds;
          resolve(state);
        } catch (_err) {
          resolve(undefined);
        }
      }
    });
  })
);

async function getDataFromLocalForage() {
  const state = await getDataFromLocalForagePromise();
  return state;
}

export const configureStoreAsync = () => (
  new Promise((resolve) => {
    try {
      getDataFromLocalForage().then((state) => {
        const store = createStore(rootReducer, state, applyMiddleware(thunk));
        resolve(store);
      });
    } catch (error) {
      const store = createStore(rootReducer, undefined, applyMiddleware(thunk));
      resolve(store);
    }
  })
);
