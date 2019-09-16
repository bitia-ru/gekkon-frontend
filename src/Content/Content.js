import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import RouteCardView from '../RouteCardView/RouteCardView';
import FilterBlock from '../FilterBlock/FilterBlock';
import Pagination from '../Pagination/Pagination';
import './Content.css';

const NUM_OF_DISPLAYED_PAGES = 5;

export default class Content extends Component {
    pagesList = () => {
      const { numOfPages, page } = this.props;
      if (NUM_OF_DISPLAYED_PAGES >= numOfPages) {
        return R.range(1, numOfPages + 1);
      }
      const firstPage = page - Math.floor(NUM_OF_DISPLAYED_PAGES / 2);
      const lastPage = firstPage + NUM_OF_DISPLAYED_PAGES;
      if (firstPage >= 1 && lastPage <= numOfPages) {
        return R.range(firstPage, lastPage);
      }
      if (firstPage >= 1) {
        return R.range(numOfPages - NUM_OF_DISPLAYED_PAGES + 1, numOfPages + 1);
      }
      return R.range(1, NUM_OF_DISPLAYED_PAGES + 1);
    };

    render() {
      const {
        page,
        numOfPages,
        user,
        date,
        period,
        onFilterChange,
        filters,
        categoryId,
        onCategoryChange,
        changePeriodFilter,
        changeDateFilter,
        ctrlPressed,
        addRoute,
        sectorId,
        diagram,
        routes,
        ascents,
        onRouteClick,
        changePage,
        viewMode,
        changeViewMode,
      } = this.props;
      return (
        <div className="content">
          <div className="content__container">
            <FilterBlock
              viewMode={viewMode}
              viewModeData={
                sectorId !== 0
                  ? {
                    scheme: {
                      title: diagram ? undefined : 'Схема зала ещё не загружена',
                      disabled: diagram === null,
                    },
                    table: {},
                    list: {},
                  }
                  : {
                    table: {},
                    list: {},
                  }
              }
              onViewModeChange={changeViewMode}
              period={period}
              date={date}
              onFilterChange={onFilterChange}
              filters={filters}
              user={user}
              categoryId={categoryId}
              onCategoryChange={onCategoryChange}
              changePeriodFilter={changePeriodFilter}
              changeDateFilter={changeDateFilter}
            />
            <RouteCardView
              viewMode={viewMode}
              ctrlPressed={ctrlPressed}
              addRoute={addRoute}
              sectorId={sectorId}
              diagram={diagram}
              user={user}
              routes={routes}
              ascents={ascents}
              onRouteClick={onRouteClick}
            />
            {
              viewMode !== 'scheme' && <Pagination
                onPageChange={changePage}
                page={page}
                pagesList={this.pagesList()}
                firstPage={1}
                lastPage={numOfPages}
              />
            }
          </div>
        </div>
      );
    }
}

Content.propTypes = {
  user: PropTypes.object,
  diagram: PropTypes.string,
  date: PropTypes.string,
  routes: PropTypes.array.isRequired,
  ascents: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  numOfPages: PropTypes.number.isRequired,
  period: PropTypes.number.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired,
  categoryId: PropTypes.number.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  changePage: PropTypes.func.isRequired,
  changePeriodFilter: PropTypes.func.isRequired,
  changeDateFilter: PropTypes.func.isRequired,
  ctrlPressed: PropTypes.bool.isRequired,
  addRoute: PropTypes.func.isRequired,
  sectorId: PropTypes.number.isRequired,
  onRouteClick: PropTypes.func.isRequired,
  viewMode: PropTypes.string.isRequired,
  changeViewMode: PropTypes.func.isRequired,
};
