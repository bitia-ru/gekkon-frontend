import * as acts from './Constants/Actions';

export const loadRoutes = (routes) => ({
    type: acts.LOAD_ROUTES,
    routes
});

export const updateRoute = (id, route) => ({
    type: acts.UPDATE_ROUTE,
    id,
    route
});

export const addRoute = (route) => ({
    type: acts.ADD_ROUTE,
    route
});

export const loadSectors = (sectors) => ({
    type: acts.LOAD_SECTORS,
    sectors
});

export const saveUser = (user) => ({
    type: acts.SAVE_USER,
    user
});

export const changeTab = (tab) => ({
    type: acts.CHANGE_TAB,
    tab
});

export const saveToken = (token) => ({
    type: acts.SAVE_TOKEN,
    token
});

export const removeToken = () => ({
    type: acts.REMOVE_TOKEN
});

export const increaseNumOfActiveRequests = () => ({
    type: acts.INC_NUM_OF_ACTIVE_REQUESTS
});

export const decreaseNumOfActiveRequests = () => ({
    type: acts.DEC_NUM_OF_ACTIVE_REQUESTS
});
