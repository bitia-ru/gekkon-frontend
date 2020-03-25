import * as R from 'ramda';
import { acts } from './actions';
import { DEFAULT_FILTERS } from '@/v1/Constants/DefaultFilters';

const selectedFiltersReducer = (
  state = {},
  action,
) => {
  let selectedFilters;
  switch (action.type) {
  case acts.SET_DEFAULT_SELECTED_FILTERS:
    selectedFilters = state === null ? {} : R.clone(state);
    const defaultFilters = R.merge(DEFAULT_FILTERS, { wasChanged: false });
    const sectorsDefaultFilters = R.map(
      sectorId => [sectorId, R.clone(defaultFilters)],
      action.sectorIds,
    );
    const spotFilters = R.merge(
      { 0: R.clone(defaultFilters) },
      R.fromPairs(sectorsDefaultFilters),
    );
    selectedFilters[action.spotId] = spotFilters;
    return R.clone(selectedFilters);
  case acts.SET_ALL_SELECTED_FILTERS:
    const newFilters = R.mergeDeepLeft(
      action.filters[action.sectorId],
      state[action.spotId][action.sectorId],
    );
    return {
      ...state,
      [action.spotId]: {
        ...state[action.spotId],
        [action.sectorId]: { ...newFilters },
      },
    };
  default:
    return state;
  }
};

export default selectedFiltersReducer;
