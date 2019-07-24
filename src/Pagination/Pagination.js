import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import './Pagination.css';

const Pagination = ({
  onPageChange,
  firstPage,
  page,
  pagesList,
  lastPage,
}) => {
  const pageActiveClass = currentPage => (
    currentPage === page ? ' pagination__item_active' : ''
  );
  return (
    <div className="content__pagination">
      {
        pagesList.length > 1 && (
          <div className="pagination">
            <div
              className="pagination__item pagination__toggle pagination__toggle-prev"
              role="button"
              tabIndex={0}
              style={{ outline: 'none' }}
              onClick={() => onPageChange(firstPage)}
            />
            {
              R.map(
                currentPage => (
                  <div
                    key={currentPage}
                    role="button"
                    tabIndex={0}
                    style={{ outline: 'none' }}
                    onClick={() => onPageChange(currentPage)}
                    className={`pagination__item${pageActiveClass(currentPage)}`}
                  >
                    {currentPage}
                  </div>
                ),
                pagesList,
              )
            }
            <div
              className="pagination__item pagination__toggle pagination__toggle-next"
              role="button"
              tabIndex={0}
              style={{ outline: 'none' }}
              onClick={() => onPageChange(lastPage)}
            />
          </div>
        )
      }
    </div>
  );
};

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  firstPage: PropTypes.number.isRequired,
  lastPage: PropTypes.number.isRequired,
  pagesList: PropTypes.array.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
