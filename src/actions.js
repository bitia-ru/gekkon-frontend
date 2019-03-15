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
