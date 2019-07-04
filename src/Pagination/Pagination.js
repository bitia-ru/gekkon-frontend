import React     from 'react';
import PropTypes from 'prop-types';
import * as R    from 'ramda';
import './Pagination.css';

const Pagination = ({
                        onPageChange,
                        firstPage,
                        page,
                        pagesList,
                        lastPage,
                    }) => (
    <div className="content__pagination">
        <div className="pagination">
            <div className="pagination__item pagination__toggle pagination__toggle-prev"
                 onClick={() => onPageChange(firstPage)}>

            </div>
            {R.map((currentPage) => <div
                key={currentPage}
                onClick={() => onPageChange(currentPage)}
                className={'pagination__item' + (currentPage === page ? ' pagination__item_active' : '')}>{currentPage}</div>, pagesList)}
            <div className="pagination__item pagination__toggle pagination__toggle-next"
                 onClick={() => onPageChange(lastPage)}>

            </div>
        </div>
    </div>
);

Pagination.propTypes = {
    page: PropTypes.number.isRequired,
    firstPage: PropTypes.number.isRequired,
    lastPage: PropTypes.number.isRequired,
    pagesList: PropTypes.array.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
