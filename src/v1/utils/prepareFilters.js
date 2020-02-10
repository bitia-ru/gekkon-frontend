import * as R from 'ramda';
import { RESULT_FILTERS } from '@/v1/Constants/ResultFilters';

const filtersLookUp = {
  personal: 'Авторские трассы',
  outdated: 'Скрученные',
  liked: 'Понравившиеся мне',
  flash: 'Флешанул',
  red_point: 'Пролез',
  unsuccessful: 'Не пройдена',
};

const prepareFilters = (filters) => {
  return {
    ...filters,
    filters: R.map(
      e => (
        {
          clickable: true,
          id: e,
          selected: filters[e],
          text: `${filtersLookUp[e]} ${filters[e] ? ' ✓' : ''}`,
          value: e,
        }
      ),
      R.concat(R.keys(RESULT_FILTERS), ['personal', 'outdated', 'liked']),
    ),
  };
};

export default prepareFilters;
