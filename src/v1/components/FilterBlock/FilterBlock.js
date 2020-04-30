import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import ViewModeSwitcher from '../ViewModeSwitcher/ViewModeSwitcher';
import DatePicker from '../DatePicker/DatePicker';
import ComboBox from '../ComboBox/ComboBox';
import { PERIOD_FILTERS } from '../../Constants/PeriodFilters';
import { CATEGORIES, CATEGORIES_ITEMS } from '../../Constants/Categories';
import { dateToTextFormatter } from '../../Constants/Date';
import './FilterBlock.css';
import getFilters from '../../utils/getFilters';
import { RESULT_FILTERS } from '../../Constants/ResultFilters';
import { setSelectedFilter, setSelectedPage, setSelectedViewMode } from '../../actions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { avail } from '../../utils';
import Button from '@/v2/components/Button/Button';
import getCategoryId from '../../utils/getCategoryId';

class FilterBlock extends Component {
  getSpotId = () => {
    const { match } = this.props;
    return parseInt(match.params.id, 10);
  };

  getSectorId = () => {
    const { match } = this.props;
    return match.params.sector_id ? parseInt(match.params.sector_id, 10) : 0;
  };

  changeCategoryFilter = (categoryFrom, categoryTo) => {
    const {
      setSelectedFilter: setSelectedFilterProp,
      setSelectedPage: setSelectedPageProp,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    if (categoryFrom !== null) {
      setSelectedFilterProp(spotId, sectorId, 'categoryFrom', categoryFrom);
      setSelectedPageProp(spotId, sectorId, 1);
    }
    if (categoryTo !== null) {
      setSelectedFilterProp(spotId, sectorId, 'categoryTo', categoryTo);
      setSelectedPageProp(spotId, sectorId, 1);
    }
  };

  changePeriodFilter = (period) => {
    const {
      setSelectedFilter: setSelectedFilterProp,
      setSelectedPage: setSelectedPageProp,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    setSelectedFilterProp(spotId, sectorId, 'period', period);
    setSelectedPageProp(spotId, sectorId, 1);
  };

  changeDateFilter = (date) => {
    const {
      setSelectedFilter: setSelectedFilterProp,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    setSelectedFilterProp(spotId, sectorId, 'date', date ? date.format() : undefined);
  };

  changeFilter = (name, value) => {
    const {
      setSelectedFilter: setSelectedFilterProp,
      setSelectedPage: setSelectedPageProp,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    setSelectedFilterProp(spotId, sectorId, name, value);
    setSelectedPageProp(spotId, sectorId, 1);
    const state = {};
    state[name] = value;
  };

  onViewModeChange = (viewMode) => {
    const {
      setSelectedFilter: setSelectedFilterProp,
      setSelectedViewMode: setSelectedViewModeProp,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    let date = '';
    setSelectedViewModeProp(spotId, sectorId, viewMode);
    if (viewMode === 'scheme') {
      date = getFilters(spotId, sectorId).date;
      setSelectedFilterProp(spotId, sectorId, 'date', date);
    }
  };

  onFilterChange = (id) => {
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    const filters = getFilters(spotId, sectorId);
    this.changeFilter(id, !filters[id]);
  };

  onCategoryChange = (id) => {
    switch (id) {
    case 0:
      this.changeCategoryFilter(CATEGORIES[0], CATEGORIES[CATEGORIES.length - 1]);
      break;
    case 1:
      this.changeCategoryFilter(CATEGORIES[0], '6a+');
      break;
    case 2:
      this.changeCategoryFilter('6a', '6b+');
      break;
    case 3:
      this.changeCategoryFilter('6b', '7a+');
      break;
    case 4:
      this.changeCategoryFilter('7a', CATEGORIES[CATEGORIES.length - 1]);
      break;
    default:
      break;
    }
  };

  render() {
    const {
      viewModeData,
      user,
      viewMode,
      history,
      match,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    const {
      categoryFrom,
      categoryTo,
      period,
      date,
      filters,
    } = getFilters(spotId, sectorId);
    const defaultFilters = R.filter(
      e => !R.contains(e.id, R.keys(RESULT_FILTERS)),
      filters,
    );
    const currentFilters = (
      viewMode === 'scheme'
        ? R.filter(f => f.id !== 'outdated', avail(user) ? filters : defaultFilters)
        : avail(user) ? filters : defaultFilters
    );
    return (
      <div className="content__filter">
        <div className="content__filter-item content__filter-item_category">
          <div>
            <span className="filter-block__title">Категория</span>
            <ComboBox
              tabIndex={1}
              onChange={this.onCategoryChange}
              currentId={getCategoryId(categoryFrom, categoryTo)}
              textFieldName="title"
              items={CATEGORIES_ITEMS}
            />
          </div>
        </div>
        <div className="content__filter-item content__filter-item_period">
          <div>
            {
              viewMode === 'scheme'
                ? (
                  <>
                    <span className="filter-block__title">Дата</span>
                    <DatePicker
                      date={date}
                      onSelect={this.changeDateFilter}
                      formatter={dateToTextFormatter}
                    />
                  </>
                )
                : (
                  <>
                    <span className="filter-block__title">Период</span>
                    <ComboBox
                      tabIndex={2}
                      onChange={this.changePeriodFilter}
                      currentId={period}
                      textFieldName="text"
                      items={PERIOD_FILTERS}
                    />
                  </>
                )
            }
          </div>
        </div>
        <div className="content__filter-item content__filter-item_result">
          <div>
            <span className="filter-block__title">Фильтры</span>
            <ComboBox
              tabIndex={3}
              onChange={this.onFilterChange}
              multipleSelect
              currentValue={
                R.join(
                  ', ',
                  R.map(
                    e => R.slice(0, -2, e.text),
                    R.filter(e => e.selected, currentFilters),
                  ),
                )
              }
              textFieldName="text"
              items={currentFilters}
            />
          </div>
        </div>
        {
          avail(user) && sectorId !== 0 && <div className="content__filter-item">
            <div>
              <span className="filter-block__title">&nbsp;</span>
              <Button
                tabIndex={4}
                style="gray"
                onClick={() => { history.push(`${match.url}/routes/new`); }}
              >
                +
              </Button>
            </div>
          </div>
        }
        <ViewModeSwitcher
          viewModeData={viewModeData}
          onViewModeChange={this.onViewModeChange}
          viewMode={viewMode}
        />
      </div>
    );
  }
}

FilterBlock.propTypes = {
  viewModeData: PropTypes.object,
  viewMode: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  user: state.usersStore.users[state.usersStore.currentUserId],
});

const mapDispatchToProps = dispatch => ({
  setSelectedViewMode: (spotId, sectorId, viewMode) => (
    dispatch(setSelectedViewMode(spotId, sectorId, viewMode))
  ),
  setSelectedFilter: (spotId, sectorId, filterName, filterValue) => (
    dispatch(setSelectedFilter(spotId, sectorId, filterName, filterValue))
  ),
  setSelectedPage: (spotId, sectorId, page) => dispatch(setSelectedPage(spotId, sectorId, page)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FilterBlock));
