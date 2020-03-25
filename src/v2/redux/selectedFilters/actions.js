export const acts = {
  SET_DEFAULT_SELECTED_FILTERS: 'SET_DEFAULT_SELECTED_FILTERS',
  SET_ALL_SELECTED_FILTERS: 'SET_ALL_SELECTED_FILTERS',
};

export const setDefaultSelectedFilters = (spotId, sectorIds) => ({
  type: acts.SET_DEFAULT_SELECTED_FILTERS,
  spotId,
  sectorIds,
});

export const setAllSelectedFilters = (spotId, sectorId, filters) => ({
  type: acts.SET_ALL_SELECTED_FILTERS,
  spotId,
  sectorId,
  filters,
});
