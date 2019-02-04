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

export default combineReducers({
    routes: routesReducer,
    sectors: sectorsReducer
});
