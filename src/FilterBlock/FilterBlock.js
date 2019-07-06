import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import ViewModeSwitcher from '../ViewModeSwitcher/ViewModeSwitcher';
import ComboBox from '../ComboBox/ComboBox';
import { PERIOD_FILTERS } from '../Constants/PeriodFilters';
import { CATEGORIES_ITEMS } from '../Constants/Categories';
import './FilterBlock.css';

const FilterBlock = ({
  categoryId,
  onCategoryChange,
  period,
  changePeriodFilter,
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
}) => (
  <div className="content__filter">
    <div className="content__filter-item content__filter-item_category">
      <div>
        <span className="filter-block__title">Категория</span>
        <ComboBox
          tabIndex={1}
          onChange={onCategoryChange}
          currentId={categoryId}
          textFieldName="title"
          items={CATEGORIES_ITEMS}
        />
      </div>
    </div>
    <div className="content__filter-item content__filter-item_period">
      <div>
        <span className="filter-block__title">Период</span>
        <ComboBox
          tabIndex={2}
          onChange={changePeriodFilter}
          currentId={period}
          textFieldName="text"
          items={PERIOD_FILTERS}
        />
      </div>
    </div>
    <div className="content__filter-item content__filter-item_result">
      <div>
        <span className="filter-block__title">Фильтры</span>
        <ComboBox
          tabIndex={3}
          onChange={onFilterChange}
          multipleSelect
          currentValue={
            R.join(
              ', ',
              R.map(
                e => R.slice(0, -2, e.text),
                R.filter(e => e.selected, filters),
              ),
            )
          }
          textFieldName="text"
          items={filters}
        />
      </div>
    </div>
    <ViewModeSwitcher
      onViewModeChange={onViewModeChange}
      viewMode={viewMode}
    />
  </div>
);

FilterBlock.propTypes = {
  viewMode: PropTypes.string.isRequired,
  onViewModeChange: PropTypes.func.isRequired,
  categoryId: PropTypes.number.isRequired,
  period: PropTypes.number.isRequired,
  filters: PropTypes.array.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  changePeriodFilter: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
};

export default FilterBlock;
