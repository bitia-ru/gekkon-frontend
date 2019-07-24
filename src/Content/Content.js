import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import RouteCardView from '../RouteCardView/RouteCardView';
import FilterBlock from '../FilterBlock/FilterBlock';
import Pagination from '../Pagination/Pagination';
import './Content.css';

const NUM_OF_DISPLAYED_PAGES = 5;

export default class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewMode: 'table',
    };
  }

    changeViewMode = (viewMode) => {
      this.setState({ viewMode });
    };

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
        period,
        onFilterChange,
        filters,
        categoryId,
        onCategoryChange,
        changePeriodFilter,
        ctrlPressed,
        addRoute,
        sectorId,
        routes,
        ascents,
        onRouteClick,
        changePage,
      } = this.props;
      const { viewMode } = this.state;
      return (
        <div className="content">
          <div className="content__container">
            <FilterBlock
              viewMode={viewMode}
              onViewModeChange={this.changeViewMode}
              period={period}
              onFilterChange={onFilterChange}
              filters={filters}
              user={user}
              categoryId={categoryId}
              onCategoryChange={onCategoryChange}
              changePeriodFilter={changePeriodFilter}
            />
            <RouteCardView
              viewMode={viewMode}
              ctrlPressed={ctrlPressed}
              addRoute={addRoute}
              sectorId={sectorId}
              user={user}
              routes={routes}
              ascents={ascents}
              onRouteClick={onRouteClick}
            />
            <Pagination
              onPageChange={changePage}
              page={page}
              pagesList={this.pagesList()}
              firstPage={1}
              lastPage={numOfPages}
            />
          </div>
        </div>
      );
    }
}

Content.propTypes = {
  user: PropTypes.object,
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
  ctrlPressed: PropTypes.bool.isRequired,
  addRoute: PropTypes.func.isRequired,
  sectorId: PropTypes.number.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};
