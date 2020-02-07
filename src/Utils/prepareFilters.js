import * as R from 'ramda';
import { DEFAULT_FILTERS } from '@/Constants/DefaultFilters';

const prepareFilters = (filters) => {
  let filtersNew = R.clone(filters);
  R.forEach(
    (filterName) => {
      if (R.findIndex(R.propEq('id', filterName))(filtersNew) === -1) {
        filtersNew = R.append(
          R.find(R.propEq('id', filterName))(DEFAULT_FILTERS.filters),
          filtersNew,
        );
      }
    },
    R.map(filter => filter.id, DEFAULT_FILTERS.filters),
  );

  return filtersNew;
};

export default prepareFilters;
