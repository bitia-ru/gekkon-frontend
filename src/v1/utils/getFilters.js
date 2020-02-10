import * as R from 'ramda';
import store from '../store';
import { DEFAULT_FILTERS } from '../Constants/DefaultFilters';
import prepareFilters from '@/v1/utils/prepareFilters';

const getFilters = (spotId, sectorId) => {
  const state = store.getState();
  const { selectedFilters } = state;
  if (selectedFilters && selectedFilters[spotId] && selectedFilters[spotId][sectorId]) {
    return prepareFilters(selectedFilters[spotId][sectorId]);
  }
  return prepareFilters(DEFAULT_FILTERS);
};

export default getFilters;

export const getMergedFilters = (filters, spotId, sectorId) => {
  const state = store.getState();
  const { selectedFilters } = state;
  let currentFilters = null;
  if (selectedFilters && selectedFilters[spotId] && selectedFilters[spotId][sectorId]) {
    currentFilters = selectedFilters[spotId][sectorId];
  } else {
    currentFilters = DEFAULT_FILTERS;
  }
  const mergeResult = R.mergeDeepLeft(
    filters[sectorId],
    currentFilters,
  );
  return prepareFilters(mergeResult);
};
