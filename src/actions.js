import * as acts from './Constants/Actions';

export const loadRoutes = (routes) => ({
    type: acts.LOAD_ROUTES,
    routes
});

export const loadSectors = (sectors) => ({
    type: acts.LOAD_SECTORS,
    sectors
});
