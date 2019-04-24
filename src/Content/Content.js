import React, {Component} from 'react';
import RouteCardView      from '../RouteCardView/RouteCardView';
import FilterBlock        from '../FilterBlock/FilterBlock';
import Pagination         from '../Pagination/Pagination';
import PropTypes          from 'prop-types';
import * as R             from 'ramda';
import './Content.css';

const NUM_OF_DISPLAYED_PAGES = 5;

export default class Content extends Component {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: 'table'
        }
    }

    changeViewMode = (viewMode) => {
        this.setState({viewMode: viewMode})
    };

    pagesList = () => {
        if (NUM_OF_DISPLAYED_PAGES >= this.props.numOfPages) {
            return R.range(1, this.props.numOfPages + 1);
        }
        let firstPage = this.props.page - Math.floor(NUM_OF_DISPLAYED_PAGES / 2);
        let lastPage = firstPage + NUM_OF_DISPLAYED_PAGES;
        if (firstPage >= 1 && lastPage <= this.props.numOfPages) {
            return R.range(firstPage, lastPage);
        }
        if (firstPage >= 1) {
            return R.range(this.props.numOfPages - NUM_OF_DISPLAYED_PAGES + 1, this.props.numOfPages + 1);
        }
        return R.range(1, NUM_OF_DISPLAYED_PAGES + 1);
    };

    render() {
        return <div className="content">
            <div className="content__container">
                <FilterBlock viewMode={this.state.viewMode}
                             onViewModeChange={this.changeViewMode}
                             period={this.props.period}
                             result={this.props.result}
                             user={this.props.user}
                             changeResultFilter={this.props.changeResultFilter}
                             changeCategoryFilter={this.props.changeCategoryFilter}
                             changePeriodFilter={this.props.changePeriodFilter}/>
                <RouteCardView viewMode={this.state.viewMode}
                               ctrlPressed={this.props.ctrlPressed}
                               addRoute={this.props.addRoute}
                               sectorId={this.props.sectorId}
                               user={this.props.user}
                               routes={this.props.routes}
                               ascents={this.props.ascents}
                               onRouteClick={this.props.onRouteClick}/>
                <Pagination onPageChange={this.props.changePage}
                            page={this.props.page}
                            pagesList={this.pagesList()}
                            firstPage={1}
                            lastPage={this.props.numOfPages}/>
            </div>
        </div>;
    }
}

Content.propTypes = {
    routes: PropTypes.array.isRequired,
    ascents: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    numOfPages: PropTypes.number.isRequired,
    period: PropTypes.number.isRequired,
    result: PropTypes.array.isRequired,
    changeCategoryFilter: PropTypes.func.isRequired,
    changePage: PropTypes.func.isRequired,
    changePeriodFilter: PropTypes.func.isRequired,
    changeResultFilter: PropTypes.func.isRequired,
    ctrlPressed: PropTypes.bool.isRequired,
    addRoute: PropTypes.func.isRequired,
    sectorId: PropTypes.number.isRequired
};
