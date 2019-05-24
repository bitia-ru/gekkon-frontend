import {combineReducers} from 'redux';
import * as acts         from './Constants/Actions';
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
            routes[action.spotId][action.sectorId] = R.append(action.route, routes[action.spotId][action.sectorId]);
            return routes;
        case acts.UPDATE_ROUTE:
            routes = R.clone(state);
            let index = R.findIndex(R.propEq('id', action.id))(routes[action.spotId][action.sectorId]);
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

export default combineReducers({
    routes: routesReducer,
    sectors: sectorsReducer,
    user: userReducer,
    tab: tabReducer,
    token: tokenReducer,
    numOfActiveRequests: numOfActiveRequestsReducer
});
