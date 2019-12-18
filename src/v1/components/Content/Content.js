import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import RouteCardView from '../RouteCardView/RouteCardView';
import FilterBlock from '../FilterBlock/FilterBlock';
import Pagination from '../Pagination/Pagination';
import SectorContext from '../../contexts/SectorContext';
import getNumOfPages from '../../utils/getNumOfPages';
import './Content.css';

const NUM_OF_DISPLAYED_PAGES = 5;

class Content extends Component {
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
        addRoute,
        onRouteClick,
        changePage,
        viewMode,
        changeViewMode,
      } = this.props;
      return (
        <SectorContext.Consumer>
          {
            ({ sector }) => {
              const diagram = sector && sector.diagram && sector.diagram.url;
              return (
                <div className="content">
                  <div className="content__container">
                    <FilterBlock
                      viewMode={viewMode}
                      viewModeData={
                        sector
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
                      addRoute={addRoute}
                      diagram={diagram}
                      user={user}
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
        </SectorContext.Consumer>
      );
    }
}

Content.propTypes = {
  user: PropTypes.object,
  diagram: PropTypes.string,
  date: PropTypes.string,
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
  addRoute: PropTypes.func.isRequired,
  onRouteClick: PropTypes.func.isRequired,
  viewMode: PropTypes.string.isRequired,
  changeViewMode: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  numOfPages: getNumOfPages(state),
});

export default withRouter(connect(mapStateToProps)(Content));
