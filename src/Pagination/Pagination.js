import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import * as R             from 'ramda';
import './Pagination.css';

export default class Pagination extends Component {
    render() {
        return <div className="content__pagination">
            <div className="pagination">
                <div className="pagination__item pagination__toggle pagination__toggle-prev"
                     onClick={() => this.props.onPageChange(this.props.firstPage)}>

                </div>
                {R.map((page) => <div
                    key={page}
                    onClick={() => this.props.onPageChange(page)}
                    className={'pagination__item' + (page === this.props.page ? ' pagination__item_active' : '')}>{page}</div>, this.props.pagesList)}
                <div className="pagination__item pagination__toggle pagination__toggle-next"
                     onClick={() => this.props.onPageChange(this.props.lastPage)}>

                </div>
            </div>
        </div>;
    }
}

Pagination.propTypes = {
    page: PropTypes.number.isRequired,
    firstPage: PropTypes.number.isRequired,
    lastPage: PropTypes.number.isRequired,
    pagesList: PropTypes.array.isRequired,
    onPageChange: PropTypes.func.isRequired
};
