import {combineReducers} from 'redux';
import * as acts         from './Constants/Actions';
import {DEFAULT_FILTERS} from './Constants/DefaultFilters';
import * as R            from 'ramda';

const routesReducer = (state = {}, action) => {
    switch (action.type) {
        case acts.LOAD_ROUTES:
            let routes = R.clone(state);
            routes[action.spotId] = routes[action.spotId] || {};
            routes[action.spotId][action.sectorId] = action.routes;
            return routes;
        case acts.ADD_ROUTE:
            routes = R.clone(state);
            routes[action.spotId] = routes[action.spotId] || {};
            routes[action.spotId][action.sectorId] = R.append(
                action.route,
                routes[action.spotId][action.sectorId],
            );
            return routes;
        case acts.UPDATE_ROUTE:
            routes = R.clone(state);
            let index = R.findIndex(
                R.propEq('id', action.id),
            )(routes[action.spotId][action.sectorId]);
            routes[action.spotId][action.sectorId][index] = action.route;
            return routes;
        default:
            return state;
    }
};

const sectorsReducer = (state = [], action) => {
    switch (action.type) {
        case acts.LOAD_SECTORS:
            return action.sectors;
        default:
            return state;
    }
};

const userReducer = (state = null, action) => {
    switch (action.type) {
        case acts.SAVE_USER:
            return action.user;
        default:
            return state;
    }
};

const tabReducer = (state = 1, action) => {
    switch (action.type) {
        case acts.CHANGE_TAB:
            return action.tab;
        default:
            return state;
    }
};

const tokenReducer = (state = null, action) => {
    switch (action.type) {
        case acts.SAVE_TOKEN:
            return action.token;
        case acts.REMOVE_TOKEN:
            return null;
        default:
            return state;
    }
};

const numOfActiveRequestsReducer = (state = 0, action) => {
    switch (action.type) {
        case acts.INC_NUM_OF_ACTIVE_REQUESTS:
            return state + 1;
        case acts.DEC_NUM_OF_ACTIVE_REQUESTS:
            return state - 1;
        default:
            return state;
    }
};

const selectedPagesReducer = (state = {}, action) => {
    let selectedPages;
    switch (action.type) {
        case acts.SET_DEFAULT_SELECTED_PAGES:
            selectedPages = R.clone(state);
            let sectorsDefaultPages = R.map((sectorId) => [sectorId, 1], action.sectorIds);
            selectedPages[action.spotId] = R.merge({0: 1}, R.fromPairs(sectorsDefaultPages));
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
            let defaultFilters = R.merge(DEFAULT_FILTERS, {'wasChanged': false});
            let sectorsDefaultFilters = R.map(
                (sectorId) => [sectorId, R.clone(defaultFilters)],
                action.sectorIds,
            );
            let spotFilters = R.merge(
                {0: R.clone(defaultFilters)},
                R.fromPairs(sectorsDefaultFilters),
            );
            selectedFilters[action.spotId] = spotFilters;
            localStorage.setItem('routeFilters', JSON.stringify(selectedFilters));
            return R.clone(selectedFilters);
        case acts.SET_SELECTED_FILTER:
            selectedFilters = R.clone(state);
            if (action.sectorId === 0) {
                let spotSelectedFilters = R.clone(selectedFilters[action.spotId]);
                selectedFilters[action.spotId] = R.map((filters) => {
                    if (!filters.wasChanged) {
                        filters[action.filterName] = action.filterValue
                    }
                    return filters
                }, spotSelectedFilters)
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

const routeMarkColorsReducer = (state = [], action) => {
    switch (action.type) {
        case acts.LOAD_ROUTE_MARK_COLORS:
            return action.routeMarkColors;
        default:
            return state;
    }
};

export default combineReducers({
    routes: routesReducer,
    sectors: sectorsReducer,
    user: userReducer,
    tab: tabReducer,
    token: tokenReducer,
    numOfActiveRequests: numOfActiveRequestsReducer,
    selectedPages: selectedPagesReducer,
    selectedFilters: selectedFiltersReducer,
    routeMarkColors: routeMarkColorsReducer
});
