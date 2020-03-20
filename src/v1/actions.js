import * as acts from './Constants/Actions';

export const changeTab = tab => ({
  type: acts.CHANGE_TAB,
  tab,
});

export const setSelectedPage = (spotId, sectorId, page) => ({
  type: acts.SET_SELECTED_PAGE,
  spotId,
  sectorId,
  page,
});

export const setDefaultSelectedPages = (spotId, sectorIds) => ({
  type: acts.SET_DEFAULT_SELECTED_PAGES,
  spotId,
  sectorIds,
});

export const setSelectedViewMode = (spotId, sectorId, viewMode) => ({
  type: acts.SET_SELECTED_VIEW_MODE,
  spotId,
  sectorId,
  viewMode,
});
