import {combineReducers} from 'redux';
import * as acts         from './Constants/Actions';

const routesReducer = (state = [], action) => {
    switch (action.type) {
        case acts.LOAD_ROUTES:
            return action.routes;
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

export default combineReducers({
    routes: routesReducer,
    sectors: sectorsReducer,
    user: userReducer,
    tab: tabReducer
});
